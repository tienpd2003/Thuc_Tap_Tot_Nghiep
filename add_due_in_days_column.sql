-- Add due_in_days column to form_templates table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'form_templates' 
        AND column_name = 'due_in_days'
    ) THEN
        ALTER TABLE form_templates ADD COLUMN due_in_days INTEGER;
    END IF;
END $$;

-- Update existing templates with sample due_in_days values
UPDATE form_templates 
SET due_in_days = 7 
WHERE due_in_days IS NULL AND name LIKE '%Đơn xin cấp thiết bị%';

UPDATE form_templates 
SET due_in_days = 5 
WHERE due_in_days IS NULL AND name LIKE '%Leave Request%';

UPDATE form_templates 
SET due_in_days = 3 
WHERE due_in_days IS NULL;
