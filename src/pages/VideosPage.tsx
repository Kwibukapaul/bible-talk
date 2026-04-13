import { useEffect, useState } from 'react';
import { Video, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Video as VideoType } from '../lib/types';
import { VideoCard } from '../components/videos/VideoCard';
import { AnimatedSection } from '../components/ui/AnimatedSection';

export function VideosPage() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setVideos(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = videos.filter((v) =>
    search
      ? v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-4">
            <Video size={12} />
            Bible Talk Sessions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Video Archive</h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Missed a session? Watch recorded Bible talks, sermons, and discussions here anytime
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <div className="max-w-sm mb-8">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9 pr-8"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </AnimatedSection>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-700/30" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-700/30 rounded w-3/4" />
                <div className="h-3 bg-slate-700/30 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Video size={40} className="text-amber-400/30 mx-auto mb-3" />
          <p className="text-slate-400">{search ? 'No videos match your search.' : 'No videos available yet. Check back soon!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video, i) => (
            <AnimatedSection key={video.id} delay={(i % 6) * 80}>
              <VideoCard video={video} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
