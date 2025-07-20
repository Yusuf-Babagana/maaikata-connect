'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  PlusCircle, 
  Search, 
  Clock, 
  CheckCircle, 
  Star,
  TrendingUp,
  Users,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

export default function ClientDashboard() {
  const { role } = useParams()
  const [userName, setUserName] = useState<string | null>(null)
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedJobs: 0,
    totalSpent: 0,
    avgRating: 0,
  })
  const [recentJobs, setRecentJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('firstName, lastName')
          .eq('id', user.id)
          .single()
        if (userError) console.error('User fetch error:', userError)
        else setUserName(`${userData.firstName} ${userData.lastName || ''}`)

        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*', { count: 'exact' })
          .eq('createdById', user.id)
        if (jobsData) {
          const activeJobs = jobsData.filter((job: any) => job.status === 'OPEN' || job.status === 'IN_PROGRESS').length
          const completedJobs = jobsData.filter((job: any) => job.status === 'COMPLETED').length
          const totalSpent = jobsData.reduce((sum: number, job: any) => sum + (job.budget || 0), 0)
          setStats({
            activeJobs,
            completedJobs,
            totalSpent,
            avgRating: 4.8, // Placeholder; fetch actual rating from ratings table if needed
          })
        }

        const { data: recentJobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('createdById', user.id)
          .order('createdAt', { ascending: false })
          .limit(5)
        if (jobsError) console.error('Jobs fetch error:', jobsError)
        else setRecentJobs(recentJobsData || [])
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
            <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your job postings and connect with providers</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/dashboard/client/jobs/search">
                <Search className="mr-2 h-4 w-4" /> Find Services
              </Link>
            </Button>
            <Button asChild className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/dashboard/client/jobs/post">
                <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Active Jobs</CardTitle>
              <Clock className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{stats.activeJobs}</div>
              <p className="text-sm text-gray-500 mt-1">Currently hiring</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Completed Jobs</CardTitle>
              <CheckCircle className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{stats.completedJobs}</div>
              <p className="text-sm text-gray-500 mt-1">Successfully finished</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Total Spent</CardTitle>
              <TrendingUp className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">₦{stats.totalSpent.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">On completed services</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Your Rating</CardTitle>
              <Star className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{stats.avgRating}/5</div>
              <p className="text-sm text-gray-500 mt-1">From providers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-lg">{job.title}</h3>
                        <Badge variant={job.status === 'COMPLETED' ? 'success' : 'secondary'} className="text-sm">
                          {job.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location || `${job.country}, ${job.city || ''}`}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job.applications || 0} Applications
                        </span>
                        <span>Budget: ₦{job.budget?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4">
                      <Link href={`/dashboard/client/jobs/${job.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No recent jobs found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Post a New Job</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Find qualified providers for your next project</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/dashboard/client/jobs/post">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Browse Providers</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Connect with verified professionals</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/client/providers">Browse Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Manage Jobs</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">View and manage your jobs</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/client/jobs">View All Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}