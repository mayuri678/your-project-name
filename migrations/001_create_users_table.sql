create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  full_name text,
  email text unique not null,
  password text,
  created_at timestamp with time zone default now()
);







