-- Create resources table
create table resources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  subject text not null,
  semester text not null,
  college text not null,
  uploader_id uuid references auth.users not null,
  uploader_name text not null,
  type text not null,
  year text not null,
  tags text[] default '{}',
  description text,
  privacy text default 'Public',
  file_url text not null,
  file_name text not null,
  file_size text not null,
  average_rating numeric default 0,
  reviews jsonb default '[]',
  upload_date timestamptz default now(),
  downloads integer default 0
);

-- Enable RLS
alter table resources enable row level security;

-- Policies
create policy "Public resources are viewable by everyone"
  on resources for select
  using ( true );

create policy "Users can insert their own resources"
  on resources for insert
  with check ( auth.uid() = uploader_id );

create policy "Users can update their own resources"
  on resources for update
  using ( auth.uid() = uploader_id );

create policy "Users can delete their own resources"
  on resources for delete
  using ( auth.uid() = uploader_id );

-- Storage Policies (Run this if you haven't set up storage policies in UI)
-- Make sure a bucket named 'resources' exists first!
-- insert policy
-- create policy "Authenticated users can upload resources"
-- on storage.objects for insert
-- with check ( bucket_id = 'resources' and auth.role() = 'authenticated' );

-- select policy
-- create policy "Public access to resources"
-- on storage.objects for select
-- using ( bucket_id = 'resources' );
