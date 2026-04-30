-- Run this in Supabase SQL Editor to set up the thoughts board.
-- If your project is brand new and pgcrypto isn't enabled, uncomment the line below:
-- create extension if not exists pgcrypto;

create table thoughts (
  id          uuid primary key default gen_random_uuid(),
  nickname    text not null check (char_length(nickname) between 1 and 30),
  content     text not null check (char_length(content) between 1 and 500),
  created_at  timestamptz not null default now()
);

create index thoughts_created_at_desc on thoughts (created_at desc);

alter publication supabase_realtime add table thoughts;

alter table thoughts enable row level security;

create policy "anyone can read thoughts"
  on thoughts for select
  using (true);

create policy "anyone can insert thoughts"
  on thoughts for insert
  with check (true);
