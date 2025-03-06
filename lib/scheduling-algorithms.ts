import type { Process, ScheduleItem, ProcessStats, SchedulingResult } from "./types"

// Helper function to deep clone processes
const cloneProcesses = (processes: Process[]): Process[] => {
  return processes.map((p) => ({ ...p }))
}

// First Come First Serve (FCFS)
const fcfs = (processes: Process[]): ScheduleItem[] => {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const schedule: ScheduleItem[] = []
  let currentTime = 0

  for (const process of sortedProcesses) {
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime
    }

    schedule.push({
      process: process.name,
      startTime: currentTime,
      endTime: currentTime + process.burstTime,
    })

    currentTime += process.burstTime
  }

  return schedule
}

// Non-Preemptive Shortest Job First (SJF)
const sjfNonPreemptive = (processes: Process[]): ScheduleItem[] => {
  const remainingProcesses = cloneProcesses(processes)
  const schedule: ScheduleItem[] = []
  let currentTime = 0

  while (remainingProcesses.length > 0) {
    // Find available processes at current time
    const availableProcesses = remainingProcesses.filter((p) => p.arrivalTime <= currentTime)

    if (availableProcesses.length === 0) {
      // No process available, jump to next arrival time
      const nextArrival = Math.min(...remainingProcesses.map((p) => p.arrivalTime))
      currentTime = nextArrival
      continue
    }

    // Find the process with shortest burst time
    const shortestJob = availableProcesses.reduce((prev, curr) => (prev.burstTime < curr.burstTime ? prev : curr))

    // Add to schedule
    schedule.push({
      process: shortestJob.name,
      startTime: currentTime,
      endTime: currentTime + shortestJob.burstTime,
    })

    // Update current time
    currentTime += shortestJob.burstTime

    // Remove the process from remaining
    const index = remainingProcesses.findIndex((p) => p.id === shortestJob.id)
    remainingProcesses.splice(index, 1)
  }

  return schedule
}

// Preemptive Shortest Job First (SRTF)
const sjfPreemptive = (processes: Process[]): ScheduleItem[] => {
  const remainingProcesses = cloneProcesses(processes)
  const schedule: ScheduleItem[] = []
  let currentTime = 0
  let currentProcess: Process | null = null
  let lastProcessName = ""

  // Set remaining time for each process
  remainingProcesses.forEach((p) => {
    p["remainingTime"] = p.burstTime
  })

  // Get all arrival times and sort them
  const events = [
    ...new Set([...processes.map((p) => p.arrivalTime), ...processes.map((p) => p.arrivalTime + p.burstTime)]),
  ].sort((a, b) => a - b)

  for (let i = 0; i < events.length; i++) {
    const nextEventTime = events[i]

    // Process current job until next event
    if (currentProcess && currentTime < nextEventTime) {
      const processTime = Math.min(nextEventTime - currentTime, currentProcess["remainingTime"])

      if (lastProcessName !== currentProcess.name) {
        schedule.push({
          process: currentProcess.name,
          startTime: currentTime,
          endTime: currentTime + processTime,
        })
        lastProcessName = currentProcess.name
      } else {
        // Extend the last schedule item
        const lastSchedule = schedule[schedule.length - 1]
        lastSchedule.endTime = currentTime + processTime
      }

      currentProcess["remainingTime"] -= processTime
      currentTime += processTime
    }

    // Update current time to next event
    currentTime = Math.max(currentTime, nextEventTime)

    // Find available processes
    const availableProcesses = remainingProcesses.filter((p) => p.arrivalTime <= currentTime && p["remainingTime"] > 0)

    if (availableProcesses.length === 0) {
      currentProcess = null
      continue
    }

    // Find the process with shortest remaining time
    currentProcess = availableProcesses.reduce((prev, curr) =>
      prev["remainingTime"] < curr["remainingTime"] ? prev : curr,
    )
  }

  // Process any remaining work
  remainingProcesses
    .filter((p) => p["remainingTime"] > 0)
    .forEach((p) => {
      schedule.push({
        process: p.name,
        startTime: currentTime,
        endTime: currentTime + p["remainingTime"],
      })
      currentTime += p["remainingTime"]
    })

  // Merge consecutive same process executions
  const mergedSchedule: ScheduleItem[] = []
  for (const item of schedule) {
    if (mergedSchedule.length === 0 || mergedSchedule[mergedSchedule.length - 1].process !== item.process) {
      mergedSchedule.push({ ...item })
    } else {
      mergedSchedule[mergedSchedule.length - 1].endTime = item.endTime
    }
  }

  return mergedSchedule
}

