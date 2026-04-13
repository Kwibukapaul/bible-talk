import { Download, BookOpen, User } from 'lucide-react';
import { Book } from '../../lib/types';

interface Props {
  book: Book;
}

export function BookCard({ book }: Props) {
  const defaultCover = 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <div className="glass-card rounded-xl overflow-hidden card-hover group flex flex-col">
      <div className="relative h-52 overflow-hidden bg-[#0e1628] flex items-center justify-center">
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <img
            src={defaultCover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a]/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          {book.file_size && (
            <span className="text-xs text-slate-400 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
              {book.file_size}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-1">
          <BookOpen size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-amber-300 transition-colors duration-200 line-clamp-2">
            {book.title}
          </h3>
        </div>
        {book.author && (
          <p className="flex items-center gap-1 text-amber-400/70 text-xs mb-2">
            <User size={11} />
            {book.author}
          </p>
        )}
        {book.description && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
            {book.description}
          </p>
        )}

        {book.file_url ? (
          <a
            href={book.file_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 hover:border-amber-500/60 transition-all duration-200"
          >
            <Download size={13} />
            Download Book
          </a>
        ) : (
          <div className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700/30 border border-slate-600/20 text-slate-500 text-xs font-medium cursor-not-allowed">
            <BookOpen size={13} />
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}
