import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface RegisterFormProps {
  onToggleMode: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('密码不匹配')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess('注册成功！请检查您的邮箱以验证账户。')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-95">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">注册</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            邮箱
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="请输入邮箱地址"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            密码
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="请输入密码（至少6个字符）"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            确认密码
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="请再次输入密码"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200"
        >
          {loading ? '注册中...' : '注册'}
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        已有账户？{' '}
        <button 
          type="button" 
          onClick={onToggleMode} 
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
        >
          登录
        </button>
      </p>
    </div>
  )
}