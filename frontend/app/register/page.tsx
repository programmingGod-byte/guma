'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { setToken } from '@/lib/auth'
import { Logo } from '@/components/Logo'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    try {
      await api.post('/auth/register', { username, email, password })
      const res = await api.post('/auth/login', { email, password })
      setToken(res.data.access_token)
      router.push('/problems')
    } catch (err) {
      setError('Registration failed. Email may already exist.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex w-1/2 bg-white border-r border-gray-100 flex-col justify-between p-12">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
          <Logo />
          <span className="font-semibold text-gray-900 text-[15px]">OmniCode</span>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-900 leading-snug mb-3">
            Start your journey.<br/>Build problem-solving intuition.
          </p>
          <p className="text-sm text-gray-400">
            Track your weaknesses. Get AI-powered hints. Ace your interviews.
          </p>
        </div>
        <p className="text-xs text-gray-300">Built by Shriyaansh Gupta · IIT Mandi</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Create account</h1>
          <p className="text-sm text-gray-400 mb-8">Get started for free</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Username</label>
              <input
                className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition placeholder:text-gray-300"
                placeholder="shriyaansh"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Email</label>
              <input
                className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition placeholder:text-gray-300"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Password</label>
              <input
                className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg text-sm outline-none border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition placeholder:text-gray-300"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}