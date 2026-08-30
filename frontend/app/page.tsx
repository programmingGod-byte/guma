'use client'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-semibold text-gray-900 text-[15px] tracking-tight">OmniCode</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/login')}
              className="text-[13px] text-gray-500 hover:text-gray-900 transition px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Log in
            </button>
            <button
              onClick={() => router.push('/register')}
              className="text-[13px] font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Sign up free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
              Open Source Platform
            </div>
            <h1 className="text-[42px] font-extrabold text-gray-900 tracking-tight leading-[1.12] mb-5">
              Practice DSA.<br />
              Think like an<br />
              <span className="text-blue-600">engineer.</span>
            </h1>
            <p className="text-[16px] text-gray-500 leading-[1.7] mb-8 max-w-md">
              Solve real interview problems with a built-in code editor, automated test case evaluation, and AI that critiques your logic — not your formatting.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/register')}
                className="bg-blue-600 text-white pl-5 pr-5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-600/20"
              >
                Get started — free
              </button>
              <button
                onClick={() => router.push('/problems')}
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Browse problems →
              </button>
            </div>
          </div>

          {/* Right: Code preview card */}
          <div className="hidden lg:block">
            <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-200">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#252526] border-b border-[#333]">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="text-[11px] text-gray-500 ml-3 font-mono">solution.cpp</span>
              </div>
              {/* Code */}
              <div className="p-5 font-mono text-[13px] leading-[1.8] text-gray-300">
                <div><span className="text-[#c586c0]">#include</span> <span className="text-[#ce9178]">&lt;bits/stdc++.h&gt;</span></div>
                <div><span className="text-[#569cd6]">using namespace</span> std;</div>
                <div className="text-gray-600"> </div>
                <div><span className="text-[#569cd6]">int</span> <span className="text-[#dcdcaa]">main</span>() {'{'}</div>
                <div>    <span className="text-[#569cd6]">int</span> n;</div>
                <div>    cin &gt;&gt; n;</div>
                <div>    vector&lt;<span className="text-[#569cd6]">int</span>&gt; nums(n);</div>
                <div>    <span className="text-[#c586c0]">for</span>(<span className="text-[#569cd6]">int</span> i = <span className="text-[#b5cea8]">0</span>; i &lt; n; i++)</div>
                <div>        cin &gt;&gt; nums[i];</div>
                <div className="text-gray-600"> </div>
                <div>    <span className="text-[#6a9955]">// Your logic here</span></div>
                <div>    <span className="text-[#c586c0]">return</span> <span className="text-[#b5cea8]">0</span>;</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-8 py-6 grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">20+</p>
            <p className="text-xs text-gray-400 mt-1">Curated Problems</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">C++ & Python</p>
            <p className="text-xs text-gray-400 mt-1">Supported Languages</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">Local AI</p>
            <p className="text-xs text-gray-400 mt-1">Ollama Powered</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Why OmniCode?</h2>
          <p className="text-sm text-gray-400 mt-2">Everything you need to prepare, nothing you don't.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-100 rounded-xl p-6 hover:border-gray-200 transition group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">Monaco Editor</h3>
            <p className="text-[13px] text-gray-400 leading-[1.6]">
              The same editor used in VS Code. Full syntax highlighting, bracket matching, and IntelliSense.
            </p>
          </div>
          <div className="border border-gray-100 rounded-xl p-6 hover:border-gray-200 transition group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-5 group-hover:bg-amber-100 transition">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">Server-Side Execution</h3>
            <p className="text-[13px] text-gray-400 leading-[1.6]">
              Code compiles via g++ or runs through Python3 on the backend. Test cases are evaluated in under a second.
            </p>
          </div>
          <div className="border border-gray-100 rounded-xl p-6 hover:border-gray-200 transition group">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-5 group-hover:bg-violet-100 transition">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">Socratic AI Feedback</h3>
            <p className="text-[13px] text-gray-400 leading-[1.6]">
              An LLM running locally via Ollama analyzes your code for logic bugs, time complexity, and space complexity.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">Ready to start solving?</h2>
          <p className="text-sm text-gray-400 mb-8">Create a free account and start practicing today.</p>
          <button
            onClick={() => router.push('/register')}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-gray-800 transition"
          >
            Create free account
          </button>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5" />
            <span className="text-xs font-medium text-gray-400">OmniCode</span>
          </div>
          <p className="text-xs text-gray-300">Built by Shriyaansh Gupta · IIT Mandi</p>
        </div>
      </div>
    </div>
  )
}
