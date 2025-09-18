-- 管理员设置脚本
-- 使用此脚本将特定用户设置为超级管理员

-- 方法1: 通过用户邮箱设置超级管理员
-- 请将 'admin@example.com' 替换为实际的管理员邮箱
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users 
WHERE email = '188869009@qq.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super_admin';

-- 方法2: 通过用户ID设置超级管理员
-- 请将 'your-user-id-here' 替换为实际的用户ID
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('your-user-id-here', 'super_admin')
-- ON CONFLICT (user_id) 
-- DO UPDATE SET role = 'super_admin';

-- 查看所有用户角色
SELECT 
    ur.id,
    ur.user_id,
    au.email,
    ur.role,
    ur.created_at
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
ORDER BY ur.created_at DESC;

-- 查看所有超级管理员
SELECT 
    ur.id,
    ur.user_id,
    au.email,
    ur.role,
    ur.created_at
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'super_admin'
ORDER BY ur.created_at DESC;