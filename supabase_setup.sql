-- Run this once in the Supabase SQL Editor for project dcoqoonpdxtfhslyjirb
-- (the same Supabase project used by sekolahpelita)

CREATE TABLE IF NOT EXISTS public.thelab_bolhs_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  draft TEXT NOT NULL DEFAULT '',
  submitted_text TEXT NOT NULL DEFAULT '',
  submitted_at TIMESTAMPTZ,
  word_count INTEGER NOT NULL DEFAULT 0,
  warmup_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  checked_outline JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_name, mission_id)
);

ALTER TABLE public.thelab_bolhs_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write on thelab_bolhs_submissions" ON public.thelab_bolhs_submissions;
CREATE POLICY "Allow public read/write on thelab_bolhs_submissions"
ON public.thelab_bolhs_submissions
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.thelab_bolhs_submissions TO anon, authenticated;

-- Grade 7 Social Studies (IPS Kelas 7) Submissions Table
CREATE TABLE IF NOT EXISTS public.thelab_ips7_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  draft TEXT NOT NULL DEFAULT '',
  submitted_text TEXT NOT NULL DEFAULT '',
  submitted_at TIMESTAMPTZ,
  word_count INTEGER NOT NULL DEFAULT 0,
  warmup_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  checked_outline JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_name, mission_id)
);

ALTER TABLE public.thelab_ips7_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write on thelab_ips7_submissions" ON public.thelab_ips7_submissions;
CREATE POLICY "Allow public read/write on thelab_ips7_submissions"
ON public.thelab_ips7_submissions
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.thelab_ips7_submissions TO anon, authenticated;

-- Grade 8 Social Studies (IPS Kelas 8) Submissions Table
CREATE TABLE IF NOT EXISTS public.thelab_ips8_submissions (
  student_name TEXT PRIMARY KEY,
  practice_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  exam_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  exam_submitted BOOLEAN NOT NULL DEFAULT false,
  essay_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  essay_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  practice_score INTEGER NOT NULL DEFAULT 0,
  exam_score INTEGER NOT NULL DEFAULT 0,
  essay_weighted_score NUMERIC NOT NULL DEFAULT 0,
  total_score NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.thelab_ips8_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write on thelab_ips8_submissions" ON public.thelab_ips8_submissions;
CREATE POLICY "Allow public read/write on thelab_ips8_submissions"
ON public.thelab_ips8_submissions
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.thelab_ips8_submissions TO anon, authenticated;
