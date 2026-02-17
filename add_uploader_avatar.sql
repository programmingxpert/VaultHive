-- Add uploader_avatar column to resources table
ALTER TABLE resources 
ADD COLUMN uploader_avatar text;

-- Optional: Set default for existing rows if needed, or leave null
-- UPDATE resources SET uploader_avatar = 'https://your-default-avatar-url.com' WHERE uploader_avatar IS NULL;
