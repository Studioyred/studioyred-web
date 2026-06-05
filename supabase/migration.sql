-- 게시글 테이블
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  nickname TEXT NOT NULL DEFAULT '익명',
  password_hash TEXT,
  is_notice BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  nickname TEXT NOT NULL DEFAULT '익명',
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능
CREATE POLICY "public read posts" ON public.posts FOR SELECT USING (TRUE);
CREATE POLICY "public read comments" ON public.comments FOR SELECT USING (TRUE);

-- 누구나 글/댓글 작성 가능
CREATE POLICY "public insert posts" ON public.posts FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "public insert comments" ON public.comments FOR INSERT WITH CHECK (TRUE);
