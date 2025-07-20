'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Bell, 
  User,
  LogOut,
  Shield,
  Users,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationProps {
  userRole: string
}

const roleBasedMenus = {
  CLIENT: [
    { href: '/dashboard/client', label: 'Dashboard', icon: Home },
    { href: '/dashboard/client/jobs/search', label: 'Find Services', icon: Search },
    { href: '/dashboard/client/jobs/post', label: 'Post Job', icon: PlusCircle },
    { href: '/dashboard/client/jobs', label: 'My Jobs', icon: MessageSquare },
  ],
  PROVIDER: [
    { href: '/dashboard/provider', label: 'Dashboard', icon: Home },
    { href: '/dashboard/provider/jobs', label: 'Browse Jobs', icon: Search },
    { href: '/dashboard/provider/applications', label: 'Applications', icon: MessageSquare },
    { href: '/dashboard/provider/profile', label: 'Profile', icon: User },
  ],
  AGENT: [
    { href: '/dashboard/agent', label: 'Dashboard', icon: Home },
    { href: '/dashboard/agent/complaints', label: 'Complaints', icon: MessageSquare },
    { href: '/dashboard/agent/verifications', label: 'Verifications', icon: Shield },
    { href: '/dashboard/agent/users', label: 'Users', icon: Users },
  ],
  ADMIN: [
    { href: '/dashboard/admin', label: 'Dashboard', icon: Home },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
    { href: '/dashboard/admin/agents', label: 'Agents', icon: Shield },
    { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ],
}

export function Navigation({ userRole }: NavigationProps) {
  const pathname = usePathname()
  const menuItems = roleBasedMenus[userRole as keyof typeof roleBasedMenus] || []

  return (
    <nav className="flex flex-col h-full">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MC</span>
          </div>
          <span className="font-bold text-lg">Ma'aikata Connect</span>
        </Link>
      </div>

      <div className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="p-3 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  )
}