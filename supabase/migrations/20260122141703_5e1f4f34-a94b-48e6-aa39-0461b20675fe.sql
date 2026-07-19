-- Create function to auto-reset is_processing when assistant message is inserted
CREATE OR REPLACE FUNCTION public.auto_reset_processing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When an assistant message is inserted, reset is_processing to false
  IF NEW.role = 'assistant' THEN
    UPDATE conversations 
    SET is_processing = false 
    WHERE id = NEW.conversation_id 
      AND is_processing = true;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger that fires after inserting a message
CREATE TRIGGER on_assistant_message_reset_processing
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION public.auto_reset_processing();