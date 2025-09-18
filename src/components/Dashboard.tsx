import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MemoList } from './MemoList'
import { SecurityDemo } from './SecurityDemo'
import { SuperAdminPanel } from './SuperAdminPanel'
import { RoleManager } from './RoleManager'

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-95 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">欢迎回来！</h1>
            <button 
              onClick={handleSignOut} 
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              退出登录
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              用户信息
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <strong className="text-gray-700">邮箱</strong>
                </div>
                <p className="text-gray-900 font-mono text-sm">{user?.email}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <strong className="text-gray-700">用户ID</strong>
                </div>
                <p className="text-gray-900 font-mono text-sm break-all">{user?.id}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <strong className="text-gray-700">注册时间</strong>
                </div>
                <p className="text-gray-900">{user?.created_at ? new Date(user.created_at).toLocaleString('zh-CN') : '未知'}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <strong className="text-gray-700">邮箱验证</strong>
                </div>
                <div className="flex items-center">
                  {user?.email_confirmed_at ? (
                    <>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        已验证
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        未验证
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* 备忘录功能 */}
          <div className="mt-8">
            <MemoList />
          </div>
          
          {/* 超级管理员面板 */}
          <SuperAdminPanel />
          
          {/* 角色管理 */}
          <RoleManager />
          
          {/* 安全性演示 */}
          <SecurityDemo />
        </div>
      </div>
    </div>
  )
}