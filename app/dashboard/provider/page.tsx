'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Clock, 
  CheckCircle, 
  Star,
  TrendingUp,
  DollarSign,
  MapPin,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export default function ProviderDashboard() {
  const { role } = useParams()
  const [userName, setUserName] = useState<string | null>(null)
  const [stats, setStats] = useState({
    activeApplications: 0,
    completedJobs: 0,
    totalEarnings: 0,
    rating: 0,
    profileViews: 0,
  })
  const [availableJobs, setAvailableJobs] = useState<any[]>([])
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
        const { data: applicationsData } = await supabase
          .from('job_applications')
          .select('*', { count: 'exact' })
          .eq('userId', user.id)
          .eq('status', 'PENDING')
        const { data: completedJobsData } = await supabase
          .from('job_applications')
          .select('job:jobs(budget)', { count: 'exact' })
          .eq('userId', user.id)
          .eq('status', 'ACCEPTED')
        if (applicationsData && completedJobsData) {
          const activeApplications = applicationsData.length
          const completedJobs = completedJobsData.filter((app: any) => app.job?.status === 'COMPLETED').length
          const totalEarnings = completedJobsData.reduce((sum: number, app: any) => sum + (app.job?.budget || 0), 0)
          setStats({
            activeApplications,
            completedJobs,
            totalEarnings,
            rating: 4.8, // Placeholder; fetch from ratings table later
            profileViews: 0, // Placeholder; track via analytics or a views table
          })
        }

        // Fetch available jobs (simplified; adjust query based on recommendations logic)
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select(`
            *,
            createdBy:users(firstName, lastName, rating)
          `)
          .neq('createdById', user.id) // Exclude own jobs
          .order('createdAt', { ascending: false })
          .limit(5)
        if (jobsError) console.error('Jobs fetch error:', jobsError)
        else {
          setAvailableJobs(jobsData.map((job: any) => ({
            id: job.id,
            title: job.title,
            category: job.category,
            budget: job.budget,
            location: `${job.country}, ${job.city || ''}`,
            urgency: job.urgency,
            postedAt: job.createdAt.split('T')[0],
            client: {
              name: `${job.createdBy.firstName} ${job.createdBy.lastName || ''}`,
              rating: job.createdBy.rating || 0,
            },
          })))
        }
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
            <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-gray-600 mt-1">Discover opportunities and grow your network</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/dashboard/provider/jobs">
                <Search className="mr-2 h-4 w-4" /> Browse Jobs
              </Link>
            </Button>
            <Button asChild className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white">
              <Link href="/dashboard/provider/profile">
                Complete Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Active Applications</CardTitle>
              <Clock className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{stats.activeApplications}</div>
              <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
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
              <CardTitle className="text-md font-semibold">Total Earnings</CardTitle>
              <DollarSign className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">₦{stats.totalEarnings.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">From completed work</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Your Rating</CardTitle>
              <Star className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{stats.rating}/5</div>
              <p className="text-sm text-gray-500 mt-1">From clients</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Profile Views</CardTitle>
              <TrendingUp className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{stats.profileViews}</div>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Jobs */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Recommended Jobs</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/provider/jobs">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableJobs.length > 0 ? (
                availableJobs.map((job: any) => (
                  <div key={job.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-blue-600 font-medium">{job.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₦{job.budget.toLocaleString()}</div>
                        <Badge variant={job.urgency === 'HIGH' ? 'destructive' : 'secondary'} className="text-sm">
                          {job.urgency}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Posted {job.postedAt}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Client: {job.client.rating}/5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Posted by: <span className="font-medium">{job.client.name}</span>
                      </span>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          <Link href={`/dashboard/provider/jobs/${job.id}`}>View Details</Link>
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No recommended jobs found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Add skills and verification to unlock more opportunities</p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="/dashboard/provider/profile">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Browse More Jobs</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Explore thousands of job opportunities</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/provider/jobs">Browse Jobs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Track Applications</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Monitor your application statuses</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/provider/applications">View Applications</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}