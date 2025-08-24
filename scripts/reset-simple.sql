-- Reset completo: zerar pontuação e progresso
-- Execute este script no SQL Editor do Supabase

-- Zerar pontuação de todos os usuários
UPDATE public.profiles SET points = 0;

-- Remover todo o progresso dos cursos
DELETE FROM public.course_progress;

-- Confirmar as mudanças
SELECT 'Reset completo realizado!' as status;
