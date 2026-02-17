-- Create reviews table
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  resource_id uuid references resources(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  user_name text not null,
  user_avatar text,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamptz default now(),
  unique(resource_id, user_id)
);

-- Enable RLS
alter table reviews enable row level security;

-- Policies
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

-- Function to calculate average rating
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
$$ language plpgsql;

-- Trigger to update average rating on insert/update/delete
drop trigger if exists update_rating_trigger on reviews;
create trigger update_rating_trigger
after insert or update or delete on reviews
for each row execute function update_average_rating();
