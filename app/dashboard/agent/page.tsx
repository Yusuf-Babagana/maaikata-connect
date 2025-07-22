'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield,
  Users,
  TrendingUp,
  MessageSquare,
  FileText
} from 'lucide-react'
import Link from 'next/link'

export default function AgentDashboard() {
  const { role } = useParams()
  const [userName, setUserName] = useState<string | null>(null)
  const [stats, setStats] = useState({
    pendingComplaints: 0,
    resolvedComplaints: 0,
    usersVerified: 0,
    caseloadRating: 0,
  })
  const [recentComplaints, setRecentComplaints] = useState<any[]>([])
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'AGENT') {
        setLoading(false);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const authToken = session.session?.access_token;

      // Fetch user details
      const userRes = await fetch('/api/agent/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const userData = await userRes.json();
      if (userData) setUserName(`${userData.firstName} ${userData.lastName || ''}`);

      // Fetch stats
      const statsRes = await fetch('/api/agent/stats', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const statsData = await statsRes.json();
      if (statsData) setStats(statsData);

      // Fetch recent complaints
      const complaintsRes = await fetch('/api/agent/complaints/recent', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const complaintsData = await complaintsRes.json();
      if (complaintsData) setRecentComplaints(complaintsData);

      // Fetch pending verifications
      const verificationsRes = await fetch('/api/agent/verifications/pending', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const verificationsData = await verificationsRes.json();
      if (verificationsData) setPendingVerifications(verificationsData);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <DashboardLayout userRole={role as string} userName={userName || 'User'}>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and manage verifications and complaints</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            <Button asChild className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white">
              <Link href="/dashboard/agent/complaints">
                <MessageSquare className="mr-2 h-4 w-4" /> View Complaints
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full md:w-auto">
              <Link href="/dashboard/agent/verifications">
                <Shield className="mr-2 h-4 w-4" /> Verifications
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Pending Complaints</CardTitle>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.pendingComplaints}</div>
              <p className="text-sm text-gray-500 mt-1">Require attention</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Resolved Cases</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.resolvedComplaints}</div>
              <p className="text-sm text-gray-500 mt-1">Successfully closed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Users Verified</CardTitle>
              <Shield className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.usersVerified}</div>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-semibold">Performance Rating</CardTitle>
              <TrendingUp className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{stats.caseloadRating}/5</div>
              <p className="text-sm text-gray-500 mt-1">User feedback</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Complaints */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Recent Complaints</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/agent/complaints">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentComplaints.length > 0 ? (
                recentComplaints.map((complaint: any) => (
                  <div key={complaint.id} className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-lg">{complaint.title}</h3>
                        <Badge variant={complaint.priority === 'URGENT' ? 'destructive' : 'secondary'} className="text-sm">
                          {complaint.priority}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Reported by: {complaint.user} • Category: {complaint.category} • {complaint.createdAt}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-4">
                      <Link href={`/dashboard/agent/complaints/${complaint.id}`}>Investigate</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No recent complaints found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Verifications */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Pending Verifications</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/agent/verifications">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.length > 0 ? (
                pendingVerifications.map((verification: any) => (
                  <div key={verification.id} className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-lg">{verification.user}</h3>
                        <Badge variant="secondary" className="text-sm">
                          {verification.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Submitted: {verification.submittedAt} • Documents: {verification.documents}
                      </div>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Link href={`/dashboard/agent/verifications/${verification.id}`}>Review</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No pending verifications found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Handle Complaints</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Review and resolve user disputes</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link href="/dashboard/agent/complaints">
                  <MessageSquare className="mr-2 h-4 w-4" /> Manage Complaints
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">User Verifications</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Verify user credentials</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/agent/verifications">
                  <Shield className="mr-2 h-4 w-4" /> Process Verifications
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Generate Reports</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Create investigation reports</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/agent/reports">
                  <FileText className="mr-2 h-4 w-4" /> Create Report
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}