import { useEffect, useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Book } from '../lib/types';
import { BookCard } from '../components/books/BookCard';
import { AnimatedSection } from '../components/ui/AnimatedSection';

export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('books')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBooks(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = books.filter((b) =>
    search
      ? b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs mb-4">
            <BookOpen size={12} />
            Free Christian Library
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Books Library</h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Browse and download Christian books, Bible commentaries, and spiritual resources for free
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <div className="max-w-sm mb-8">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search books or authors..."
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden animate-pulse">
              <div className="h-52 bg-slate-700/30" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-700/30 rounded w-3/4" />
                <div className="h-3 bg-slate-700/30 rounded w-1/2" />
                <div className="h-8 bg-slate-700/30 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={40} className="text-amber-400/30 mx-auto mb-3" />
          <p className="text-slate-400">{search ? 'No books match your search.' : 'No books available yet. Check back soon!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((book, i) => (
            <AnimatedSection key={book.id} delay={(i % 8) * 60}>
              <BookCard book={book} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
