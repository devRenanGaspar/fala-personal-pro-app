-- Criar tabela de perfis de usuários
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome text,
  nome_profissional text,
  nicho text,
  especialidade text,
  publico_idade text,
  publico_genero text,
  publico_objetivo text,
  objetivo_principal text,
  posts_semanais text,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table public.profiles enable row level security;

-- Políticas de segurança
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Trigger para criar perfil automaticamente após signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();