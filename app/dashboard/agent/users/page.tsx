'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Eye } from 'lucide-react'
import Link from 'next/link'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'AGENT') {
        setLoading(false);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const authToken = session.session?.access_token;

      const res = await fetch(`/api/agent/users?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data) setUsers(data);
      setLoading(false);
    };

    fetchUsers();
  }, [statusFilter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <DashboardLayout userRole="AGENT" userName="User">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/agent">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-gray-600">View and manage users under your supervision.</p>

        {/* Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.length > 0 ? (
            users.map((user: any) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{user.firstName} {user.lastName || ''}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">Email: {user.email}</p>
                  <p className="text-gray-600 mb-2">Role: {user.role || 'User'}</p>
                  <Badge variant={user.status === 'VERIFIED' ? 'default' : user.status === 'REJECTED' ? 'destructive' : 'secondary'} className="mb-2">
                    {user.status}
                  </Badge>
                  <Button variant="outline" size="sm" asChild className="mt-2 w-full">
                    <Link href={`/dashboard/agent/users/${user.id}`}>
                      <Eye className="mr-2 h-4 w-4" /> View Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}