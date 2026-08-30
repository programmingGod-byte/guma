'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Problem } from '@/types'
import { Logo } from '@/components/Logo'

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [problems, setProblems] = useState<Problem[]>([])
  const [editingProblem, setEditingProblem] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'password') {
      setIsAuth(true)
      loadProblems()
    } else {
      alert('Invalid credentials')
    }
  }

  const loadProblems = () => {
    api.get('/problems/').then(res => setProblems(res.data))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isCreating) {
        await api.post('/problems/', editingProblem)
      } else {
        await api.put(`/problems/${editingProblem.slug}`, editingProblem)
      }
      setIsCreating(false)
      setEditingProblem(null)
      loadProblems()
    } catch (err) {
      alert('Error saving problem')
      console.error(err)
    }
  }

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this problem?')) {
      await api.delete(`/problems/${slug}`)
      loadProblems()
    }
  }

  const handleEdit = async (slug: string) => {
    const res = await api.get(`/problems/${slug}`)
    setEditingProblem(res.data)
    setIsCreating(false)
  }

  const handleAddTestCase = () => {
    setEditingProblem({
      ...editingProblem,
      test_cases: [...(editingProblem.test_cases || []), { input: '', expected_output: '' }]
    })
  }

  const handleTestCaseChange = (index: number, field: string, value: string) => {
    const newTestCases = [...editingProblem.test_cases]
    newTestCases[index][field] = value
    setEditingProblem({ ...editingProblem, test_cases: newTestCases })
  }

  const handleRemoveTestCase = (index: number) => {
    const newTestCases = [...editingProblem.test_cases]
    newTestCases.splice(index, 1)
    setEditingProblem({ ...editingProblem, test_cases: newTestCases })
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-sm shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Logo />
            <span className="font-semibold text-gray-900 text-[15px]">Admin Portal</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Username</label>
              <input
                type="text"
                placeholder="admin"
                className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-semibold text-gray-900 text-[15px]">Admin Portal</span>
          </div>
          <a href="/problems" className="text-xs text-gray-400 hover:text-gray-600 transition">← Back to problems</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar: problem list */}
        <div className="w-72 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Problems ({problems.length})</h2>
            <button
              onClick={() => {
                setIsCreating(true)
                setEditingProblem({
                  title: '', slug: '', description: '', difficulty: 'easy', topic: '', test_cases: []
                })
              }}
              className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              + New
            </button>
          </div>
          <div className="space-y-1">
            {problems.map(p => (
              <div key={p.slug} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2.5 group hover:border-gray-200 transition">
                <span className="text-sm text-gray-700 truncate flex-1">{p.title}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleEdit(p.slug)} className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => handleDelete(p.slug)} className="text-xs text-red-500 hover:text-red-700">Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1">
          {editingProblem ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">{isCreating ? 'New Problem' : 'Edit Problem'}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Title</label>
                    <input
                      value={editingProblem.title}
                      onChange={e => setEditingProblem({...editingProblem, title: e.target.value})}
                      className="w-full bg-white px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-900 outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Slug</label>
                    <input
                      value={editingProblem.slug}
                      onChange={e => setEditingProblem({...editingProblem, slug: e.target.value})}
                      className="w-full bg-white px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-900 outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">Description (Markdown)</label>
                  <textarea
                    value={editingProblem.description}
                    onChange={e => setEditingProblem({...editingProblem, description: e.target.value})}
                    className="w-full bg-white px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-900 outline-none focus:border-blue-500 transition h-40 font-mono"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Difficulty</label>
                    <select
                      value={editingProblem.difficulty}
                      onChange={e => setEditingProblem({...editingProblem, difficulty: e.target.value})}
                      className="w-full bg-white px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-900 outline-none focus:border-blue-500 transition"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Topic</label>
                    <input
                      value={editingProblem.topic || ''}
                      onChange={e => setEditingProblem({...editingProblem, topic: e.target.value})}
                      className="w-full bg-white px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-900 outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Test Cases */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-500">Test Cases</label>
                    <button type="button" onClick={handleAddTestCase} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      + Add
                    </button>
                  </div>
                  {editingProblem.test_cases?.map((tc: any, index: number) => (
                    <div key={index} className="flex gap-3 mb-3 items-start">
                      <div className="flex-1">
                        <textarea
                          placeholder="Input"
                          value={tc.input}
                          onChange={e => handleTestCaseChange(index, 'input', e.target.value)}
                          className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 font-mono text-xs h-16 outline-none focus:border-blue-500 transition text-gray-800"
                        />
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="Expected Output"
                          value={tc.expected_output}
                          onChange={e => handleTestCaseChange(index, 'expected_output', e.target.value)}
                          className="w-full bg-gray-50 px-3 py-2 rounded-md border border-gray-200 font-mono text-xs h-16 outline-none focus:border-blue-500 transition text-gray-800"
                        />
                      </div>
                      <button type="button" onClick={() => handleRemoveTestCase(index)} className="text-red-400 hover:text-red-600 text-lg mt-1 px-1">×</button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setEditingProblem(null)} className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                    Save
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-sm text-gray-300">
              Select a problem to edit, or create a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
