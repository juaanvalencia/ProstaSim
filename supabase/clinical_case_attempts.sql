-- Clinical cases module: stores each student's attempt at a clinical case.
-- Run once in Supabase Dashboard > SQL Editor.

create table if not exists public.clinical_case_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  case_id text not null,
  score integer not null check (score between 0 and 100),
  correct_answers integer not null check (correct_answers >= 0),
  total_questions integer not null check (total_questions > 0),
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

create index if not exists clinical_case_attempts_user_case_idx
  on public.clinical_case_attempts (user_id, case_id);

alter table public.clinical_case_attempts enable row level security;

-- Each student can only read and create their own attempts.
drop policy if exists "Students read own case attempts" on public.clinical_case_attempts;
create policy "Students read own case attempts"
  on public.clinical_case_attempts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Students insert own case attempts" on public.clinical_case_attempts;
create policy "Students insert own case attempts"
  on public.clinical_case_attempts
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
