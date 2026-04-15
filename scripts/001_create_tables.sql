-- Create profiles table that links to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  github_access_token TEXT,
  plan TEXT DEFAULT 'FREE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create repositories table
CREATE TABLE IF NOT EXISTS public.repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  github_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  language TEXT,
  stars INT DEFAULT 0,
  forks INT DEFAULT 0,
  is_private BOOLEAN DEFAULT FALSE,
  default_branch TEXT DEFAULT 'main',
  html_url TEXT,
  last_commit_at TIMESTAMPTZ,
  last_analyzed_at TIMESTAMPTZ,
  health_score INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, github_id)
);

-- Create analysis_reports table
CREATE TABLE IF NOT EXISTS public.analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID NOT NULL REFERENCES public.repositories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  health_score INT NOT NULL,
  dead_code_score INT,
  dependency_score INT,
  duplication_score INT,
  complexity_score INT,
  documentation_score INT,
  total_issues INT DEFAULT 0,
  lines_removable INT DEFAULT 0,
  zombie_dependencies INT DEFAULT 0,
  files_affected INT DEFAULT 0,
  status TEXT DEFAULT 'pending',
  analysis_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create issues table
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.analysis_reports(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT,
  line_start INT,
  line_end INT,
  ai_explanation TEXT,
  code_snippet TEXT,
  fix_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Repositories policies
CREATE POLICY "repos_select_own" ON public.repositories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "repos_insert_own" ON public.repositories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "repos_update_own" ON public.repositories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "repos_delete_own" ON public.repositories FOR DELETE USING (auth.uid() = user_id);

-- Analysis reports policies
CREATE POLICY "reports_select_own" ON public.analysis_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reports_insert_own" ON public.analysis_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reports_update_own" ON public.analysis_reports FOR UPDATE USING (auth.uid() = user_id);

-- Issues policies (via report ownership)
CREATE POLICY "issues_select_own" ON public.issues FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.analysis_reports 
    WHERE analysis_reports.id = issues.report_id 
    AND analysis_reports.user_id = auth.uid()
  ));
CREATE POLICY "issues_insert_own" ON public.issues FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.analysis_reports 
    WHERE analysis_reports.id = issues.report_id 
    AND analysis_reports.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_repositories_user_id ON public.repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_repositories_github_id ON public.repositories(github_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_repository_id ON public.analysis_reports(repository_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_user_id ON public.analysis_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_report_id ON public.issues(report_id);
