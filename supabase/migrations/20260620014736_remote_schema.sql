SET check_function_bodies = false;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;
CREATE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$function$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;
CREATE FUNCTION public.reset_monthly_data()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM games WHERE finished_at IS NOT NULL;
  UPDATE games SET posts_written_by_me = 0 WHERE finished_at IS NULL;
END;
$function$;
GRANT ALL ON FUNCTION public.reset_monthly_data() TO anon;
GRANT ALL ON FUNCTION public.reset_monthly_data() TO authenticated;
GRANT ALL ON FUNCTION public.reset_monthly_data() TO service_role;
CREATE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.is_my_turn IS DISTINCT FROM OLD.is_my_turn THEN
    NEW."updated_at" = now();
  END IF;
  RETURN NEW;
END;
$function$;
GRANT ALL ON FUNCTION public.update_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at() TO service_role;
CREATE TABLE public.games (id uuid DEFAULT gen_random_uuid() NOT NULL, user_id uuid DEFAULT auth.uid() NOT NULL, my_character text DEFAULT ''::text NOT NULL, other_characters text[] DEFAULT '{}'::text[] NOT NULL, is_my_turn boolean DEFAULT true NOT NULL, updated_at timestamp with time zone DEFAULT now() NOT NULL, tag text, posts_written_by_me smallint DEFAULT '0'::smallint NOT NULL, note text, finished_at timestamp with time zone, is_important boolean DEFAULT false NOT NULL);
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ADD CONSTRAINT games_pkey PRIMARY KEY (id);
ALTER TABLE public.games ADD CONSTRAINT games_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
GRANT ALL ON public.games TO anon;
GRANT ALL ON public.games TO authenticated;
GRANT ALL ON public.games TO service_role;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.games FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE POLICY "Users can only interact with their own games" ON public.games USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));
CREATE TABLE public.profiles (id uuid NOT NULL, preferences jsonb DEFAULT '{}'::jsonb NOT NULL, created_at timestamp with time zone DEFAULT now() NOT NULL);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));
