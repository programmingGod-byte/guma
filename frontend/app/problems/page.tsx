'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { isLoggedIn, removeToken } from '@/lib/auth'
import { Problem } from '@/types'
import { Logo } from '@/components/Logo'

export default function ProblemsPage() {
  const router = useRouter()
  const [problems, setProblems] = useState<Problem[]>([])
  const [search, setSearch] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    api.get('/problems/').then(res => setProblems(res.data))
  }, [])

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  const topics = Array.from(new Set(problems.map(p => p.topic).filter(Boolean))) as string[]

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.topic && p.topic.toLowerCase().includes(search.toLowerCase()))
    const matchesDifficulty = selectedDifficulty ? p.difficulty === selectedDifficulty : true
    const matchesTopic = selectedTopic ? p.topic === selectedTopic : true
    return matchesSearch && matchesDifficulty && matchesTopic
  })

  const diffBadge = (d: string) => {
    if (d === 'easy') return 'text-emerald-700 bg-emerald-50'
    if (d === 'medium') return 'text-amber-700 bg-amber-50'
    return 'text-red-700 bg-red-50'
  }

  const easyCount = problems.filter(p => p.difficulty === 'easy').length
  const medCount = problems.filter(p => p.difficulty === 'medium').length
  const hardCount = problems.filter(p => p.difficulty === 'hard').length

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
              <Logo />
              <span className="font-semibold text-gray-900 text-[15px] tracking-tight">OmniCode</span>
            </div>
            <div className="h-5 w-px bg-gray-200" />
            <span className="text-[13px] font-medium text-gray-400">Problem Set</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="text-[12px] text-gray-400 hover:text-gray-600 transition"
            >
              Admin
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <button
              onClick={handleLogout}
              className="text-[12px] text-gray-400 hover:text-red-500 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-8">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-[13px] px-3 py-2 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition placeholder:text-gray-300"
              />
            </div>

            {/* Difficulty */}
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Difficulty</h3>
              <div className="space-y-0.5">
                {[
                  { label: 'All', value: null, count: problems.length },
                  { label: 'Easy', value: 'easy', count: easyCount, dot: 'bg-emerald-400' },
                  { label: 'Medium', value: 'medium', count: medCount, dot: 'bg-amber-400' },
                  { label: 'Hard', value: 'hard', count: hardCount, dot: 'bg-red-400' },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => setSelectedDifficulty(item.value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-[13px] flex items-center justify-between transition ${
                      selectedDifficulty === item.value
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.dot && <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />}
                      {item.label}
                    </span>
                    <span className="text-[11px] text-gray-300 font-normal">{item.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Topics</h3>
              <div className="space-y-0.5 max-h-80 overflow-y-auto">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition ${
                    selectedTopic === null ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  All Topics
                </button>
                {topics.sort().map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-[13px] transition truncate ${
                      selectedTopic === topic ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Active filters */}
          {(selectedDifficulty || selectedTopic) && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[11px] text-gray-400 mr-1">Filters:</span>
              {selectedDifficulty && (
                <button
                  onClick={() => setSelectedDifficulty(null)}
                  className="inline-flex items-center gap-1 text-[12px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium hover:bg-blue-100 transition"
                >
                  {selectedDifficulty} <span className="text-blue-400 ml-0.5">×</span>
                </button>
              )}
              {selectedTopic && (
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="inline-flex items-center gap-1 text-[12px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium hover:bg-blue-100 transition"
                >
                  {selectedTopic} <span className="text-blue-400 ml-0.5">×</span>
                </button>
              )}
            </div>
          )}

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-5 py-3 w-14">#</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-5 py-3">Title</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-5 py-3 w-36">Topic</th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-5 py-3 w-28">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.map((p, i) => (
                  <tr
                    key={p.id}
                    onClick={() => router.push(`/problems/${p.slug}`)}
                    className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3 text-[13px] text-gray-300 tabular-nums">{i + 1}</td>
                    <td className="px-5 py-3">
                      <span className="text-[13px] font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {p.title}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] text-gray-400">{p.topic || '—'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${diffBadge(p.difficulty)}`}>
                        {p.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredProblems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-20 text-center text-[13px] text-gray-300">
                      No problems match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-gray-300 mt-4 text-center">
            Showing {filteredProblems.length} of {problems.length} problems
          </p>
        </main>
      </div>
    </div>
  )
}