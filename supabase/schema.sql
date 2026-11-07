-- paglapora: ধাপ ১ — প্রোফাইল টেবিল ও নিরাপত্তা (Supabase → SQL Editor-এ পেস্ট করে Run)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  age int check (age between 3 and 120),
  phone text,
  institution text,
  role text not null default 'student' check (role in ('student','teacher','admin')),
  approved boolean not null default true,
  xp int not null default 0, coins int not null default 30, gems int not null default 3, streak int not null default 0,
  avatar jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
-- (আগে টেবিল বানানো থাকলে নিচের দুই লাইন নতুন ঘর যোগ করবে)
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists institution text;
alter table public.profiles enable row level security;

-- সাইন আপ হলে নিজে থেকে প্রোফাইল তৈরি (নাম/বয়স সাইন আপ ফর্ম বা গুগল থেকে)
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, age, phone, institution)
  values (new.id,
          left(coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', ''), 40),
          nullif(new.raw_user_meta_data->>'age','')::int,
          left(new.raw_user_meta_data->>'phone', 20),
          left(new.raw_user_meta_data->>'institution', 80))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- কেউ নিজের role/approved/xp/coins নিজে বদলাতে পারবে না (পরে এগুলো সার্ভার-ফাংশনে বদলাবে)
create or replace function public.guard_profile() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and (select role from public.profiles where id = auth.uid()) <> 'admin' then
    new.role := old.role; new.approved := old.approved; new.xp := old.xp; new.coins := old.coins; new.gems := old.gems; new.streak := old.streak;
  end if;
  return new;
end $$;
drop trigger if exists guard_profile_t on public.profiles;
create trigger guard_profile_t before update on public.profiles for each row execute function public.guard_profile();

-- নিয়ম: লগইন করা সবাই সবার প্রোফাইল পড়তে পারে (লিডারবোর্ড), শুধু নিজেরটা বদলাতে পারে
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select to authenticated using (true);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
