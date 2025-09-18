import React, { useState } from 'react'
import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Supabase 认证演示
          </h1>
          <p className="text-gray-600">
            使用 React + TypeScript + Supabase 构建的登录注册系统
          </p>
        </div>
        
        <div className="animate-slide-up">
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <RegisterForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  )
}