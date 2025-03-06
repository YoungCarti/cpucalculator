export interface Process {
  id: number
  name: string
  arrivalTime: number
  burstTime: number
  priority: number
}

export interface ScheduleItem {
  process: string
  startTime: number
  endTime: number
}

export interface ProcessStats {
  process: string
  arrivalTime: number
  burstTime: number
  completionTime: number
  turnaroundTime: number
  waitingTime: number
}

export interface SchedulingResult {
  schedule: ScheduleItem[]
  processStats: ProcessStats[]
  averageTurnaroundTime: number
  averageWaitingTime: number
  cpuUtilization: number
}

