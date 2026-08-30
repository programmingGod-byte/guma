'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import api from '@/lib/api'
import { Problem, Submission } from '@/types'
import { Logo } from '@/components/Logo'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function ProblemPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState('#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    \n    return 0;\n}\n')
  const [language, setLanguage] = useState('cpp')
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState<string>('')
  const [hintLoading, setHintLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string>('')
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description')

  useEffect(() => {
    api.get(`/problems/${slug}`).then(res => setProblem(res.data))
  }, [slug])

  const handleSubmit = async () => {
    if (!problem) return
    setLoading(true)
    try {
      const res = await api.post('/submissions/', {
        problem_id: problem.id,
        code,
        language
      })
      setSubmission(res.data)
      setHint('')
      setActiveTab('submissions')
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const getHint = async (submissionId: string) => {
    setHintLoading(true)
    try {
      const res = await api.post(`/submissions/${submissionId}/hint`)
      setHint(res.data.hint)
    } catch (err) {
      console.error(err)
    }
    setHintLoading(false)
  }

  const handleAnalyze = async () => {
    if (!problem) return
    setAnalysisLoading(true)
    setAnalysis('')
    try {
      const res = await api.post('/submissions/analyze', {
        problem_id: problem.id,
        code,
        language
      })
      setAnalysis(res.data.analysis)
    } catch (err) {
      console.error(err)
    }
    setAnalysisLoading(false)
  }

  if (!problem) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"/>
    </div>
  )

  return (
    <div className="h-screen bg-[#fafafa] flex flex-col">
      {/* Top bar */}
      <div className="h-12 border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="cursor-pointer flex items-center gap-2" onClick={() => router.push('/')}>
            <Logo className="w-5 h-5" />
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <button
            onClick={() => router.push('/problems')}
            className="text-gray-400 hover:text-gray-700 text-[12px] font-medium transition"
          >
            ← Problems
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <span className="text-[13px] font-semibold text-gray-800">{problem.title}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
            problem.difficulty === 'easy'
              ? 'text-emerald-700 bg-emerald-50'
              : problem.difficulty === 'medium'
              ? 'text-amber-700 bg-amber-50'
              : 'text-red-700 bg-red-50'
          }`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={e => {
              const lang = e.target.value;
              setLanguage(lang);
              if (lang === 'cpp') {
                setCode('#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    \n    return 0;\n}\n');
              } else {
                setCode('# Write your solution here\n');
              }
            }}
            className="bg-white text-gray-700 px-2.5 py-1.5 rounded-md text-[12px] outline-none border border-gray-200 hover:border-gray-300 transition font-medium"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
          <button
            onClick={handleAnalyze}
            disabled={analysisLoading}
            className="border border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-500 hover:text-violet-700 px-3 py-1.5 rounded-md text-[12px] font-medium transition disabled:opacity-50"
          >
            {analysisLoading ? 'Analyzing…' : '✦ AI Analysis'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-md text-[12px] font-semibold transition flex items-center gap-1.5"
          >
            {loading && <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"/>}
            {loading ? 'Running…' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-[480px] flex-shrink-0 border-r border-gray-200 flex flex-col bg-white">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6 pt-1">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-[12px] font-semibold px-1 py-2.5 mr-5 border-b-2 transition ${
                activeTab === 'description'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`text-[12px] font-semibold px-1 py-2.5 border-b-2 transition ${
                activeTab === 'submissions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Result
              {submission && (
                <span className={`ml-1.5 w-1.5 h-1.5 rounded-full inline-block ${
                  submission.verdict === 'accepted' ? 'bg-emerald-400' : 'bg-red-400'
                }`} />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'description' && (
              <div className="p-6">
                <div className="prose prose-sm prose-gray max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:text-gray-800 prose-code:font-medium prose-code:before:content-none prose-code:after:content-none prose-strong:text-gray-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {problem.description}
                  </ReactMarkdown>
                </div>

                {problem.test_cases && problem.test_cases.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Examples</h3>
                    <div className="space-y-4">
                      {problem.test_cases.map((tc: any, idx: number) => (
                        <div key={idx} className="bg-gray-50/80 border border-gray-100 rounded-lg p-4">
                          <p className="text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Example {idx + 1}</p>
                          <div className="mb-2 flex items-start gap-2">
                            <span className="text-[13px] font-semibold text-gray-700 w-14">Input:</span>
                            <code className="text-[13px] font-mono text-gray-600 whitespace-pre-wrap">{tc.input}</code>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[13px] font-semibold text-gray-700 w-14">Output:</span>
                            <code className="text-[13px] font-mono text-gray-600 whitespace-pre-wrap">{tc.expected_output}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis && (
                  <div className="mt-6 p-4 rounded-xl border border-violet-200 bg-violet-50/50">
                    <h3 className="text-[12px] font-bold text-violet-700 uppercase tracking-wider mb-2">AI Analysis</h3>
                    <div className="prose prose-sm max-w-none text-violet-900/80 prose-p:leading-relaxed">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="p-6">
                {submission ? (
                  <div>
                    {/* Verdict */}
                    <div className={`p-4 rounded-xl border mb-4 ${
                      submission.verdict === 'accepted'
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-red-200 bg-red-50/50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-base font-bold capitalize ${
                          submission.verdict === 'accepted' ? 'text-emerald-700' : 'text-red-700'
                        }`}>
                          {submission.verdict.replace('_', ' ')}
                        </span>
                        {submission.runtime_ms !== null && (
                          <span className="text-[12px] text-gray-400 font-mono">{submission.runtime_ms}ms</span>
                        )}
                      </div>
                    </div>

                    {/* Hint button */}
                    <button
                      onClick={() => getHint(submission.id)}
                      disabled={hintLoading}
                      className="w-full text-[12px] font-medium border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-700 py-2.5 rounded-lg transition disabled:opacity-50"
                    >
                      {hintLoading ? 'Thinking…' : 'Get a Socratic hint from the AI'}
                    </button>
                    {hint && (
                      <div className="mt-3 p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                        <p className="text-[13px] text-blue-800 leading-relaxed">{hint}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-[13px] text-gray-300">Submit your code to see results.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right panel: editor */}
        <div className="flex-1 overflow-hidden">
          <MonacoEditor
            height="100%"
            language={language === 'cpp' ? 'cpp' : 'python'}
            value={code}
            onChange={v => setCode(v || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              fontLigatures: true,
              lineHeight: 1.6,
              renderLineHighlight: 'line',
              overviewRulerBorder: false,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
            }}
          />
        </div>
      </div>
    </div>
  )
}