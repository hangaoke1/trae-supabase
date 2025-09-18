import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface UserRole {
  id: string
  user_id: string
  role: string
  created_at: string
}

export const useUserRole = () => {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  const fetchUserRole = async () => {
    if (!user) {
      setUserRole(null)
      setIsSuperAdmin(false)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('获取用户角色失败:', error)
        setUserRole(null)
        setIsSuperAdmin(false)
      } else if (data) {
        setUserRole(data)
        setIsSuperAdmin(data.role === 'super_admin')
      } else {
        // 用户没有角色记录，创建默认角色
        const { data: newRole, error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: user.id, role: 'user' }])
          .select()
          .single()

        if (insertError) {
          console.error('创建用户角色失败:', insertError)
          setUserRole(null)
          setIsSuperAdmin(false)
        } else {
          setUserRole(newRole)
          setIsSuperAdmin(false)
        }
      }
    } catch (error) {
      console.error('获取用户角色失败:', error)
      setUserRole(null)
      setIsSuperAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (newRole: string) => {
    if (!user) return false

    try {
      // 首先检查用户角色记录是否存在
      const { data: _existingRole, error: fetchError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      let updatedRole
      
      if (fetchError && fetchError.code === 'PGRST116') {
        // 用户角色记录不存在，创建新记录
        const { data, error } = await supabase
          .from('user_roles')
          .insert([{ user_id: user.id, role: newRole }])
          .select()
          .single()

        if (error) {
          console.error('创建用户角色失败:', error)
          return false
        }
        updatedRole = data
      } else if (fetchError) {
        console.error('获取用户角色失败:', fetchError)
        return false
      } else {
        // 用户角色记录存在，更新记录
        const { data, error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) {
          console.error('更新用户角色失败:', error)
          return false
        }
        updatedRole = data
      }

      setUserRole(updatedRole)
      setIsSuperAdmin(updatedRole.role === 'super_admin')
      return true
    } catch (error) {
      console.error('更新用户角色失败:', error)
      return false
    }
  }

  useEffect(() => {
    fetchUserRole()
  }, [user])

  return {
    userRole,
    isSuperAdmin,
    loading,
    updateUserRole,
    refetch: fetchUserRole
  }
}