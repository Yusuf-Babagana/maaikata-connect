'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link' // ✅ Add this

import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    skills: '',
    experience: '',
    hourlyRate: 0,
    availability: 'FULL_TIME',
    bio: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const authToken = session.session?.access_token;

      const res = await fetch('/api/provider/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data) setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        country: data.country || '',
        skills: data.skills || '',
        experience: data.experience || '',
        hourlyRate: data.hourlyRate || 0,
        availability: data.availability || 'FULL_TIME',
        bio: data.bio || '',
      });
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    const authToken = session.session?.access_token;

    const res = await fetch('/api/provider/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    console.log('Profile update status:', data);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <DashboardLayout userRole="PROVIDER" userName="User">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/provider">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-gray-600">Manage your profile details for S.Mahi Global.</p>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              value={profile.country}
              onChange={(e) => setProfile({ ...profile, country: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <input
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
            <input
              type="number"
              value={profile.experience}
              onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hourly Rate (NGN)</label>
            <input
              type="number"
              value={profile.hourlyRate}
              onChange={(e) => setProfile({ ...profile, hourlyRate: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <select
              value={profile.availability}
              onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Save Changes
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}