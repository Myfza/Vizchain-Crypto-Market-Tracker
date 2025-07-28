import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <SidebarTrigger className="h-8 w-8" />
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <User className="h-4 w-4" />
            <span className="sr-only">User account</span>
          </Button>
        </div>
      </div>
    </header>
  )
}