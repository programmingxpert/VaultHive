-- Policy to allow public viewing of resources
create policy "Public Access to Resources"
on storage.objects for select
to public
using ( bucket_id = 'resources' );

-- Policy to allow authenticated users to upload resources
-- 'owner' is automatically set to the authenticated user's ID by Supabase
create policy "Authenticated Users Can Upload Resources"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'resources' and auth.uid() = owner );

-- Policy to allow users to update their own resources
create policy "Users Can Update Own Resources"
on storage.objects for update
to authenticated
using ( bucket_id = 'resources' and auth.uid() = owner );

-- Policy to allow users to delete their own resources
create policy "Users Can Delete Own Resources"
on storage.objects for delete
to authenticated
using ( bucket_id = 'resources' and auth.uid() = owner );
