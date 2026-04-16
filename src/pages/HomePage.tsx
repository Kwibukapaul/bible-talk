import { useEffect, useState } from "react";
import { BookOpen, Video, Book, ArrowRight, Star, Quote } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Post, Book as BookType, Video as VideoType } from "../lib/types";
import { PostCard } from "../components/posts/PostCard";
import { BookCard } from "../components/books/BookCard";
import { VideoCard } from "../components/videos/VideoCard";
import { SubscribeSection } from "../components/home/SubscribeSection";
import { AnimatedSection } from "../components/ui/AnimatedSection";
import { useRouter } from "../hooks/useRouter";

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 3,
}));

function HeroSection() {
  const { navigate } = useRouter();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060b17] via-[#080d1a] to-[#0e1628]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)]" />

      {STARS.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-amber-100 animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            opacity: 0.3,
          }}
        />
      ))}

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/3 blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-8">
            <Star size={11} fill="currentColor" />
            Welcome to Bible Talk Blog
            <Star size={11} fill="currentColor" />
          </div>
        </div>

        <h1 className="animate-fade-in-up delay-100 text-5xl md:text-7xl font-bold leading-tight mb-6">
          <span className="hero-title">Nourishing Your</span>
          <br />
          <span className="text-white">Spirit Through</span>
          <br />
          <span className="hero-title">God's Word</span>
        </h1>

        <p className="animate-fade-in-up delay-200 text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Explore Bible studies, devotionals, testimonies, and more. Download
          books and watch recorded sessions — all in one place for your
          spiritual growth.
        </p>

        <div className="animate-fade-in-up delay-300 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-300 transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
          >
            <BookOpen size={15} />
            Explore Studies
            <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate("/videos")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass-card text-white font-semibold text-sm hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Video size={15} className="text-amber-400" />
            Watch Sessions
          </button>
        </div>

        <div className="animate-fade-in-up delay-400 grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
          {[
            { icon: BookOpen, label: "Studies", sub: "Bible & devotional" },
            { icon: Book, label: "Books", sub: "Download & read" },
            { icon: Video, label: "Sessions", sub: "Watch & listen" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-2">
                <Icon size={16} className="text-amber-400" />
              </div>
              <p className="text-white text-sm font-medium">{label}</p>
              <p className="text-slate-500 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteBanner() {
  const [slides, setSlides] = useState<
    { id: string; reference: string; content: string }[]
  >([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("slides")
      .select("*")
      .eq("active", true)
      .order("position", { ascending: true })
      .then(({ data }) => {
        if (!mounted) return;
        if (data && data.length > 0) {
          setSlides(
            data.map((s: any) => ({
              id: s.id,
              reference: s.reference,
              content: s.content,
            })),
          );
        } else {
          setSlides([
            {
              id: "default",
              reference: "Hebrews 4:12",
              content:
                "For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit...",
            },
          ]);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 30000);
    return () => clearInterval(timer);
  }, [slides]);

  const slide = slides[index] || {
    reference: "Hebrews 4:12",
    content:
      "For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit...",
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-400/3 to-amber-500/5" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Quote
          size={36}
          className="text-amber-400/30 mx-auto mb-5 animate-float"
        />
        <div
          key={slide.id}
          className="transition-opacity duration-300 ease-in-out"
        >
          <p className="text-xl md:text-2xl text-slate-200 italic leading-relaxed font-light">
            {slide.content}
          </p>
          <p className="mt-4 text-amber-400 text-sm font-medium tracking-wider uppercase">
            — {slide.reference}
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const { navigate } = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [books, setBooks] = useState<BookType[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    Promise.all([
      supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("books")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("videos")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3),
    ]).then(([p, b, v]) => {
      if (p.data) setPosts(p.data);
      if (b.data) setBooks(b.data);
      if (v.data) setVideos(v.data);
    });
  }, []);

  return (
    <div>
      <HeroSection />
      <QuoteBanner />

      {posts.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Latest Posts
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Bible studies, quotes & testimonies
                </p>
              </div>
              <button
                onClick={() => navigate("/blog")}
                className="flex items-center gap-1.5 text-amber-400 text-sm hover:text-amber-300 transition-colors"
              >
                View all <ArrowRight size={14} />
              </button>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {posts.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 100}>
                <PostCard post={post} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {books.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Books Library
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Download and read for free
                </p>
              </div>
              <button
                onClick={() => navigate("/books")}
                className="flex items-center gap-1.5 text-amber-400 text-sm hover:text-amber-300 transition-colors"
              >
                View all <ArrowRight size={14} />
              </button>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-fr">
            {books.map((book, i) => (
              <AnimatedSection key={book.id} delay={i * 80}>
                <BookCard book={book} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Video Sessions
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Recorded Bible talk sessions
                </p>
              </div>
              <button
                onClick={() => navigate("/videos")}
                className="flex items-center gap-1.5 text-amber-400 text-sm hover:text-amber-300 transition-colors"
              >
                View all <ArrowRight size={14} />
              </button>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {videos.map((video, i) => (
              <AnimatedSection key={video.id} delay={i * 100}>
                <VideoCard video={video} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && books.length === 0 && videos.length === 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <BookOpen size={48} className="text-amber-400/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Content Coming Soon
            </h2>
            <p className="text-slate-400">
              The admin is preparing Bible studies and more. Check back soon!
            </p>
          </AnimatedSection>
        </section>
      )}

      <SubscribeSection />
    </div>
  );
}
