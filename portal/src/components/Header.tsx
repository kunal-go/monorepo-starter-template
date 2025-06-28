import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <nav className="flex items-center space-x-6">
          <div className="font-bold">
            <Link to="/" className="text-lg font-semibold">
              Portal
            </Link>
          </div>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm">Sign Up</Button>
        </div>
      </div>
    </header>
  )
}
