'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AddJobPage() {
  const [job, setJob] = useState({
    title: '',
    category: '',
    budget: 0,
    country: 'Nigeria',
    city: '',
    urgency: 'NORMAL',
    description: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    const authToken = session.session?.access_token;

    const res = await fetch('/api/agent/jobs', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ ...job, agentId: user.id }),
    });
    const data = await res.json();
    console.log('Job creation status:', data);
    setLoading(false);
  };

  return (
    <DashboardLayout userRole="AGENT" userName="User">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Add New Job</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/agent">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-gray-600">Create a new job listing for S.Mahi Global.</p>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              value={job.category}
              onChange={(e) => setJob({ ...job, category: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget (NGN)</label>
            <input
              type="number"
              value={job.budget}
              onChange={(e) => setJob({ ...job, budget: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              value={job.city}
              onChange={(e) => setJob({ ...job, city: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Urgency</label>
            <select
              value={job.urgency}
              onChange={(e) => setJob({ ...job, urgency: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={job.description}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
            {loading ? 'Adding...' : 'Add Job'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}