'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Star } from 'lucide-react'
import Link from 'next/link'

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const authToken = session.session?.access_token;

      const res = await fetch('/api/jobs?country=Nigeria', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, []);

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
      body: JSON.stringify({ message: 'Interested', proposedRate: 0 }), // Adjust rate logic as needed
    });
    const data = await res.json();
    console.log('Application status:', data);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <DashboardLayout userRole="PROVIDER" userName="User">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/provider">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-gray-600">Explore available jobs with S.Mahi Global.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job: any) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 font-medium mb-2">{job.category}</p>
                  <div className="text-right mb-2">
                    <div className="text-lg font-bold">₦{job.budget?.toLocaleString()}</div>
                    <Badge variant={job.urgency === 'HIGH' ? 'destructive' : 'secondary'} className="text-sm">
                      {job.urgency}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.country}, {job.city || 'N/A'}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Posted {job.createdAt.split('T')[0]}
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Rating: {job.creator.rating || 0}/5
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApplyJob(job.id)}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">No jobs available at the moment.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}