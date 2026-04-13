import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Eye, EyeOff, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Post, PostCategory, CATEGORY_LABELS } from '../../lib/types';

const EMPTY_POST: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'views'> = {
  title: '', content: '', excerpt: '', category: 'study', author: 'Admin', cover_image: '', published: false,
};

function PostForm({ post, onSave, onCancel }: {
  post?: Post;
  onSave: (data: Partial<Post>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(post ?? { ...EMPTY_POST });
  const [saving, setSaving] = useState(false);

  const set = (field: string, val: unknown) => setForm((f) => ({ ...f, [field]: val }));

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
          <h3 className="text-white font-semibold">{post ? 'Edit Post' : 'New Post'}</h3>
          <button type="button" onClick={onCancel} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Title *</label>
            <input className="input-dark" value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="Post title" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Category *</label>
              <select className="input-dark" value={form.category} onChange={(e) => set('category', e.target.value as PostCategory)}>
                {(Object.keys(CATEGORY_LABELS) as PostCategory[]).map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Author</label>
              <input className="input-dark" value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Author name" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Excerpt (short preview)</label>
            <textarea className="input-dark" style={{ minHeight: '70px' }} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short description shown on cards" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Content *</label>
            <textarea className="input-dark" style={{ minHeight: '180px' }} value={form.content} onChange={(e) => set('content', e.target.value)} required placeholder="Full post content..." />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1.5">Cover Image URL</label>
            <input className="input-dark" value={form.cover_image} onChange={(e) => set('cover_image', e.target.value)} placeholder="https://..." />
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
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm transition-colors disabled:opacity-60"
          >
            {saving ? <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save size={14} />}
            {post ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Post | undefined>();

  const load = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Partial<Post>) => {
    if (editing) {
      await supabase.from('posts').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editing.id);
    } else {
      await supabase.from('posts').insert(data);
    }
    setShowForm(false);
    setEditing(undefined);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    load();
  };

  const togglePublish = async (post: Post) => {
    await supabase.from('posts').update({ published: !post.published }).eq('id', post.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Posts</h2>
        <button
          onClick={() => { setEditing(undefined); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/20 transition-colors"
        >
          <Plus size={15} /> New Post
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-8 text-center">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">No posts yet. Create your first post!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Views</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="max-w-[200px] truncate">{post.title}</td>
                  <td><span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">{CATEGORY_LABELS[post.category]}</span></td>
                  <td>{post.author}</td>
                  <td>{post.views}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-xs ${post.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => togglePublish(post)} title={post.published ? 'Unpublish' : 'Publish'} className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors">
                        {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => { setEditing(post); setShowForm(true); }} className="p-1.5 rounded text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <PostForm
          post={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(undefined); }}
        />
      )}
    </div>
  );
}
