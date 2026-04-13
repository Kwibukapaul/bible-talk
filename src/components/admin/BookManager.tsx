import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Eye, EyeOff, X, Save, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Book } from '../../lib/types';

const EMPTY: Partial<Book> = { title: '', author: '', description: '', cover_image: '', file_url: '', file_size: '', published: false };

function BookForm({ book, onSave, onCancel }: {
  book?: Book;
  onSave: (data: Partial<Book>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Book>>(book ?? { ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const set = (field: string, val: unknown) => setForm((f) => ({ ...f, [field]: val }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'book' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'book') setUploading(true);
    else setUploadingCover(true);

    const bucket = type === 'book' ? 'books' : 'covers';
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });

    if (!error && data) {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      if (type === 'book') {
        set('file_url', urlData.publicUrl);
        set('file_size', `${(file.size / 1024 / 1024).toFixed(1)} MB`);
      } else {
        set('cover_image', urlData.publicUrl);
      }
    }
    if (type === 'book') setUploading(false);
    else setUploadingCover(false);
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
          <h3 className="text-white font-semibold">{book ? 'Edit Book' : 'Add Book'}</h3>
          <button type="button" onClick={onCancel} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Title *</label>
              <input className="input-dark" value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="Book title" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Author</label>
              <input className="input-dark" value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Author name" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Description</label>
            <textarea className="input-dark" style={{ minHeight: '80px' }} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Book description" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Cover Image</label>
            <input className="input-dark mb-2" value={form.cover_image} onChange={(e) => set('cover_image', e.target.value)} placeholder="https://... or upload below" />
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-500/20 text-amber-400 text-xs cursor-pointer hover:bg-amber-500/10 transition-colors w-fit">
              {uploadingCover ? <div className="w-3.5 h-3.5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /> : <Upload size={13} />}
              {uploadingCover ? 'Uploading...' : 'Upload Cover'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'cover')} />
            </label>
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Book File (PDF/EPUB)</label>
            <input className="input-dark mb-2" value={form.file_url} onChange={(e) => set('file_url', e.target.value)} placeholder="https://... or upload below" />
            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-500/20 text-amber-400 text-xs cursor-pointer hover:bg-amber-500/10 transition-colors w-fit">
              {uploading ? <div className="w-3.5 h-3.5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /> : <Upload size={13} />}
              {uploading ? 'Uploading...' : 'Upload Book File'}
              <input type="file" accept=".pdf,.epub,.doc,.docx" className="hidden" onChange={(e) => handleFileUpload(e, 'book')} />
            </label>
            {form.file_size && <p className="text-slate-500 text-xs mt-1">Size: {form.file_size}</p>}
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
            {book ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function BookManager() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Book | undefined>();

  const load = async () => {
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    setBooks(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Partial<Book>) => {
    if (editing) await supabase.from('books').update(data).eq('id', editing.id);
    else await supabase.from('books').insert(data);
    setShowForm(false);
    setEditing(undefined);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this book?')) return;
    await supabase.from('books').delete().eq('id', id);
    load();
  };

  const togglePublish = async (book: Book) => {
    await supabase.from('books').update({ published: !book.published }).eq('id', book.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Books</h2>
        <button onClick={() => { setEditing(undefined); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors">
          <Plus size={15} /> Add Book
        </button>
      </div>

      {loading ? <div className="text-slate-400 text-sm py-8 text-center">Loading...</div> : books.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">No books yet. Add your first book!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th>Title</th><th>Author</th><th>Size</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td className="max-w-[180px] truncate">{book.title}</td>
                  <td>{book.author || '—'}</td>
                  <td>{book.file_size || '—'}</td>
                  <td><span className={`px-2 py-0.5 rounded text-xs ${book.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>{book.published ? 'Published' : 'Draft'}</span></td>
                  <td className="whitespace-nowrap">{new Date(book.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => togglePublish(book)} className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors">{book.published ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                      <button onClick={() => { setEditing(book); setShowForm(true); }} className="p-1.5 rounded text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(book.id)} className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <BookForm
          book={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}
    </div>
  );
}
