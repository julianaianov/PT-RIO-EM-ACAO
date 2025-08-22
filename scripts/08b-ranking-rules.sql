-- Functions and triggers to award points automatically

-- Helper: add points and log transaction
CREATE OR REPLACE FUNCTION add_points(p_user_id UUID, p_delta INTEGER, p_reason TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
	UPDATE profiles
	SET points = GREATEST(0, COALESCE(points,0) + p_delta)
	WHERE id = p_user_id;

	INSERT INTO point_transactions(user_id, Delta, reason)
	VALUES (p_user_id, p_delta, p_reason);
END; $$;

-- Rule 1: Confirm presence in youth events => +5
DROP TRIGGER IF EXISTS trg_yea_after_insert ON youth_event_attendees;
CREATE TRIGGER trg_yea_after_insert
AFTER INSERT ON youth_event_attendees
FOR EACH ROW
EXECUTE FUNCTION add_points(NEW.user_id, 5, 'Presença confirmada em evento jovem');

-- If user leaves the event => -5
DROP TRIGGER IF EXISTS trg_yea_after_delete ON youth_event_attendees;
CREATE TRIGGER trg_yea_after_delete
AFTER DELETE ON youth_event_attendees
FOR EACH ROW
EXECUTE FUNCTION add_points(OLD.user_id, -5, 'Presença removida em evento jovem');

-- Rule 2: Complete a course => +course.points_reward (default 10)
CREATE OR REPLACE FUNCTION award_course_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_reward INTEGER;
BEGIN
	IF NEW.completed = TRUE AND (OLD.completed IS DISTINCT FROM TRUE) THEN
		SELECT COALESCE(points_reward, 10) INTO v_reward FROM courses WHERE id = NEW.course_id;
		PERFORM add_points(NEW.user_id, COALESCE(v_reward, 10), 'Curso concluído');
	END IF;
	RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_course_progress_award ON course_progress;
CREATE TRIGGER trg_course_progress_award
AFTER UPDATE ON course_progress
FOR EACH ROW
EXECUTE FUNCTION award_course_completion();

-- Rule 3: Vote in youth group poll => +1
DROP TRIGGER IF EXISTS trg_poll_vote_award ON youth_group_poll_votes;
CREATE TRIGGER trg_poll_vote_award
AFTER INSERT ON youth_group_poll_votes
FOR EACH ROW
EXECUTE FUNCTION add_points(NEW.user_id, 1, 'Voto em enquete de grupo'); 