import os
import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/v1/chat/completions")
LM_STUDIO_URL = os.getenv("LM_STUDIO_URL", "http://localhost:1234/v1/chat/completions")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:1b")

def get_interview_hint(problem_title: str, problem_description: str, code: str, verdict: str) -> str:
    if verdict == "accepted":
        prompt = f"""You are a senior software engineer conducting a technical interview.
The candidate just solved "{problem_title}" correctly.
Their solution:
{code}

Ask ONE follow-up question to probe deeper understanding. 
Could be about time complexity, space complexity, edge cases, or optimization.
Keep it under 2 sentences. Be direct like a real interviewer."""
    else:
        prompt = f"""You are a senior software engineer conducting a technical interview.
The candidate is struggling with "{problem_title}".
Problem: {problem_description}
Their incorrect solution:
{code}

Give ONE short Socratic hint that nudges them toward the right approach without giving the answer.
Do NOT say "Great attempt" or any filler praise.
Keep it under 2 sentences. Be direct."""

    # 1. Try Ollama (background daemon)
    try:
        payload = {
            "model": OLLAMA_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 150
        }
        res = requests.post(OLLAMA_URL, json=payload, timeout=6)
        if res.status_code == 200:
            data = res.json()
            if "choices" in data and len(data["choices"]) > 0:
                hint_text = data["choices"][0]["message"]["content"].strip()
                if hint_text:
                    return hint_text
    except Exception:
        pass

    # 2. Try LM Studio if running
    try:
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 150
        }
        res = requests.post(LM_STUDIO_URL, json=payload, timeout=6)
        if res.status_code == 200:
            data = res.json()
            if "choices" in data and len(data["choices"]) > 0:
                hint_text = data["choices"][0]["message"]["content"].strip()
                if hint_text:
                    return hint_text
    except Exception:
        pass

    # 3. Fallback default interviewer response
    if verdict == "accepted":
        return "Great solution! Can you analyze the time and space complexity of your approach?"
    else:
        return "Try tracing your code with a small example input step-by-step to identify where the logic diverges."

def analyze_code_with_ai(problem_title: str, problem_description: str, test_cases: str, code: str) -> str:
    prompt = f"""You are an elite competitive programming judge and technical interviewer.
Your ONLY goal is to analyze the logic, algorithmic efficiency, and correctness of the given code.
DO NOT suggest adding comments, changing variable names, or modifying code style. Focus strictly on the DSA problem-solving aspect.

Problem: "{problem_title}"
Description: {problem_description}
Test Cases: {test_cases}

User's Code:
{code}

Please provide:
1. Logic Faults/Bugs: If the logic is incorrect or fails test cases, explain why concisely without giving the full solution. If it is flawless, say "Logic appears correct."
2. Time Complexity: Big O notation and a 1-sentence justification.
3. Space Complexity: Big O notation and a 1-sentence justification.
Be strict, concise, and do not provide filler text or style advice."""

    try:
        payload = {
            "model": OLLAMA_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.5,
            "max_tokens": 300
        }
        res = requests.post(OLLAMA_URL, json=payload, timeout=60)
        if res.status_code == 200:
            data = res.json()
            if "choices" in data and len(data["choices"]) > 0:
                hint_text = data["choices"][0]["message"]["content"].strip()
                if hint_text:
                    return hint_text
    except Exception:
        pass

    return "Could not reach local AI for analysis. Ensure Ollama is running."