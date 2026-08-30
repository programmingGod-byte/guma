export interface User {
  id: string
  username: string
  email: string
  created_at: string
}

export interface Problem {
  id: string
  title: string
  slug: string
  difficulty: string
  topic: string
  description?: string
  created_at: string
}

export interface TestCase {
  input: string
  expected_output: string
}

export interface Submission {
  id: string
  problem_id: string
  user_id: string
  code: string
  language: string
  verdict: string
  runtime_ms: number | null
  memory_kb: number | null
  created_at: string
}