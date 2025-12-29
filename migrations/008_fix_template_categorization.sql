-- Add template_source column to track original template ID
ALTER TABLE templates ADD COLUMN IF NOT EXISTS template_source TEXT;

-- Update existing records to have proper category
UPDATE templates 
SET category = 'my-template', 
    template_source = category 
WHERE category != 'my-template';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_source ON templates(template_source);