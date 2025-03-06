"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Process } from "@/lib/types"
import { Trash2 } from "lucide-react"

interface ProcessTableProps {
  processes: Process[]
  updateProcess: (process: Process) => void
  removeProcess: (id: number) => void
  algorithm: string
}

export function ProcessTable({ processes, updateProcess, removeProcess, algorithm }: ProcessTableProps) {
  const handleInputChange = (id: number, field: keyof Omit<Process, "id" | "name">, value: string) => {
    const process = processes.find((p) => p.id === id)
    if (process) {
      const parsedValue = Number.parseInt(value) || 0
      updateProcess({
        ...process,
        [field]: parsedValue >= 0 ? parsedValue : 0,
      })
    }
  }

  // Check if priority column should be shown
  const showPriorityColumn = algorithm === "priority-non-preemptive" || algorithm === "priority-preemptive"

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Process</TableHead>
            <TableHead>Arrival Time</TableHead>
            <TableHead>Burst Time</TableHead>
            {showPriorityColumn && <TableHead>Priority</TableHead>}
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process) => (
            <TableRow key={process.id}>
              <TableCell className="font-medium">{process.name}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="0"
                  value={process.arrivalTime}
                  onChange={(e) => handleInputChange(process.id, "arrivalTime", e.target.value)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="1"
                  value={process.burstTime}
                  onChange={(e) => handleInputChange(process.id, "burstTime", e.target.value)}
                  className="w-20"
                />
              </TableCell>
              {showPriorityColumn && (
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={process.priority}
                    onChange={(e) => handleInputChange(process.id, "priority", e.target.value)}
                    className="w-20"
                  />
                </TableCell>
              )}
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProcess(process.id)}
                  disabled={processes.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

