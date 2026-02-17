-- Enable RLS on storage.objects (if not already enabled, though usually it is by default)
-- alter table storage.objects enable row level security;

-- Policy to allow public viewing of avatars
create policy "Public Access to Avatars"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

-- Policy to allow authenticated users to upload avatars
create policy "Authenticated Users Can Upload Avatars"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'avatars' and auth.uid() = owner );

-- Policy to allow users to update their own avatars
create policy "Users Can Update Own Avatars"
on storage.objects for update
to authenticated
using ( bucket_id = 'avatars' and auth.uid() = owner );

-- Policy to allow users to delete their own avatars
create policy "Users Can Delete Own Avatars"
on storage.objects for delete
to authenticated
using ( bucket_id = 'avatars' and auth.uid() = owner );
