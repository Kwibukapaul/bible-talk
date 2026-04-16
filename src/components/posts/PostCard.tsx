import { Eye, Clock, User } from "lucide-react";
import { Post, CATEGORY_LABELS, CATEGORY_COLORS } from "../../lib/types";

interface Props {
  post: Post;
  onClick?: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCard({ post, onClick }: Props) {
  const defaultImages: Record<string, string> = {
    quote:
      "https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg?auto=compress&cs=tinysrgb&w=800",
    study:
      "https://images.pexels.com/photos/3671083/pexels-photo-3671083.jpeg?auto=compress&cs=tinysrgb&w=800",
    testimony:
      "https://images.pexels.com/photos/8468155/pexels-photo-8468155.jpeg?auto=compress&cs=tinysrgb&w=800",
    story:
      "https://images.pexels.com/photos/1637858/pexels-photo-1637858.jpeg?auto=compress&cs=tinysrgb&w=800",
    devotional:
      "https://images.pexels.com/photos/3184290/pexels-photo-3184290.jpeg?auto=compress&cs=tinysrgb&w=800",
    scripture:
      "https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg?auto=compress&cs=tinysrgb&w=800",
  };

  const image =
    post.cover_image || defaultImages[post.category] || defaultImages.study;

  return (
    <article
      onClick={onClick}
      className="glass-card rounded-xl overflow-hidden card-hover cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a]/80 to-transparent" />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[post.category]}`}
        >
          {CATEGORY_LABELS[post.category]}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-amber-300 transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-slate-500 text-xs mt-auto">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User size={11} />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDate(post.created_at)}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {post.views}
          </span>
        </div>
      </div>
    </article>
  );
}
