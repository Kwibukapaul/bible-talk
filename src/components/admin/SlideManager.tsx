import { useEffect, useState } from "react";
import { Plus, X, Save, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Slide {
  id: string;
  reference: string;
  content: string;
  position: number;
  active: boolean;
}

function SlideForm({
  slide,
  onSave,
  onCancel,
}: {
  slide?: Slide;
  onSave: (s: Partial<Slide>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Slide>>(
    slide ?? { reference: "", content: "", position: 0, active: true },
  );
  const [saving, setSaving] = useState(false);
  useEffect(
    () =>
      setForm(
        slide ?? { reference: "", content: "", position: 0, active: true },
      ),
    [slide],
  );
  const set = (k: keyof Slide, v: any) =>
    setForm((f) => ({ ...(f as object), [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl glass-card rounded-2xl p-6 mb-8 animate-fade-in-up"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">
            {slide ? "Edit Slide" : "New Slide"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">
              Reference
            </label>
            <input
              className="input-dark"
              value={form.reference || ""}
              onChange={(e) => set("reference", e.target.value)}
              placeholder="Hebrews 4:12"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">
              Content
            </label>
            <textarea
              className="input-dark"
              style={{ minHeight: 120 }}
              value={form.content || ""}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Slide content"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">
                Position
              </label>
              <input
                type="number"
                className="input-dark"
                value={form.position ?? 0}
                onChange={(e) => set("position", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">
                Active
              </label>
              <div className="mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form.active}
                    onChange={(e) => set("active", e.target.checked)}
                  />
                  <span className="text-slate-300 text-sm">
                    Visible in slideshow
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {slide ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function SlideManager() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Slide | undefined>();

  const load = async () => {
    const { data } = await supabase
      .from("slides")
      .select("*")
      .order("position", { ascending: true });
    setSlides(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: Partial<Slide>) => {
    if (editing) {
      await supabase
        .from("slides")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", editing.id);
    } else {
      await supabase.from("slides").insert(data);
    }
    setShowForm(false);
    setEditing(undefined);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    await supabase.from("slides").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Homepage Slides</h2>
        <button
          onClick={() => {
            setEditing(undefined);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors"
        >
          <Plus size={15} /> New Slide
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-8 text-center">
          Loading...
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          No slides yet. Create your first slide!
        </div>
      ) : (
        <div className="space-y-2">
          {slides.map((s) => (
            <div
              key={s.id}
              className="glass-card rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">{s.reference}</p>
                <p className="text-slate-400 text-sm truncate max-w-[600px]">
                  {s.content}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditing(s);
                    setShowForm(true);
                  }}
                  className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-amber-400/10"
                >
                  <Save size={14} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-400/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <SlideForm
          slide={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(undefined);
          }}
        />
      )}
    </div>
  );
}
