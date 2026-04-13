import { useEffect, useState } from "react";
import { BookOpen, Search, X, ArrowLeft, Eye, Clock, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  Post,
  PostCategory,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "../lib/types";
import { PostCard } from "../components/posts/PostCard";
import { AnimatedSection } from "../components/ui/AnimatedSection";

const CATEGORIES: { value: PostCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "study", label: "Bible Study" },
  { value: "quote", label: "Quotes" },
  { value: "scripture", label: "Scripture" },
  { value: "testimony", label: "Testimonies" },
  { value: "story", label: "Stories" },
  { value: "devotional", label: "Devotionals" },
];

function PostModal({ post, onClose }: { post: Post; onClose: () => void }) {
  useEffect(() => {
    supabase
      .from("posts")
      .update({ views: post.views + 1 })
      .eq("id", post.id)
      .then(() => {});
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [post.id]);

  const defaultImages: Record<string, string> = {
    quote:
      "https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg?auto=compress&cs=tinysrgb&w=1200",
    study:
      "https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=1200",
    testimony:
      "https://images.pexels.com/photos/8468155/pexels-photo-8468155.jpeg?auto=compress&cs=tinysrgb&w=1200",
    story:
      "https://images.pexels.com/photos/1637858/pexels-photo-1637858.jpeg?auto=compress&cs=tinysrgb&w=1200",
    devotional:
      "https://images.pexels.com/photos/3184290/pexels-photo-3184290.jpeg?auto=compress&cs=tinysrgb&w=1200",
    scripture:
      "https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg?auto=compress&cs=tinysrgb&w=1200",
  };

  const image =
    post.cover_image || defaultImages[post.category] || defaultImages.study;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl glass-card rounded-2xl overflow-hidden animate-fade-in-up mb-8">
        <div className="relative h-56 md:h-72">
          <img
            src={image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1628] to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-6">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[post.category]}`}
            >
              {CATEGORY_LABELS[post.category]}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
            {post.title}
          </h2>
          <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
            <span className="flex items-center gap-1.5">
              <User size={13} /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={13} /> {post.views + 1} views
            </span>
          </div>
          <div className="prose-dark text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<PostCategory | "all">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    setLoading(true);
    let q = supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (activeCategory !== "all") q = q.eq("category", activeCategory);
    q.then(({ data }) => {
      setPosts(data || []);
      setLoading(false);
    });
  }, [activeCategory]);

  const filtered = posts.filter((p) =>
    search
      ? p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase())
      : true,
  );

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-4">
            <BookOpen size={12} />
            Bible Studies & More
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Bible Talk Blog
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Dive into Bible studies, quotes, scriptures, testimonies, stories
            and devotionals
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9 pr-8"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeCategory === value
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-slate-400 border border-slate-700/50 hover:text-amber-300 hover:border-amber-500/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-xl overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-slate-700/30" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-700/30 rounded w-3/4" />
                <div className="h-3 bg-slate-700/30 rounded w-full" />
                <div className="h-3 bg-slate-700/30 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={40} className="text-amber-400/30 mx-auto mb-3" />
          <p className="text-slate-400">
            No posts found. {search && "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <AnimatedSection key={post.id} delay={(i % 6) * 80}>
              <PostCard post={post} onClick={() => setSelectedPost(post)} />
            </AnimatedSection>
          ))}
        </div>
      )}

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}
