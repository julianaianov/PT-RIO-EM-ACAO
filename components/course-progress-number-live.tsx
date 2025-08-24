"use client"

import { useEffect, useState } from "react"

interface CourseProgressNumberLiveProps {
  courseId: string
  initialPercentage: number
}

export default function CourseProgressNumberLive({ courseId, initialPercentage }: CourseProgressNumberLiveProps) {
  const [percentage, setPercentage] = useState<number>(Number(initialPercentage || 0))

  useEffect(() => {
    setPercentage(Number(initialPercentage || 0))
  }, [initialPercentage])

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ courseId: string; percentage: number }>
      if (ce.detail?.courseId === courseId) {
        setPercentage(Math.max(0, Math.min(100, Math.round(ce.detail.percentage || 0))))
      }
    }
    window.addEventListener("course-progress-updated", handler)
    return () => window.removeEventListener("course-progress-updated", handler)
  }, [courseId])

  return <span>{percentage}%</span>
}


