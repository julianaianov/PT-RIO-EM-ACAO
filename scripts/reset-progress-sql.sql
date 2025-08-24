-- Script para resetar pontuação e progresso de todos os usuários
-- Execute este script no SQL Editor do Supabase

-- 1. Zerar pontuação de todos os usuários
UPDATE public.profiles 
SET points = 0 
WHERE points > 0;

-- 2. Resetar progresso de todos os cursos (remover todas as entradas de progresso)
DELETE FROM public.course_progress;

-- 3. Verificar se as operações foram bem-sucedidas
SELECT 
  'Pontuação zerada' as operacao,
  COUNT(*) as usuarios_afetados
FROM public.profiles 
WHERE points = 0;

-- 4. Verificar se não há mais progresso salvo
SELECT 
  'Progresso resetado' as operacao,
  COUNT(*) as registros_restantes
FROM public.course_progress;

-- 5. Mostrar estatísticas finais
SELECT 
  'Estatísticas finais' as tipo,
  COUNT(*) as total_usuarios,
  SUM(points) as total_pontos
FROM public.profiles;
