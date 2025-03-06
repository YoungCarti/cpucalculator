"use client"

import type { ScheduleItem } from "@/lib/types"
import { useTheme } from "next-themes"

interface GanttChartProps {
  schedule: ScheduleItem[]
}

export function GanttChart({ schedule }: GanttChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Calculate total time for scaling
  const totalTime = schedule.length > 0 ? schedule[schedule.length - 1].endTime : 0

  // Generate colors for processes
  const getProcessColor = (processName: string) => {
    const colors = [
      "bg-red-500 dark:bg-red-600",
      "bg-blue-500 dark:bg-blue-600",
      "bg-green-500 dark:bg-green-600",
      "bg-yellow-500 dark:bg-yellow-600",
      "bg-purple-500 dark:bg-purple-600",
      "bg-pink-500 dark:bg-pink-600",
      "bg-indigo-500 dark:bg-indigo-600",
      "bg-teal-500 dark:bg-teal-600",
    ]

    // Simple hash function to assign consistent colors
    const hash = processName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  if (schedule.length === 0) {
    return <div className="text-center py-8">No schedule data available</div>
  }

  return (
    <div className="space-y-4">
      <div className="relative h-16 border border-border rounded-md overflow-hidden">
        {schedule.map((item, index) => {
          const width = `${((item.endTime - item.startTime) / totalTime) * 100}%`
          const left = `${(item.startTime / totalTime) * 100}%`

          return (
            <div
              key={index}
              className={`absolute h-full flex items-center justify-center ${getProcessColor(item.process)}`}
              style={{ width, left }}
            >
              <span className="text-white font-medium text-sm">{item.process}</span>
            </div>
          )
        })}
      </div>

      <div className="relative h-6">
        {schedule.map((item, index) => {
          const left = `${(item.startTime / totalTime) * 100}%`
          const isLast = index === schedule.length - 1

          return (
            <div key={`time-${index}`} className="absolute transform -translate-x-1/2" style={{ left }}>
              <div className="h-3 border-l border-border"></div>
              <div className="text-xs text-muted-foreground">{item.startTime}</div>
            </div>
          )
        })}

        {/* Last time marker */}
        <div className="absolute transform -translate-x-1/2" style={{ left: "100%" }}>
          <div className="h-3 border-l border-border"></div>
          <div className="text-xs text-muted-foreground">{totalTime}</div>
        </div>
      </div>
    </div>
  )
}

