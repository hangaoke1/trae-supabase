import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const SecurityDemo: React.FC = () => {
  const { user } = useAuth()
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 正常查询（带用户过滤）
  const normalQuery = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('user_id', user?.id) // 正常的用户过滤
        .order('created_at', { ascending: false })

      setTestResults([
        {
          type: '正常查询（带用户过滤）',
          success: !error,
          count: data?.length || 0,
          error: error?.message,
          data: data?.slice(0, 2) // 只显示前2条
        }
      ])
    } catch (err: any) {
      setTestResults([{
        type: '正常查询（带用户过滤）',
        success: false,
        error: err.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 恶意查询（尝试删除用户过滤）
  const maliciousQuery = async () => {
    setLoading(true)
    try {
      // 模拟恶意用户删除了 .eq('user_id', user?.id) 过滤条件
      const { data, error } = await supabase
        .from('memos')
        .select('*') // 尝试查询所有备忘录
        .order('created_at', { ascending: false })

      setTestResults(prev => [...prev, {
        type: '恶意查询（删除用户过滤）',
        success: !error,
        count: data?.length || 0,
        error: error?.message,
        data: data?.slice(0, 2),
        note: 'RLS策略会自动限制只返回当前用户的数据'
      }])
    } catch (err: any) {
      setTestResults(prev => [...prev, {
        type: '恶意查询（删除用户过滤）',
        success: false,
        error: err.message
      }])
    } finally {
      setLoading(false)
    }
  }

  // 尝试伪造其他用户ID
  const fakeUserQuery = async () => {
    setLoading(true)
    try {
      // 模拟恶意用户尝试伪造其他用户的ID
      const fakeUserId = '00000000-0000-0000-0000-000000000000'
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('user_id', fakeUserId) // 尝试查询伪造的用户ID
        .order('created_at', { ascending: false })

      setTestResults(prev => [...prev, {
        type: '伪造用户ID查询',
        success: !error,
        count: data?.length || 0,
        error: error?.message,
        data: data?.slice(0, 2),
        note: 'RLS策略会忽略前端传入的user_id，只使用auth.uid()'
      }])
    } catch (err: any) {
      setTestResults(prev => [...prev, {
        type: '伪造用户ID查询',
        success: false,
        error: err.message
      }])
    } finally {
      setLoading(false)
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    await normalQuery()
    await maliciousQuery()
    await fakeUserQuery()
  }

  if (!user) return null

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        安全性演示
      </h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          这个演示展示了即使恶意用户修改前端代码，Supabase的行级安全策略(RLS)仍然能够保护数据安全。
        </p>
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          {loading ? '测试中...' : '运行安全测试'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">测试结果：</h3>
          {testResults.map((result, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{result.type}</h4>
                <span className={`px-2 py-1 rounded text-sm ${
                  result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.success ? '成功' : '失败'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>返回记录数: {result.count}</p>
                {result.error && <p className="text-red-600">错误: {result.error}</p>}
                {result.note && <p className="text-blue-600 italic">{result.note}</p>}
                
                {result.data && result.data.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">返回的数据（前2条）:</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-800 mb-2">🛡️ 安全保障机制</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>行级安全策略(RLS)</strong>: 在数据库层面强制执行访问控制</li>
          <li>• <strong>auth.uid()</strong>: 使用服务器端认证的用户ID，无法被前端伪造</li>
          <li>• <strong>自动过滤</strong>: 即使前端代码被修改，数据库仍会自动应用安全策略</li>
          <li>• <strong>零信任原则</strong>: 永远不信任前端传入的用户身份信息</li>
        </ul>
      </div>
    </div>
  )
}