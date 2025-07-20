'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Shield, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { role } = useParams()
  const [userName, setUserName] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAgents: 0,
    totalRevenue: 0,
    openComplaints: 0,
    verifiedUsers: 0,
    systemHealth: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [systemAlerts, setSystemAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch user details
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('firstName, lastName')
          .eq('id', user.id)
          .single()
        if (userError) console.error('User fetch error:', userError)
        else setUserName(`${userData.firstName} ${userData.lastName || ''}`)

        // Fetch stats
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        const { count: activeAgents } = await supabase
          .from('agents')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ACTIVE')
        const { data: revenueData } = await supabase
          .from('transactions')
          .select('amount', { count: 'exact' })
        const totalRevenue = revenueData?.reduce((sum: number, t: any) => sum + t.amount, 0) || 0
        const { count: openComplaints } = await supabase
          .from('complaints')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'OPEN')
        const { count: verifiedUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'VERIFIED')
        setStats({
          totalUsers: totalUsers || 0,
          activeAgents: activeAgents || 0,
          totalRevenue: totalRevenue || 0,
          openComplaints: openComplaints || 0,
          verifiedUsers: verifiedUsers || 0,
          systemHealth: 99.8, // Placeholder; fetch from monitoring system
        })

        // Fetch recent activity
        const { data: activityData, error: activityError } = await supabase
          .from('activity_logs')
          .select(`
            *,
            user:users(firstName, lastName)
          `)
          .order('timestamp', { ascending: false })
          .limit(5)
        if (activityError) console.error('Activity fetch error:', activityError)
        else {
          setRecentActivity(activityData.map((activity: any) => ({
            id: activity.id,
            type: activity.type,
            description: activity.description,
            timestamp: activity.timestamp,
            status: activity.status || 'INFO',
          })))
        }

        // Fetch system alerts
        const { data: alertsData, error: alertsError } = await supabase
          .from('system_alerts')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(5)
        if (alertsError) console.error('Alerts fetch error:', alertsError)
        else setSystemAlerts(alertsData)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <DashboardLayout userRole={role as string} userName={userName || 'User'}>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Oversight and management of the platform</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            <Button asChild className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="/dashboard/admin/analytics">
                <BarChart3 className="mr-2 h-4 w-4" /> Analytics
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/dashboard/admin/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemAlerts.map((alert: any) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">{alert.message}</span>
                      <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <Link href={`/dashboard/admin/alerts/${alert.id}`}>Investigate</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Total Users</CardTitle>
              <Users className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Active Agents</CardTitle>
              <Shield className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{stats.activeAgents}</div>
              <p className="text-sm text-gray-500 mt-1">Across all regions</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">₦{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
              <p className="text-sm text-gray-500 mt-1">Total platform revenue</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Open Complaints</CardTitle>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.openComplaints}</div>
              <p className="text-sm text-gray-500 mt-1">Requiring attention</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Verified Users</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.verifiedUsers.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">{((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1)}% of total</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">System Health</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.systemHealth}%</div>
              <p className="text-sm text-gray-500 mt-1">Uptime this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/admin/activity">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity: any) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'SUCCESS' ? 'bg-green-500' :
                      activity.status === 'WARNING' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-lg">{activity.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Management Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">User Management</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Manage accounts, roles, and permissions</p>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                <Link href="/dashboard/admin/users">
                  <Users className="mr-2 h-4 w-4" /> Manage Users
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Agent Oversight</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Monitor performance and assign regions</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/admin/agents">
                  <Shield className="mr-2 h-4 w-4" /> Manage Agents
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">View analytics and generate reports</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/admin/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Configure settings and integrations</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/admin/settings">
                  <Settings className="mr-2 h-4 w-4" /> System Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Global Overview */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Global Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">12</div>
                <p className="text-gray-600">Active Countries</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2.8M</div>
                <p className="text-gray-600">Jobs Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">98.5%</div>
                <p className="text-gray-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}