const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = 'http://localhost:54321' // ou sua URL do Supabase
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetAllProgress() {
  console.log('🔄 Iniciando reset de pontuação e progresso...')
  
  try {
    // 1. Zerar pontuação de todos os usuários
    console.log('📊 Zerando pontuação de todos os usuários...')
    const { data: profilesUpdate, error: profilesError } = await supabase
      .from('profiles')
      .update({ points: 0 })
      .gt('points', 0)
    
    if (profilesError) {
      console.error('❌ Erro ao zerar pontuação:', profilesError)
      return
    }
    
    console.log('✅ Pontuação zerada com sucesso!')
    
    // 2. Deletar todo o progresso dos cursos
    console.log('📚 Removendo progresso de todos os cursos...')
    const { data: progressDelete, error: progressError } = await supabase
      .from('course_progress')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Deletar todos os registros
    
    if (progressError) {
      console.error('❌ Erro ao remover progresso:', progressError)
      return
    }
    
    console.log('✅ Progresso removido com sucesso!')
    
    // 3. Verificar resultados
    console.log('🔍 Verificando resultados...')
    
    const { data: finalProfiles, error: finalProfilesError } = await supabase
      .from('profiles')
      .select('points')
    
    if (finalProfilesError) {
      console.error('❌ Erro ao verificar perfis:', finalProfilesError)
      return
    }
    
    const { data: finalProgress, error: finalProgressError } = await supabase
      .from('course_progress')
      .select('id')
    
    if (finalProgressError) {
      console.error('❌ Erro ao verificar progresso:', finalProgressError)
      return
    }
    
    const totalUsers = finalProfiles?.length || 0
    const totalPoints = finalProfiles?.reduce((sum, profile) => sum + (profile.points || 0), 0) || 0
    const remainingProgress = finalProgress?.length || 0
    
    console.log('\n📈 RESULTADOS FINAIS:')
    console.log(`👥 Total de usuários: ${totalUsers}`)
    console.log(`🎯 Total de pontos: ${totalPoints}`)
    console.log(`📚 Registros de progresso restantes: ${remainingProgress}`)
    
    if (totalPoints === 0 && remainingProgress === 0) {
      console.log('\n🎉 SUCESSO! Reset completo realizado!')
      console.log('✅ Todos os usuários podem fazer os cursos novamente')
      console.log('✅ Pontuação zerada para todos')
    } else {
      console.log('\n⚠️  ATENÇÃO: Alguns dados podem não ter sido resetados completamente')
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar o reset
resetAllProgress()
