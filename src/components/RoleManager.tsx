import React, { useState } from 'react'
import { useUserRole } from '../hooks/useUserRole'

export const RoleManager: React.FC = () => {
  const { userRole, isSuperAdmin, loading, updateUserRole } = useUserRole()
  const [updating, setUpdating] = useState(false)

  const handleRoleChange = async (newRole: string) => {
    setUpdating(true)
    const success = await updateUserRole(newRole)
    if (success) {
      alert(`角色已更新为: ${newRole === 'super_admin' ? '超级管理员' : '普通用户'}`)
    } else {
      alert('角色更新失败')
    }
    setUpdating(false)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
        <div className="flex justify-center py-4">
          <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        用户角色管理
      </h2>

      <div className="mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800">当前角色</h3>
            <p className="text-sm text-gray-600 mt-1">
              {userRole?.role === 'super_admin' ? '超级管理员' : '普通用户'}
            </p>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isSuperAdmin 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isSuperAdmin ? '🔴 超级管理员' : '🔵 普通用户'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">角色切换（仅用于演示）</h3>
        <div className="flex gap-3">
          <button
            onClick={() => handleRoleChange('user')}
            disabled={updating || userRole?.role === 'user'}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
          >
            {updating ? '更新中...' : '切换为普通用户'}
          </button>
          <button
            onClick={() => handleRoleChange('super_admin')}
            disabled={updating || userRole?.role === 'super_admin'}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200"
          >
            {updating ? '更新中...' : '切换为超级管理员'}
          </button>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-800 mb-2">📝 说明</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 这个角色切换功能仅用于演示目的</li>
          <li>• 在生产环境中，角色应该由系统管理员通过后台管理界面分配</li>
          <li>• 切换角色后，页面会自动更新显示相应的权限内容</li>
          <li>• 超级管理员可以看到所有用户的备忘录</li>
          <li>• 普通用户只能看到自己的备忘录</li>
        </ul>
      </div>
    </div>
  )
}