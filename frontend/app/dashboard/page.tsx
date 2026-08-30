'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { isLoggedIn, removeToken } from '@/lib/auth'
import { Submission } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [weaknesses, setWeaknesses] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    api.get('/submissions/me').then(res => {
      const subs = res.data
      setSubmissions(subs)
      analyzeWeaknesses(subs)
    })
  }, [])

  const analyzeWeaknesses = (subs: any[]) => {
    const topicFails: Record<string, number> = {}
    const topicTotal: Record<string, number> = {}

    subs.forEach(s => {
      const topic = s.topic || 'unknown'
      topicTotal[topic] = (topicTotal[topic] || 0) + 1
      if (s.verdict !== 'accepted') {
        topicFails[topic] = (topicFails[topic] || 0) + 1
      }
    })

    const failRate: Record<string, number> = {}
    Object.keys(topicTotal).forEach(topic => {
      failRate[topic] = Math.round(((topicFails[topic] || 0) / topicTotal[topic]) * 100)
    })

    setWeaknesses(failRate)
  }

  const verdictColor = (v: string) => {
    if (v === 'accepted') return 'text-teal-400'
    if (v === 'wrong_answer') return 'text-red-400'
    if (v === 'time_limit') return 'text-yellow-400'
    return 'text-orange-400'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-teal-500"/>
          <span className="font-semibold tracking-tight text-sm">DSA Platform</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/problems')} className="text-white/30 hover:text-white text-xs transition">Problems</button>
          <button onClick={() => { removeToken(); router.push('/login') }} className="text-white/30 hover:text-white text-xs transition">Sign out</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-white mb-1">Dashboard</h1>
          <p className="text-sm text-white/30">Your performance and weak areas</p>
        </div>

        {Object.keys(weaknesses).length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs text-white/30 uppercase tracking-wider mb-4">Weakness Analysis</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(weaknesses).map(([topic, rate]) => (
                <div key={topic} className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/60 capitalize">{topic}</span>
                    <span className={`text-sm font-medium ${rate > 50 ? 'text-red-400' : rate > 25 ? 'text-yellow-400' : 'text-teal-400'}`}>
                      {rate}% fail rate
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rate > 50 ? 'bg-red-500' : rate > 25 ? 'bg-yellow-500' : 'bg-teal-500'}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xs text-white/30 uppercase tracking-wider mb-4">Submission History</h2>
          <div className="border border-white/5 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 text-xs text-white/25 uppercase tracking-wider px-5 py-3 border-b border-white/5">
              <span className="col-span-5">Problem</span>
              <span className="col-span-3">Verdict</span>
              <span className="col-span-2">Runtime</span>
              <span className="col-span-2">Language</span>
            </div>
            {submissions.length === 0 && (
              <div className="px-5 py-12 text-center text-white/20 text-sm">No submissions yet</div>
            )}
            {submissions.map(s => (
              <div key={s.id} className="grid grid-cols-12 px-5 py-3.5 border-b border-white/[0.03] items-center">
                <span className="col-span-5 text-sm text-white/50 truncate">{s.problem_id}</span>
                <span className={`col-span-3 text-xs capitalize font-medium ${verdictColor(s.verdict)}`}>
                  {s.verdict.replace('_', ' ')}
                </span>
                <span className="col-span-2 text-xs text-white/25">{s.runtime_ms ? `${s.runtime_ms}ms` : '—'}</span>
                <span className="col-span-2 text-xs text-white/25 capitalize">{s.language}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}