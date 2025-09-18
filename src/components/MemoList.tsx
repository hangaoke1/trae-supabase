import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Memo {
  id: string
  content: string
  created_at: string
  user_id: string
}

export const MemoList: React.FC = () => {
  const { user } = useAuth()
  const [memos, setMemos] = useState<Memo[]>([])
  const [newMemo, setNewMemo] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 获取备忘录列表
  const fetchMemos = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('获取备忘录失败:', error)
        return
      }

      setMemos(data || [])
    } catch (error) {
      console.error('获取备忘录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 添加备忘录
  const addMemo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMemo.trim()) return

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('memos')
        .insert([
          {
            content: newMemo.trim(),
            user_id: user.id
          }
        ])
        .select()

      if (error) {
        console.error('添加备忘录失败:', error)
        return
      }

      if (data && data.length > 0) {
        setMemos([data[0], ...memos])
        setNewMemo('')
      }
    } catch (error) {
      console.error('添加备忘录失败:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // 删除备忘录
  const deleteMemo = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        console.error('删除备忘录失败:', error)
        return
      }

      setMemos(memos.filter(memo => memo.id !== id))
    } catch (error) {
      console.error('删除备忘录失败:', error)
    }
  }

  useEffect(() => {
    fetchMemos()
  }, [user])

  if (!user) return null

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-slide-up">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        我的备忘录
      </h2>

      {/* 添加备忘录表单 */}
      <form onSubmit={addMemo} className="mb-6">
        <div className="flex gap-3">
          <textarea
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
            placeholder="写下你的备忘录..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={!newMemo.trim() || submitting}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 self-start"
          >
            {submitting ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              '添加'
            )}
          </button>
        </div>
      </form>

      {/* 备忘录列表 */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : memos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>还没有备忘录，快来添加第一条吧！</p>
          </div>
        ) : (
          memos.map((memo) => (
            <div key={memo.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <p className="text-gray-800 whitespace-pre-wrap break-words">{memo.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
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
    </div>
  )
}