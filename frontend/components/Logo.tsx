import React from 'react'

export function Logo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="8" fill="#2563eb" />
      <path d="M10 13L15 18L10 23" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 23H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
