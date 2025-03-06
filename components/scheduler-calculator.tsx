"use client"

import { useState } from "react"
import { ProcessTable } from "./process-table"
import { AlgorithmSelector } from "./algorithm-selector"
import { GanttChart } from "./gantt-chart"
import { SchedulingStats } from "./scheduling-stats"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { calculateScheduling } from "@/lib/scheduling-algorithms"
import type { Process, SchedulingResult } from "@/lib/types"
import { Cpu, Plus } from "lucide-react"

export function SchedulerCalculator() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, name: "P1", arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 2, name: "P2", arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 3, name: "P3", arrivalTime: 2, burstTime: 8, priority: 4 },
    { id: 4, name: "P4", arrivalTime: 3, burstTime: 2, priority: 3 },
  ])
  const [algorithm, setAlgorithm] = useState<string>("fcfs")
  const [timeQuantum, setTimeQuantum] = useState<number>(2)
  const [result, setResult] = useState<SchedulingResult | null>(null)

  const addProcess = () => {
    const newId = processes.length > 0 ? Math.max(...processes.map((p) => p.id)) + 1 : 1
    setProcesses([
      ...processes,
      {
        id: newId,
        name: `P${newId}`,
        arrivalTime: 0,
        burstTime: 5,
        priority: 1,
      },
    ])
  }

  const removeProcess = (id: number) => {
    setProcesses(processes.filter((p) => p.id !== id))
  }

  const updateProcess = (updatedProcess: Process) => {
    setProcesses(processes.map((p) => (p.id === updatedProcess.id ? updatedProcess : p)))
  }

  const calculateSchedule = () => {
    const result = calculateScheduling(processes, algorithm, timeQuantum)
    setResult(result)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">CPU Scheduling Calculator</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Process Information</CardTitle>
              <CardDescription>Enter the details for each process you want to schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessTable
                processes={processes}
                updateProcess={updateProcess}
                removeProcess={removeProcess}
                algorithm={algorithm}
              />
              <div className="mt-4 flex justify-between">
                <Button onClick={addProcess} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Process
                </Button>
                <Button onClick={calculateSchedule} className="flex items-center gap-2">
                  Calculate Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Gantt Chart</CardTitle>
                  <CardDescription>Visual representation of the CPU scheduling</CardDescription>
                </CardHeader>
                <CardContent>
                  <GanttChart schedule={result.schedule} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Performance metrics for the selected algorithm</CardDescription>
                </CardHeader>
                <CardContent>
                  <SchedulingStats result={result} />
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Algorithm Settings</CardTitle>
              <CardDescription>Select the scheduling algorithm and configure its parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlgorithmSelector algorithm={algorithm} setAlgorithm={setAlgorithm} />

              {algorithm === "round-robin" && (
                <div className="space-y-2">
                  <Label htmlFor="time-quantum">Time Quantum</Label>
                  <Input
                    id="time-quantum"
                    type="number"
                    min="1"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(Number.parseInt(e.target.value) || 1)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

