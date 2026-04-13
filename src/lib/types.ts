export type PostCategory = 'quote' | 'study' | 'testimony' | 'story' | 'devotional' | 'scripture';
export type VideoType = 'upload' | 'youtube' | 'vimeo';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: PostCategory;
  author: string;
  cover_image: string;
  views: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image: string;
  file_url: string;
  file_size: string;
  published: boolean;
  created_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  video_type: VideoType;
  thumbnail: string;
  duration: string;
  published: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name: string;
  active: boolean;
  created_at: string;
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  quote: 'Bible Quote',
  study: 'Bible Study',
  testimony: 'Testimony',
  story: 'Story',
  devotional: 'Devotional',
  scripture: 'Scripture',
};

export const CATEGORY_COLORS: Record<PostCategory, string> = {
  quote: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  study: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  testimony: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  story: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  devotional: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  scripture: 'text-yellow-300 bg-yellow-300/10 border-yellow-300/20',
};
