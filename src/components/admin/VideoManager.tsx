import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Eye, EyeOff, X, Save, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Video, VideoType } from '../../lib/types';

const EMPTY: Partial<Video> = { title: '', description: '', video_url: '', video_type: 'youtube', thumbnail: '', duration: '', published: false };

function VideoForm({ video, onSave, onCancel }: {
  video?: Video;
  onSave: (data: Partial<Video>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Video>>(video ?? { ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (field: string, val: unknown) => setForm((f) => ({ ...f, [field]: val }));

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('videos').upload(path, file, { upsert: true });
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('videos').getPublicUrl(data.path);
      set('video_url', urlData.publicUrl);
      set('video_type', 'upload');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <form onSubmit={handleSubmit} className="relative w-full max-w-2xl glass-card rounded-2xl p-6 mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">{video ? 'Edit Video' : 'Add Video'}</h3>
          <button type="button" onClick={onCancel} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Title *</label>
            <input className="input-dark" value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="Video title" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Description</label>
            <textarea className="input-dark" style={{ minHeight: '70px' }} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Video description" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Video Type</label>
            <select className="input-dark" value={form.video_type} onChange={(e) => set('video_type', e.target.value as VideoType)}>
              <option value="youtube">YouTube URL</option>
              <option value="vimeo">Vimeo URL</option>
              <option value="upload">Upload File</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">
              {form.video_type === 'youtube' ? 'YouTube URL' : form.video_type === 'vimeo' ? 'Vimeo URL' : 'Video URL'}
            </label>
            <input className="input-dark mb-2" value={form.video_url} onChange={(e) => set('video_url', e.target.value)} placeholder={form.video_type === 'youtube' ? 'https://youtube.com/watch?v=...' : form.video_type === 'vimeo' ? 'https://vimeo.com/...' : 'https://...'} />
            {form.video_type === 'upload' && (
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-500/20 text-amber-400 text-xs cursor-pointer hover:bg-amber-500/10 transition-colors w-fit">
                {uploading ? <div className="w-3.5 h-3.5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /> : <Upload size={13} />}
                {uploading ? 'Uploading...' : 'Upload Video File'}
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              </label>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Thumbnail URL</label>
              <input className="input-dark" value={form.thumbnail} onChange={(e) => set('thumbnail', e.target.value)} placeholder="https://... (auto for YouTube)" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Duration</label>
              <input className="input-dark" value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 45:30" />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div
              onClick={() => set('published', !form.published)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 cursor-pointer ${form.published ? 'bg-amber-500' : 'bg-slate-600'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${form.published ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-slate-300 text-sm">{form.published ? 'Published' : 'Draft'}</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm transition-colors disabled:opacity-60">
            {saving ? <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save size={14} />}
            {video ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function VideoManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Video | undefined>();

  const load = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setVideos(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Partial<Video>) => {
    if (editing) await supabase.from('videos').update(data).eq('id', editing.id);
    else await supabase.from('videos').insert(data);
    setShowForm(false);
    setEditing(undefined);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    await supabase.from('videos').delete().eq('id', id);
    load();
  };

  const togglePublish = async (video: Video) => {
    await supabase.from('videos').update({ published: !video.published }).eq('id', video.id);
    load();
  };

  const typeLabel: Record<string, string> = { youtube: 'YouTube', vimeo: 'Vimeo', upload: 'Upload' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Videos</h2>
        <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors">
          <Plus size={15} /> Add Video
        </button>
      </div>

      {loading ? <div className="text-slate-400 text-sm py-8 text-center">Loading...</div> : videos.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">No videos yet. Add your first video!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr><th>Title</th><th>Type</th><th>Duration</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id}>
                  <td className="max-w-[200px] truncate">{video.title}</td>
                  <td><span className="px-2 py-0.5 rounded text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20">{typeLabel[video.video_type]}</span></td>
                  <td>{video.duration || '—'}</td>
                  <td><span className={`px-2 py-0.5 rounded text-xs ${video.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>{video.published ? 'Published' : 'Draft'}</span></td>
                  <td className="whitespace-nowrap">{new Date(video.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => togglePublish(video)} className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors">{video.published ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                      <button onClick={() => { setEditing(video); setShowForm(true); }} className="p-1.5 rounded text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(video.id)} className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <VideoForm
          video={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}
    </div>
  );
}
