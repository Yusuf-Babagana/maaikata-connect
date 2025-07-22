'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface JobForm {
  title: string;
  category: string;
  budget: number;
  country: string;
  city: string;
  urgency: 'NORMAL' | 'HIGH';
  description: string;
}

export default function AddJobPage() {
  const router = useRouter();
  const [job, setJob] = useState<JobForm>({
    title: '',
    category: '',
    budget: 0,
    country: 'Nigeria',
    city: '',
    urgency: 'NORMAL',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get user and session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const { data: session, error: sessionError } = await supabase.auth.getSession();

      if (userError || sessionError || !user || !session?.session) {
        throw new Error('Authentication failed');
      }

      const authToken = session.session.access_token;

      const res = await fetch('/api/agent/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...job, agentId: user.id }),
      });

      if (!res.ok) {
        throw new Error('Failed to create job');
      }

      const data = await res.json();
      console.log('Job created successfully:', data);
      router.push('/dashboard/agent/jobs');
    } catch (err) {
      console.error('Job creation error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
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
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

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
              min="0"
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
              onChange={(e) => setJob({ ...job, urgency: e.target.value as JobForm['urgency'] })}
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
              rows={4}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Job'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}