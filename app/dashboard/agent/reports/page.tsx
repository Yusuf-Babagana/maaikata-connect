'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download } from 'lucide-react'
import Link from 'next/link'

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    // Initial load can be empty; report generation triggers on form submit
  }, []);

  const generateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    const authToken = session.session?.access_token;

    const res = await fetch('/api/agent/reports', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ startDate, endDate, statusFilter }),
    });
    const data = await res.json();
    if (data) setReport(data);
    setLoading(false);
  };

  const downloadReport = () => {
    if (report) {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agent-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <DashboardLayout userRole="AGENT" userName="User">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Generate Reports</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/agent">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-gray-600">Create investigation reports for S.Mahi Global.</p>

        {/* Report Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Generate New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="ALL">All</option>
                  <option value="OPEN">Open</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Report Preview */}
        {report && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p><strong>Generated On:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Period:</strong> {startDate} to {endDate}</p>
                <p><strong>Status Filter:</strong> {statusFilter}</p>
                <p><strong>Complaints Count:</strong> {report.complaintsCount || 0}</p>
                <p><strong>Resolved Count:</strong> {report.resolvedCount || 0}</p>
                <Button onClick={downloadReport} className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                  <Download className="mr-2 h-4 w-4" /> Download JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}