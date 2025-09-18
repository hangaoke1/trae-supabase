-- 修复 user_roles 表的 RLS 策略
-- 这个脚本用于修复 406 Not Acceptable 错误

-- 删除现有的用户角色策略（如果存在）
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update own role or super admin can update all" ON public.user_roles;

-- 用户角色表的安全策略：用户可以插入自己的角色记录
CREATE POLICY "Users can insert own role" ON public.user_roles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户角色表的安全策略：用户可以更新自己的角色，或者超级管理员可以更新所有角色
CREATE POLICY "Users can update own role or super admin can update all" ON public.user_roles
    FOR UPDATE USING (auth.uid() = user_id OR is_super_user());

-- 验证策略是否创建成功
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_roles' 
ORDER BY policyname;