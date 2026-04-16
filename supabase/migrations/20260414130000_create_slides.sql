-- Create slides table for homepage slideshow
CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Public read active slides' AND p.polrelid = 'slides'::regclass
  ) THEN
    CREATE POLICY "Public read active slides"
      ON slides FOR SELECT
      USING (active = true);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polname = 'Authenticated admins can modify slides' AND p.polrelid = 'slides'::regclass
  ) THEN
    CREATE POLICY "Authenticated admins can modify slides"
      ON slides FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

-- Seed a default scripture slide
INSERT INTO slides (reference, content, position, active)
VALUES ('Hebrews 4:12', 'For the word of God is alive and active. Sharper than any double-edged sword...', 0, true)
ON CONFLICT DO NOTHING;
