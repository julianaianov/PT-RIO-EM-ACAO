-- Course quiz tables

CREATE TABLE IF NOT EXISTS public.course_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text,
  option_d text,
  correct_option text NOT NULL CHECK (correct_option IN ('a','b','c','d')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.course_quiz_questions ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read, only coordinators/admins can modify
DROP POLICY IF EXISTS "Anyone can view course quiz" ON public.course_quiz_questions;
DROP POLICY IF EXISTS "Coordinators manage course quiz" ON public.course_quiz_questions;

CREATE POLICY "Anyone can view course quiz" ON public.course_quiz_questions
  FOR SELECT USING (true);

CREATE POLICY "Coordinators manage course quiz" ON public.course_quiz_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('coordinator','admin'))
  );


