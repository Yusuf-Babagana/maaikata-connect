'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const authToken = session.session?.access_token;

      const res = await fetch('/api/provider/applications', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setApplications(data);
      setLoading(false);
    };

    fetchApplications();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <DashboardLayout userRole="PROVIDER" userName="User">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/provider">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-gray-600">Track your job applications with S.Mahi Global.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.length > 0 ? (
            applications.map((app: any) => (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{app.job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">Status: <Badge variant={app.status === 'ACCEPTED' ? 'default' : app.status === 'REJECTED' ? 'destructive' : 'secondary'}>{app.status}</Badge></p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">Proposed Rate: ₦{app.proposedRate?.toLocaleString()}</p>
                  <p className="text-gray-600 mb-4">Message: {app.message || 'No message provided'}</p>
                  {app.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        <CheckCircle className="h-4 w-4 mr-1" /> Accept
                      </Button>
                      <Button variant="destructive" size="sm" disabled>
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                  {(app.status === 'ACCEPTED' || app.status === 'REJECTED') && (
                    <p className="text-sm text-gray-500">Action completed by client.</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">No applications found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}