"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CPU Scheduling Calculator. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Created by <span className="font-medium text-foreground">Saabiresh</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="https://github.com/YoungCarti/cpucalculator" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub Repository</span>
            </Link>
          </Button>

          <Button className="flex items-center gap-2" asChild>
            <Link href="#" id="donation-link" target="_blank" rel="noopener noreferrer">
              <Heart className="h-4 w-4" />
              <span>Feedback & Support This Project</span>
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}

