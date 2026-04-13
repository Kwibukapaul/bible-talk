import { useEffect, useState } from 'react';
import { BookOpen, Video, Book, Users, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useRouter } from '../hooks/useRouter';
import { PostManager } from '../components/admin/PostManager';
import { BookManager } from '../components/admin/BookManager';
import { VideoManager } from '../components/admin/VideoManager';
import { SubscriberManager } from '../components/admin/SubscriberManager';

type Tab = 'overview' | 'posts' | 'books' | 'videos' | 'subscribers';

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'posts', label: 'Posts', icon: BookOpen },
  { id: 'books', label: 'Books', icon: Book },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'subscribers', label: 'Subscribers', icon: Users },
];

function StatsCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof BookOpen; color: string }) {
  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-400 text-sm">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export function AdminDashboardPage() {
  const { navigate } = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState({ posts: 0, books: 0, videos: 0, subscribers: 0 });
  const [recentActivity, setRecentActivity] = useState<{ type: string; title: string; date: string }[]>([]);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { navigate('/admin/login'); return; }
      setUser({ email: data.user.email || '' });
    });

    Promise.all([
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('books').select('*', { count: 'exact', head: true }),
      supabase.from('videos').select('*', { count: 'exact', head: true }),
      supabase.from('subscribers').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('id, title, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('books').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
      supabase.from('videos').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
    ]).then(([p, b, v, s, rp, rb, rv]) => {
      setStats({
        posts: p.count || 0,
        books: b.count || 0,
        videos: v.count || 0,
        subscribers: s.count || 0,
      });

      const activity: { type: string; title: string; date: string }[] = [];
      (rp.data || []).forEach((x) => activity.push({ type: 'Post', title: x.title, date: x.created_at }));
      (rb.data || []).forEach((x) => activity.push({ type: 'Book', title: x.title, date: x.created_at }));
      (rv.data || []).forEach((x) => activity.push({ type: 'Video', title: x.title, date: x.created_at }));
      activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivity(activity.slice(0, 5));
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#060b17] flex">
      <aside className="w-56 flex-shrink-0 bg-[#0a1220] border-r border-amber-400/10 flex flex-col">
        <div className="p-5 border-b border-amber-400/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <BookOpen size={15} className="text-amber-400" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Admin Panel</p>
              <p className="text-slate-500 text-xs truncate max-w-[110px]">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === id
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-amber-400/10 space-y-1">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            <ChevronRight size={15} className="rotate-180" />
            View Site
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 sm:p-8">
          {tab === 'overview' && (
            <div>
              <h1 className="text-xl font-bold text-white mb-6">Dashboard Overview</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard label="Total Posts" value={stats.posts} icon={BookOpen} color="bg-amber-500/10 text-amber-400" />
                <StatsCard label="Books" value={stats.books} icon={Book} color="bg-sky-500/10 text-sky-400" />
                <StatsCard label="Videos" value={stats.videos} icon={Video} color="bg-emerald-500/10 text-emerald-400" />
                <StatsCard label="Subscribers" value={stats.subscribers} icon={Users} color="bg-rose-500/10 text-rose-400" />
              </div>

              <div className="glass-card rounded-xl p-5">
                <h2 className="text-slate-200 font-semibold text-sm mb-4">Recent Content</h2>
                {recentActivity.length === 0 ? (
                  <p className="text-slate-500 text-sm py-4 text-center">No content yet. Start adding posts, books, or videos!</p>
                ) : (
                  <div className="space-y-2">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">{item.type}</span>
                          <p className="text-slate-300 text-sm truncate max-w-[280px]">{item.title}</p>
                        </div>
                        <p className="text-slate-500 text-xs whitespace-nowrap ml-4">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 glass-card rounded-xl p-5">
                <h2 className="text-slate-200 font-semibold text-sm mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {([
                    { label: 'New Post', tab: 'posts' as Tab, icon: BookOpen },
                    { label: 'Add Book', tab: 'books' as Tab, icon: Book },
                    { label: 'Add Video', tab: 'videos' as Tab, icon: Video },
                    { label: 'Subscribers', tab: 'subscribers' as Tab, icon: Users },
                  ]).map(({ label, tab: t, icon: Icon }) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-amber-400/10 hover:border-amber-400/30 hover:bg-amber-400/5 transition-all text-slate-400 hover:text-amber-400"
                    >
                      <Icon size={20} />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'posts' && (
            <div>
              <PostManager />
            </div>
          )}

          {tab === 'books' && (
            <div>
              <BookManager />
            </div>
          )}

          {tab === 'videos' && (
            <div>
              <VideoManager />
            </div>
          )}

          {tab === 'subscribers' && (
            <div>
              <SubscriberManager />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
