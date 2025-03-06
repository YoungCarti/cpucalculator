"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface AlgorithmSelectorProps {
  algorithm: string
  setAlgorithm: (algorithm: string) => void
}

export function AlgorithmSelector({ algorithm, setAlgorithm }: AlgorithmSelectorProps) {
  const algorithms = [
    { id: "fcfs", name: "First Come First Serve (FCFS)" },
    { id: "sjf-non-preemptive", name: "Shortest Job First (Non-Preemptive)" },
    { id: "sjf-preemptive", name: "Shortest Job First (Preemptive)" },
    { id: "priority-non-preemptive", name: "Priority (Non-Preemptive)" },
    { id: "priority-preemptive", name: "Priority (Preemptive)" },
    { id: "round-robin", name: "Round Robin" },
  ]

  return (
    <RadioGroup value={algorithm} onValueChange={setAlgorithm} className="space-y-2">
      {algorithms.map((alg) => (
        <div key={alg.id} className="flex items-center space-x-2">
          <RadioGroupItem value={alg.id} id={alg.id} />
          <Label htmlFor={alg.id} className="cursor-pointer">
            {alg.name}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

