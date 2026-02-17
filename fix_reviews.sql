-- FIX: Drop the old trigger and function first
drop trigger if exists update_rating_trigger on reviews;
drop function if exists update_average_rating;

-- FIX: Recreate the function with SECURITY DEFINER
-- This ensures the function runs with admin privileges, bypassing RLS on the 'resources' table
-- so that a Reviewer can update the Uploader's resource rating.
create or replace function update_average_rating()
returns trigger as $$
begin
  update resources
  set average_rating = (
    select coalesce(avg(rating), 0)
    from reviews
    where resource_id = coalesce(new.resource_id, old.resource_id)
  )
  where id = coalesce(new.resource_id, old.resource_id);
  return new;
end;
$$ language plpgsql security definer;

-- Re-attach the trigger
create trigger update_rating_trigger
after insert or update or delete on reviews
for each row execute function update_average_rating();

-- FIX: Reinforce Reviews RLS Policies
-- Drop existing policies to ensure clean state
drop policy if exists "Reviews are viewable by everyone" on reviews;
drop policy if exists "Authenticated users can create reviews" on reviews;
drop policy if exists "Users can update their own reviews" on reviews;
drop policy if exists "Users can delete their own reviews" on reviews;

-- Enable RLS (idempotent)
alter table reviews enable row level security;

-- Re-create policies
create policy "Reviews are viewable by everyone" 
  on reviews for select 
  using ( true );

create policy "Authenticated users can create reviews" 
  on reviews for insert 
  with check ( auth.uid() = user_id );

create policy "Users can update their own reviews" 
  on reviews for update 
  using ( auth.uid() = user_id );

create policy "Users can delete their own reviews" 
  on reviews for delete 
  using ( auth.uid() = user_id );
