-- Seed admin account and sample content for local/dev
-- Create an admins table to store admin metadata (not Supabase Auth)
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text DEFAULT 'Admin',
  password_hash text NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert admins"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can read admins"
  ON admins FOR SELECT
  TO authenticated
  USING (true);

-- NOTE: Replace <BCRYPT_HASH_PLACEHOLDER> with a real bcrypt hash before applying in production.
INSERT INTO admins (email, name, password_hash, role)
VALUES ('admin@bibletalk.local', 'Site Admin', '<BCRYPT_HASH_PLACEHOLDER>', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert a sample scripture post (published)
INSERT INTO posts (title, content, excerpt, category, author, cover_image, published)
VALUES (
  'John 3:16 - For God so loved the world',
  'For God so loved the world that he gave his only begotten Son, that whoever believes in him should not perish but have everlasting life. — John 3:16',
  'John 3:16 — For God so loved the world',
  'scripture',
  'Admin',
  '',
  true
)
ON CONFLICT DO NOTHING;

-- Insert a sample book
INSERT INTO books (title, author, description, cover_image, file_url, published)
VALUES (
  'Basics of Bible Study',
  'Bible Talk Team',
  'An introductory guide to studying the Bible effectively.',
  '',
  '',
  true
)
ON CONFLICT DO NOTHING;

-- Insert a sample video (YouTube link example)
INSERT INTO videos (title, description, video_url, video_type, thumbnail, published)
VALUES (
  'Bible Talk: Introduction to John',
  'A short introductory session covering key themes in the Gospel of John.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'youtube',
  '',
  true
)
ON CONFLICT DO NOTHING;

-- If you need to generate a bcrypt for the admin password locally, run the helper script in /scripts
