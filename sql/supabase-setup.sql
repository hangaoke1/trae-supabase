-- 创建备忘录表
CREATE TABLE IF NOT EXISTS public.memos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_memos_user_id ON public.memos(user_id);
CREATE INDEX IF NOT EXISTS idx_memos_created_at ON public.memos(created_at DESC);

-- 创建用户角色表
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- 启用用户角色表的RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 删除现有的用户角色策略（如果存在）
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update own role or super admin can update all" ON public.user_roles;

-- 用户角色表的安全策略：用户只能查看自己的角色
CREATE POLICY "Users can view own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- 用户角色表的安全策略：用户可以插入自己的角色记录
CREATE POLICY "Users can insert own role" ON public.user_roles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户角色表的安全策略：用户可以更新自己的角色，或者超级管理员可以更新所有角色
CREATE POLICY "Users can update own role or super admin can update all" ON public.user_roles
    FOR UPDATE USING (auth.uid() = user_id OR is_super_user());

-- 创建函数来检查用户是否为超级用户
CREATE OR REPLACE FUNCTION is_super_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 启用行级安全策略 (RLS)
ALTER TABLE public.memos ENABLE ROW LEVEL SECURITY;

-- 删除现有的备忘录策略（如果存在）
DROP POLICY IF EXISTS "Users can view own memos or super admin can view all" ON public.memos;
DROP POLICY IF EXISTS "Users can insert own memos" ON public.memos;
DROP POLICY IF EXISTS "Users can update own memos or super admin can update all" ON public.memos;
DROP POLICY IF EXISTS "Users can delete own memos or super admin can delete all" ON public.memos;

-- 创建安全策略：用户只能查看自己的备忘录，或者超级用户可以查看所有
CREATE POLICY "Users can view own memos or super admin can view all" ON public.memos
    FOR SELECT USING (auth.uid() = user_id OR is_super_user());

-- 创建安全策略：用户只能插入自己的备忘录
CREATE POLICY "Users can insert own memos" ON public.memos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建安全策略：用户只能更新自己的备忘录，或者超级用户可以更新所有
CREATE POLICY "Users can update own memos or super admin can update all" ON public.memos
    FOR UPDATE USING (auth.uid() = user_id OR is_super_user());

-- 创建安全策略：用户只能删除自己的备忘录，或者超级用户可以删除所有
CREATE POLICY "Users can delete own memos or super admin can delete all" ON public.memos
    FOR DELETE USING (auth.uid() = user_id OR is_super_user());

-- 创建触发器函数来自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 删除现有触发器（如果存在）
DROP TRIGGER IF EXISTS update_memos_updated_at ON public.memos;

-- 创建触发器
CREATE TRIGGER update_memos_updated_at 
    BEFORE UPDATE ON public.memos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();