import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useUserRole } from '../hooks/useUserRole'

interface MemoWithUser {
  id: string
  content: string
  created_at: string
  user_id: string
  user_email?: string
}

export const SuperAdminPanel: React.FC = () => {
  const { user } = useAuth()
  const { isSuperAdmin, loading: roleLoading } = useUserRole()
  const [allMemos, setAllMemos] = useState<MemoWithUser[]>([])
  const [loading, setLoading] = useState(false)
  const [userEmails, setUserEmails] = useState<Record<string, string>>({})

  // 获取所有备忘录（仅超级管理员可见）
  const fetchAllMemos = async () => {
    if (!user || !isSuperAdmin) return

    setLoading(true)
    try {
      // 获取所有备忘录
      const { data: memos, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('获取所有备忘录失败:', error)
        return
      }

      // 获取用户邮箱信息
      const userIds = [...new Set(memos?.map(memo => memo.user_id) || [])]
      const emailMap: Record<string, string> = {}

      for (const userId of userIds) {
        emailMap[userId] = `用户-${userId.substring(0, 8)}`
      }

      setUserEmails(emailMap)
      setAllMemos(memos || [])
    } catch (error) {
      console.error('获取所有备忘录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 删除任意用户的备忘录
  const deleteMemo = async (memoId: string) => {
    if (!user || !isSuperAdmin) return

    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', memoId)

      if (error) {
        console.error('删除备忘录失败:', error)
        return
      }

      setAllMemos(allMemos.filter(memo => memo.id !== memoId))
    } catch (error) {
      console.error('删除备忘录失败:', error)
    }
  }

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAllMemos()
    }
  }, [isSuperAdmin])

  if (roleLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  if (!isSuperAdmin) {
    return null // 非超级管理员不显示此面板
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        超级管理员面板
      </h2>

      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-red-700 font-medium">
            您拥有超级管理员权限，可以查看和管理所有用户的备忘录
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">所有用户备忘录</h3>
        <button
          onClick={fetchAllMemos}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : allMemos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>系统中还没有任何备忘录</p>
          </div>
        ) : (
          allMemos.map((memo) => (
            <div key={memo.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {userEmails[memo.user_id] || '未知用户'}
                    </span>
                    <span className="text-xs text-gray-500">
                      用户ID: {memo.user_id.substring(0, 8)}...
                    </span>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap break-words mb-2">{memo.content}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(memo.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
                <button
                  onClick={() => deleteMemo(memo.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  title="删除备忘录"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-800 mb-2">⚠️ 权限说明</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 超级管理员可以查看所有用户的备忘录</li>
          <li>• 超级管理员可以删除任何用户的备忘录</li>
          <li>• 这些权限通过数据库级别的RLS策略控制，无法通过前端代码绕过</li>
          <li>• 请谨慎使用这些权限，确保符合数据保护法规</li>
        </ul>
      </div>
    </div>
  )
}