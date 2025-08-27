-- Modificar sistema de pontos para confirmação manual pelo admin

-- Remover triggers automáticos de eventos da juventude
DROP TRIGGER IF EXISTS trg_yea_after_insert ON youth_event_attendees;
DROP TRIGGER IF EXISTS trg_yea_after_delete ON youth_event_attendees;

-- Adicionar trigger para quando o admin confirmar presença em eventos normais
CREATE OR REPLACE FUNCTION award_event_presence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Só adiciona pontos quando o status muda de false para true (confirmação)
    IF NEW.confirmed = TRUE AND (OLD.confirmed IS DISTINCT FROM TRUE) THEN
        PERFORM add_points(NEW.user_id, 5, 'Presença confirmada em evento pelo admin');
    END IF;
    
    -- Remove pontos quando o status muda de true para false (remoção)
    IF NEW.confirmed = FALSE AND (OLD.confirmed IS DISTINCT FROM FALSE) THEN
        PERFORM add_points(NEW.user_id, -5, 'Presença removida de evento pelo admin');
    END IF;
    
    RETURN NEW;
END; $$;

-- Criar trigger para eventos normais
DROP TRIGGER IF EXISTS trg_event_participants_confirm ON event_participants;
CREATE TRIGGER trg_event_participants_confirm
AFTER UPDATE ON event_participants
FOR EACH ROW
EXECUTE FUNCTION award_event_presence();

-- Adicionar trigger para eventos da juventude (quando confirmados pelo admin)
CREATE OR REPLACE FUNCTION award_youth_event_presence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Adiciona pontos quando o admin confirma presença
    IF NEW.confirmed = TRUE AND (OLD.confirmed IS DISTINCT FROM TRUE) THEN
        PERFORM add_points(NEW.user_id, 5, 'Presença confirmada em evento jovem pelo admin');
    END IF;
    
    -- Remove pontos quando o admin remove presença
    IF NEW.confirmed = FALSE AND (OLD.confirmed IS DISTINCT FROM FALSE) THEN
        PERFORM add_points(NEW.user_id, -5, 'Presença removida de evento jovem pelo admin');
    END IF;
    
    RETURN NEW;
END; $$;

-- Adicionar coluna confirmed na tabela youth_event_attendees se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'youth_event_attendees' AND column_name = 'confirmed') THEN
        ALTER TABLE youth_event_attendees ADD COLUMN confirmed BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Criar trigger para eventos da juventude
DROP TRIGGER IF EXISTS trg_youth_event_attendees_confirm ON youth_event_attendees;
CREATE TRIGGER trg_youth_event_attendees_confirm
AFTER UPDATE ON youth_event_attendees
FOR EACH ROW
EXECUTE FUNCTION award_youth_event_presence();