// Non-Preemptive Priority
const priorityNonPreemptive = (processes: Process[]): ScheduleItem[] => {
  const remainingProcesses = cloneProcesses(processes)
  const schedule: ScheduleItem[] = []
  let currentTime = 0

  while (remainingProcesses.length > 0) {
    // Find available processes at current time
    const availableProcesses = remainingProcesses.filter((p) => p.arrivalTime <= currentTime)

    if (availableProcesses.length === 0) {
      // No process available, jump to next arrival time
      const nextArrival = Math.min(...remainingProcesses.map((p) => p.arrivalTime))
      currentTime = nextArrival
      continue
    }

    // Find the process with highest priority (lower number = higher priority)
    const highestPriorityProcess = availableProcesses.reduce((prev, curr) =>
      prev.priority < curr.priority ? prev : curr,
    )

    // Add to schedule
    schedule.push({
      process: highestPriorityProcess.name,
      startTime: currentTime,
      endTime: currentTime + highestPriorityProcess.burstTime,
    })

    // Update current time
    currentTime += highestPriorityProcess.burstTime

    // Remove the process from remaining
    const index = remainingProcesses.findIndex((p) => p.id === highestPriorityProcess.id)
    remainingProcesses.splice(index, 1)
  }

  return schedule
}

// Preemptive Priority
const priorityPreemptive = (processes: Process[]): ScheduleItem[] => {
  const remainingProcesses = cloneProcesses(processes)
  const schedule: ScheduleItem[] = []
  let currentTime = 0
  let currentProcess: Process | null = null
  let lastProcessName = ""

  // Set remaining time for each process
  remainingProcesses.forEach((p) => {
    p["remainingTime"] = p.burstTime
  })

  // Get all arrival times and sort them
  const events = [
    ...new Set([...processes.map((p) => p.arrivalTime), ...processes.map((p) => p.arrivalTime + p.burstTime)]),
  ].sort((a, b) => a - b)

  for (let i = 0; i < events.length; i++) {
    const nextEventTime = events[i]

    // Process current job until next event
    if (currentProcess && currentTime < nextEventTime) {
      const processTime = Math.min(nextEventTime - currentTime, currentProcess["remainingTime"])

      if (lastProcessName !== currentProcess.name) {
        schedule.push({
          process: currentProcess.name,
          startTime: currentTime,
          endTime: currentTime + processTime,
        })
        lastProcessName = currentProcess.name
      } else {
        // Extend the last schedule item
        const lastSchedule = schedule[schedule.length - 1]
        lastSchedule.endTime = currentTime + processTime
      }

      currentProcess["remainingTime"] -= processTime
      currentTime += processTime
    }

    // Update current time to next event
    currentTime = Math.max(currentTime, nextEventTime)

    // Find available processes
    const availableProcesses = remainingProcesses.filter((p) => p.arrivalTime <= currentTime && p["remainingTime"] > 0)

    if (availableProcesses.length === 0) {
      currentProcess = null
      continue
    }

    // Find the process with highest priority
    currentProcess = availableProcesses.reduce((prev, curr) => (prev.priority < curr.priority ? prev : curr))
  }

  // Process any remaining work
  remainingProcesses
    .filter((p) => p["remainingTime"] > 0)
    .forEach((p) => {
      schedule.push({
        process: p.name,
        startTime: currentTime,
        endTime: currentTime + p["remainingTime"],
      })
      currentTime += p["remainingTime"]
    })

  // Merge consecutive same process executions
  const mergedSchedule: ScheduleItem[] = []
  for (const item of schedule) {
    if (mergedSchedule.length === 0 || mergedSchedule[mergedSchedule.length - 1].process !== item.process) {
      mergedSchedule.push({ ...item })
    } else {
      mergedSchedule[mergedSchedule.length - 1].endTime = item.endTime
    }
  }

  return mergedSchedule
}

