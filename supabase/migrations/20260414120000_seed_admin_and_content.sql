-- Seed sample content for local/dev
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

