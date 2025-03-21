import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`transition-all duration-200 hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}