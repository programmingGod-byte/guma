import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models.problem import Problem

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    sample_problems = [
        {
            "title": "Two Sum",
            "slug": "two-sum",
            "description": (
                "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n"
                "Input Format:\nFirst line contains space-separated integers for `nums`.\nSecond line contains the `target` integer.\n\n"
                "Output Format:\nPrint the two indices separated by a space."
            ),
            "difficulty": "easy",
            "topic": "Arrays & Hashing",
            "test_cases": [
                {"input": "2 7 11 15\n9", "expected_output": "0 1"},
                {"input": "3 2 4\n6", "expected_output": "1 2"},
                {"input": "3 3\n6", "expected_output": "0 1"}
            ]
        },
        {
            "title": "Palindrome Number",
            "slug": "palindrome-number",
            "description": (
                "Given an integer `x`, return `True` if `x` is a palindrome, and `False` otherwise.\n\n"
                "Input Format:\nA single integer `x`.\n\n"
                "Output Format:\nPrint `True` or `False`."
            ),
            "difficulty": "easy",
            "topic": "Math",
            "test_cases": [
                {"input": "121", "expected_output": "True"},
                {"input": "-121", "expected_output": "False"},
                {"input": "10", "expected_output": "False"}
            ]
        },
        {
            "title": "Valid Parentheses",
            "slug": "valid-parentheses",
            "description": (
                "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\n"
                "An input string is valid if:\n"
                "1. Open brackets must be closed by the same type of brackets.\n"
                "2. Open brackets must be closed in the correct order.\n\n"
                "Input Format:\nA string `s`.\n\n"
                "Output Format:\nPrint `True` or `False`."
            ),
            "difficulty": "easy",
            "topic": "Stack",
            "test_cases": [
                {"input": "()", "expected_output": "True"},
                {"input": "()[]{}", "expected_output": "True"},
                {"input": "(]", "expected_output": "False"}
            ]
        },
        {
            "title": "Reverse String",
            "slug": "reverse-string",
            "description": (
                "Write a function that reverses a string.\n\n"
                "Input Format:\nA single string.\n\n"
                "Output Format:\nPrint the reversed string."
            ),
            "difficulty": "easy",
            "topic": "Strings",
            "test_cases": [
                {"input": "hello", "expected_output": "olleh"},
                {"input": "Hannah", "expected_output": "hannaH"}
            ]
        },
        {
            "title": "Maximum Subarray",
            "slug": "maximum-subarray",
            "description": (
                "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\n"
                "Input Format:\nSpace-separated integers.\n\n"
                "Output Format:\nPrint the maximum subarray sum."
            ),
            "difficulty": "medium",
            "topic": "Dynamic Programming",
            "test_cases": [
                {"input": "-2 1 -3 4 -1 2 1 -5 4", "expected_output": "6"},
                {"input": "1", "expected_output": "1"},
                {"input": "5 4 -1 7 8", "expected_output": "23"}
            ]
        }
    ]

    for p_data in sample_problems:
        existing = db.query(Problem).filter(Problem.slug == p_data["slug"]).first()
        if not existing:
            p = Problem(
                title=p_data["title"],
                slug=p_data["slug"],
                description=p_data["description"],
                difficulty=p_data["difficulty"],
                topic=p_data["topic"],
                test_cases=p_data["test_cases"]
            )
            db.add(p)
            print(f"Added problem: {p_data['title']}")
        else:
            print(f"Problem already exists: {p_data['title']}")

    db.commit()
    db.close()

if __name__ == "__main__":
    seed()
