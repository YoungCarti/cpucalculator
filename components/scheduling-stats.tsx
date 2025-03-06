"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import type { SchedulingResult } from "@/lib/types"

interface SchedulingStatsProps {
  result: SchedulingResult
}

export function SchedulingStats({ result }: SchedulingStatsProps) {
  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Process</TableHead>
            <TableHead>Arrival Time</TableHead>
            <TableHead>Burst Time</TableHead>
            <TableHead>Completion Time</TableHead>
            <TableHead>Turnaround Time</TableHead>
            <TableHead>Waiting Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.processStats.map((stat) => (
            <TableRow key={stat.process}>
              <TableCell className="font-medium">{stat.process}</TableCell>
              <TableCell>{stat.arrivalTime}</TableCell>
              <TableCell>{stat.burstTime}</TableCell>
              <TableCell>{stat.completionTime}</TableCell>
              <TableCell>{stat.turnaroundTime}</TableCell>
              <TableCell>{stat.waitingTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{result.averageTurnaroundTime.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">Average Turnaround Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{result.averageWaitingTime.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">Average Waiting Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{(result.cpuUtilization * 100).toFixed(2)}%</div>
              <p className="text-sm text-muted-foreground">CPU Utilization</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

