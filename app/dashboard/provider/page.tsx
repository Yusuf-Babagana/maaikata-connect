'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
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
  Calendar,
  Plus,
  Edit,
  Trash
} from 'lucide-react'
import Link from 'next/link'

export default function ProviderDashboard({ params }: { params: { role: string } }) {
  const { role } = params
  const [userName, setUserName] = useState<string | null>(null)
  const [stats, setStats] = useState({
    activeApplications: 0,
    completedJobs: 0,
    totalEarnings: 0,
    rating: 0,
    profileViews: 0,
  })
  const [availableJobs, setAvailableJobs] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newService, setNewService] = useState({ title: '', description: '', rate: 0, availability: 'FULL_TIME' })

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || user.user_metadata?.role !== 'PROVIDER') {
        console.error('Auth error or unauthorized:', authError?.message);
        setLoading(false);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const authToken = session.session?.access_token;

      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('firstName, lastName')
        .eq('id', user.id)
        .single();
      if (userError) console.error('User fetch error:', userError);
      else setUserName(`${userData.firstName} ${userData.lastName || ''}`);

      // Fetch stats
      const statsRes = await fetch('/api/provider/stats', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const statsData = await statsRes.json();
      setStats(statsData || stats);

      // Fetch available jobs
      const jobsRes = await fetch('/api/jobs?country=Nigeria', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const jobsData = await jobsRes.json();
      setAvailableJobs(jobsData.map((job: any) => ({
        id: job.id,
        title: job.title,
        category: job.category,
        budget: job.budget,
        location: `${job.country}, ${job.city || ''}`,
        urgency: job.urgency,
        postedAt: job.createdAt.split('T')[0],
        client: {
          name: `${job.creator.firstName} ${job.creator.lastName || ''}`,
          rating: job.creator.rating || 0,
        },
      })));

      // Fetch services
      const servicesRes = await fetch('/api/provider/services', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const servicesData = await servicesRes.json();
      setServices(servicesData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    const authToken = session.session?.access_token;

    const res = await fetch('/api/provider/services', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(newService),
    });
    const data = await res.json();
    if (data.service) setServices([...services, data.service]);
    setNewService({ title: '', description: '', rate: 0, availability: 'FULL_TIME' });
  };

  const handleUpdateService = async (id: string, updates: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    const authToken = session.session?.access_token;

    const res = await fetch('/api/provider/services', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ id, ...updates }),
    });
    const data = await res.json();
    if (data.service) setServices(services.map(s => s.id === id ? data.service : s));
  };

  const handleDeleteService = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    const authToken = session.session?.access_token;

    await fetch('/api/provider/services', {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ id }),
    });
    setServices(services.filter(s => s.id !== id));
  };

  const handleApplyJob = async (jobId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    const authToken = session.session?.access_token;

    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ message: 'Interested', proposedRate: stats.totalEarnings / stats.completedJobs || 0 }),
    });
    const data = await res.json();
    console.log('Application status:', data);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <DashboardLayout userRole={role} userName={userName || 'User'}>
      <div className="p-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-gray-600 mt-1">Grow your career with S.Mahi Global</p>
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

        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">My Services</CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddService}>
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.length > 0 ? (
                services.map((service: any) => (
                  <div key={service.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₦{service.rate.toLocaleString()}</div>
                        <Badge variant="secondary" className="text-sm">
                          {service.availability}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateService(service.id, { title: prompt('New Title', service.title) || service.title })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No services added yet.</p>
              )}
              {newService && (
                <form onSubmit={handleAddService} className="mt-4 space-y-2">
                  <input
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    placeholder="Service Title"
                    className="border p-2 w-full"
                    required
                  />
                  <input
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Description"
                    className="border p-2 w-full"
                    required
                  />
                  <input
                    type="number"
                    value={newService.rate}
                    onChange={(e) => setNewService({ ...newService, rate: parseFloat(e.target.value) || 0 })}
                    placeholder="Rate (NGN)"
                    className="border p-2 w-full"
                    required
                  />
                  <select
                    value={newService.availability}
                    onChange={(e) => setNewService({ ...newService, availability: e.target.value })}
                    className="border p-2 w-full"
                    required
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                  </select>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Add Service
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>

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
                        <div className="text-lg font-bold">₦{job.budget?.toLocaleString()}</div>
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
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApplyJob(job.id)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No recommended jobs found.</p>
              )}
            </div>
          </CardContent>
        </Card>

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