// Round Robin
const roundRobin = (processes: Process[], timeQuantum: number): ScheduleItem[] => {
  const remainingProcesses = cloneProcesses(processes)
  const schedule: ScheduleItem[] = []
  let currentTime = 0
  let queue: Process[] = []

  // Set remaining time for each process
  remainingProcesses.forEach((p) => {
    p["remainingTime"] = p.burstTime
  })

  // Sort by arrival time
  remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime)

  while (remainingProcesses.some((p) => p["remainingTime"] > 0) || queue.length > 0) {
    // Add newly arrived processes to the queue
    const newArrivals = remainingProcesses.filter(
      (p) => p.arrivalTime <= currentTime && p["remainingTime"] > 0 && !queue.includes(p),
    )
    queue = [...queue, ...newArrivals]

    if (queue.length === 0) {
      // No process in queue, jump to next arrival
      const nextArrival = Math.min(
        ...remainingProcesses.filter((p) => p["remainingTime"] > 0).map((p) => p.arrivalTime),
      )
      currentTime = nextArrival
      continue
    }

    // Get the next process from queue
    const currentProcess = queue.shift()!

    // Calculate execution time for this quantum
    const executionTime = Math.min(timeQuantum, currentProcess["remainingTime"])

    // Add to schedule
    schedule.push({
      process: currentProcess.name,
      startTime: currentTime,
      endTime: currentTime + executionTime,
    })

    // Update remaining time and current time
    currentProcess["remainingTime"] -= executionTime
    currentTime += executionTime

    // If process still has remaining time, add it back to queue
    if (currentProcess["remainingTime"] > 0) {
      // Add newly arrived processes before re-adding current process
      const newArrivalsBeforeRequeue = remainingProcesses.filter(
        (p) =>
          p.arrivalTime <= currentTime && p["remainingTime"] > 0 && !queue.includes(p) && p.id !== currentProcess.id,
      )
      queue = [...queue, ...newArrivalsBeforeRequeue, currentProcess]
    }
  }

  // Merge consecutive same process executions
  const mergedSchedule: ScheduleItem[] = []
  for (const item of schedule) {
    if (mergedSchedule.length === 0 || mergedSchedule[mergedSchedule.length - 1].process !== item.process) {
      mergedSchedule.push({ ...item })
    } else {
      mergedSchedule[mergedSchedule.length - 1].endTime = item.endTime
    }
  }

  return mergedSchedule
}

// Calculate process statistics
const calculateProcessStats = (processes: Process[], schedule: ScheduleItem[]): ProcessStats[] => {
  const stats: ProcessStats[] = []

  for (const process of processes) {
    // Find completion time (end time of last execution)
    const processSchedules = schedule.filter((s) => s.process === process.name)
    const completionTime = processSchedules.length > 0 ? Math.max(...processSchedules.map((s) => s.endTime)) : 0

    // Calculate turnaround and waiting time
    const turnaroundTime = completionTime - process.arrivalTime
    const waitingTime = turnaroundTime - process.burstTime

    stats.push({
      process: process.name,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      completionTime,
      turnaroundTime,
      waitingTime,
    })
  }

  return stats
}

// Main function to calculate scheduling based on selected algorithm
export const calculateScheduling = (processes: Process[], algorithm: string, timeQuantum: number): SchedulingResult => {
  let schedule: ScheduleItem[] = []

  switch (algorithm) {
    case "fcfs":
      schedule = fcfs(processes)
      break
    case "sjf-non-preemptive":
      schedule = sjfNonPreemptive(processes)
      break
    case "sjf-preemptive":
      schedule = sjfPreemptive(processes)
      break
    case "priority-non-preemptive":
      schedule = priorityNonPreemptive(processes)
      break
    case "priority-preemptive":
      schedule = priorityPreemptive(processes)
      break
    case "round-robin":
      schedule = roundRobin(processes, timeQuantum)
      break
    default:
      schedule = fcfs(processes)
  }

  // Calculate process statistics
  const processStats = calculateProcessStats(processes, schedule)

  // Calculate average metrics
  const averageTurnaroundTime = processStats.reduce((sum, stat) => sum + stat.turnaroundTime, 0) / processStats.length
  const averageWaitingTime = processStats.reduce((sum, stat) => sum + stat.waitingTime, 0) / processStats.length

  // Calculate CPU utilization (assuming no idle time between processes)
  const totalBurstTime = processes.reduce((sum, process) => sum + process.burstTime, 0)
  const totalTime = schedule.length > 0 ? schedule[schedule.length - 1].endTime : 0
  const cpuUtilization = totalTime > 0 ? totalBurstTime / totalTime : 0

  return {
    schedule,
    processStats,
    averageTurnaroundTime,
    averageWaitingTime,
    cpuUtilization,
  }
}

