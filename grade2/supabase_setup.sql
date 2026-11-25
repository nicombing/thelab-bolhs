-- Run this once in the Supabase SQL Editor for project dcoqoonpdxtfhslyjirb
-- Creates an isolated table for the Grade 2 Personal Interactive Worksheet
-- (does NOT modify the Grade 5 table `thelab_bolhs_submissions`)

CREATE TABLE IF NOT EXISTS public.thelab_g2_worksheet_state (
  record_id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL DEFAULT 'Little Explorer',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.thelab_g2_worksheet_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read/write on thelab_g2_worksheet_state" ON public.thelab_g2_worksheet_state;
CREATE POLICY "Allow public read/write on thelab_g2_worksheet_state"
ON public.thelab_g2_worksheet_state
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.thelab_g2_worksheet_state TO anon, authenticated;
