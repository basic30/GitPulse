-- Auto-create profile on signup with GitHub OAuth data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, github_access_token)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'preferred_username', NULL),
    COALESCE(new.raw_user_meta_data ->> 'avatar_url', NULL),
    COALESCE(new.raw_user_meta_data ->> 'provider_token', NULL)
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url,
    github_access_token = EXCLUDED.github_access_token,
    updated_at = NOW();

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
