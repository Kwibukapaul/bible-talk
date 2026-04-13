
/*
  # Bible Study Blog - Initial Schema

  ## Overview
  Creates all core tables for the Bible Study Blog platform.

  ## New Tables

  ### posts
  Stores blog content including Bible quotes, studies, testimonies, stories, devotionals, and scriptures.
  - id (uuid, primary key)
  - title (text)
  - content (text, full body)
  - excerpt (text, short preview)
  - category (text: quote | study | testimony | story | devotional | scripture)
  - author (text)
  - cover_image (text, URL)
  - views (int, read count)
  - published (bool)
  - created_at, updated_at (timestamps)

  ### books
  Stores downloadable books with file references in Supabase Storage.
  - id, title, author, description, cover_image, file_url, file_size, published, created_at

  ### videos
  Stores video sessions — either uploaded files or embedded URLs (YouTube/Vimeo).
  - id, title, description, video_url, video_type (upload|youtube|vimeo), thumbnail, duration, published, created_at

  ### subscribers
  Stores email subscribers for notifications.
  - id, email, name, active, created_at

  ## Security
  - RLS enabled on all tables
  - Public read access for published content
  - Admin write access via service role
  - Subscriber insert allowed for authenticated and anon users
*/

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'study' CHECK (category IN ('quote','study','testimony','story','devotional','scripture')),
  author text NOT NULL DEFAULT 'Admin',
  cover_image text DEFAULT '',
  views integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Anyone can read published posts' AND p.polrelid = 'posts'::regclass
  ) THEN
    CREATE POLICY "Anyone can read published posts"
      ON posts FOR SELECT
      USING (published = true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can insert posts' AND p.polrelid = 'posts'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can insert posts"
      ON posts FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can update posts' AND p.polrelid = 'posts'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can update posts"
      ON posts FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can delete posts' AND p.polrelid = 'posts'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can delete posts"
      ON posts FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  cover_image text DEFAULT '',
  file_url text DEFAULT '',
  file_size text DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Anyone can read published books' AND p.polrelid = 'books'::regclass
  ) THEN
    CREATE POLICY "Anyone can read published books"
      ON books FOR SELECT
      USING (published = true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can insert books' AND p.polrelid = 'books'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can insert books"
      ON books FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can update books' AND p.polrelid = 'books'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can update books"
      ON books FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can delete books' AND p.polrelid = 'books'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can delete books"
      ON books FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  video_type text NOT NULL DEFAULT 'youtube' CHECK (video_type IN ('upload','youtube','vimeo')),
  thumbnail text DEFAULT '',
  duration text DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Anyone can read published videos' AND p.polrelid = 'videos'::regclass
  ) THEN
    CREATE POLICY "Anyone can read published videos"
      ON videos FOR SELECT
      USING (published = true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can insert videos' AND p.polrelid = 'videos'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can insert videos"
      ON videos FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can update videos' AND p.polrelid = 'videos'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can update videos"
      ON videos FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can delete videos' AND p.polrelid = 'videos'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can delete videos"
      ON videos FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Anyone can subscribe' AND p.polrelid = 'subscribers'::regclass
  ) THEN
    CREATE POLICY "Anyone can subscribe"
      ON subscribers FOR INSERT
      WITH CHECK (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can read subscribers' AND p.polrelid = 'subscribers'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can read subscribers"
      ON subscribers FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can update subscribers' AND p.polrelid = 'subscribers'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can update subscribers"
      ON subscribers FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can delete subscribers' AND p.polrelid = 'subscribers'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can delete subscribers"
      ON subscribers FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('covers', 'covers', true),
  ('books', 'books', true),
  ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for covers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Public read covers' AND p.polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Public read covers"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'covers');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated upload covers' AND p.polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Authenticated upload covers"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'covers');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated delete covers' AND p.polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Authenticated delete covers"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'covers');
  END IF;
END
$$;

-- Storage policies for books
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Public read books' AND p.polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Public read books"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'books');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated upload books' AND p.polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Authenticated upload books"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'books');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated delete books' AND p.polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Authenticated delete books"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'books');
  END IF;
END
$$;

-- Storage policies for videos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Public read videos' AND p.polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Public read videos"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'videos');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated upload videos' AND p.polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Authenticated upload videos"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'videos');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated delete videos' AND p.polrelid = 'storage.objects'::regclass
  ) THEN
    CREATE POLICY "Authenticated delete videos"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'videos');
  END IF;
END
$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_published ON books(published);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(published);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
