import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.problem import Problem

def seed():
    db = SessionLocal()
    
    problems = [
        {
            "title": "Merge Intervals",
            "slug": "merge-intervals",
            "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\n**Example:**\nInput: `intervals = [[1,3],[2,6],[8,10],[15,18]]`\nOutput: `[[1,6],[8,10],[15,18]]`",
            "difficulty": "medium",
            "topic": "Arrays",
            "test_cases": [
                {"input": "[[1,3],[2,6],[8,10],[15,18]]", "expected_output": "[[1,6],[8,10],[15,18]]"}
            ]
        },
        {
            "title": "Trapping Rain Water",
            "slug": "trapping-rain-water",
            "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.\n\n**Example:**\nInput: `height = [0,1,0,2,1,0,1,3,2,1,2,1]`\nOutput: `6`",
            "difficulty": "hard",
            "topic": "Two Pointers",
            "test_cases": [
                {"input": "[0,1,0,2,1,0,1,3,2,1,2,1]", "expected_output": "6"}
            ]
        },
        {
            "title": "Climbing Stairs",
            "slug": "climbing-stairs",
            "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?\n\n**Example:**\nInput: `n = 2`\nOutput: `2`",
            "difficulty": "easy",
            "topic": "Dynamic Programming",
            "test_cases": [
                {"input": "2", "expected_output": "2"},
                {"input": "3", "expected_output": "3"}
            ]
        },
        {
            "title": "Longest Substring Without Repeating Characters",
            "slug": "longest-substring",
            "description": "Given a string `s`, find the length of the longest substring without repeating characters.\n\n**Example:**\nInput: `s = \"abcabcbb\"`\nOutput: `3`",
            "difficulty": "medium",
            "topic": "Sliding Window",
            "test_cases": [
                {"input": "abcabcbb", "expected_output": "3"}
            ]
        },
        {
            "title": "Valid Anagram",
            "slug": "valid-anagram",
            "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\n**Example:**\nInput: `s = \"anagram\", t = \"nagaram\"`\nOutput: `true`",
            "difficulty": "easy",
            "topic": "Hash Table",
            "test_cases": [
                {"input": "anagram\nnagaram", "expected_output": "true"}
            ]
        },
        {
            "title": "Kth Largest Element in an Array",
            "slug": "kth-largest-element",
            "description": "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest element in the sorted order, not the `k`th distinct element.\n\n**Example:**\nInput: `nums = [3,2,1,5,6,4], k = 2`\nOutput: `5`",
            "difficulty": "medium",
            "topic": "Heap",
            "test_cases": [
                {"input": "[3,2,1,5,6,4]\n2", "expected_output": "5"}
            ]
        },
        {
            "title": "Binary Search",
            "slug": "binary-search",
            "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\n**Example:**\nInput: `nums = [-1,0,3,5,9,12], target = 9`\nOutput: `4`",
            "difficulty": "easy",
            "topic": "Binary Search",
            "test_cases": [
                {"input": "[-1,0,3,5,9,12]\n9", "expected_output": "4"}
            ]
        },
        {
            "title": "LRU Cache",
            "slug": "lru-cache",
            "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class.",
            "difficulty": "medium",
            "topic": "Design",
            "test_cases": []
        },
        {
            "title": "Word Search",
            "slug": "word-search",
            "description": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
            "difficulty": "medium",
            "topic": "Backtracking",
            "test_cases": []
        },
        {
            "title": "Maximum Depth of Binary Tree",
            "slug": "max-depth-binary-tree",
            "description": "Given the `root` of a binary tree, return its maximum depth.",
            "difficulty": "easy",
            "topic": "Trees",
            "test_cases": []
        },
        {
            "title": "Number of Islands",
            "slug": "number-of-islands",
            "description": "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.",
            "difficulty": "medium",
            "topic": "Graph",
            "test_cases": []
        },
        {
            "title": "Best Time to Buy and Sell Stock",
            "slug": "buy-and-sell-stock",
            "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
            "difficulty": "easy",
            "topic": "Arrays",
            "test_cases": []
        },
        {
            "title": "Course Schedule",
            "slug": "course-schedule",
            "description": "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. Return `true` if you can finish all courses. Otherwise, return `false`.",
            "difficulty": "medium",
            "topic": "Graph",
            "test_cases": []
        },
        {
            "title": "Edit Distance",
            "slug": "edit-distance",
            "description": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.",
            "difficulty": "hard",
            "topic": "Dynamic Programming",
            "test_cases": []
        }
    ]

    for p in problems:
        existing = db.query(Problem).filter(Problem.slug == p["slug"]).first()
        if not existing:
            new_prob = Problem(**p)
            db.add(new_prob)
            print(f"Added: {p['title']}")
        else:
            print(f"Skipped (already exists): {p['title']}")
    
    db.commit()
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    seed()
