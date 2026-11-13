// ============================================================================
// ADMIN CONCERNS DASHBOARD - Main Overview
// Location: src/components/admin/ConcernsAdminDashboard.tsx
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertCircle, Users, FileText, Activity } from 'lucide-react';

interface ConcernStats {
  total: number;
  local: number;
  state: number;
  national: number;
  trending: number;
  pending_submissions: number;
}

interface TrendingConcern {
  id: string;
  topic: string;
  level: 'local' | 'state' | 'national';
  county?: string;
  frequency: number;
  mentions: number;
  change: number;
}

export default function ConcernsAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<ConcernStats>({
    total: 0,
    local: 0,
    state: 0,
    national: 0,
    trending: 0,
    pending_submissions: 0,
  });
  const [trending, setTrending] = useState<TrendingConcern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, trendingRes] = await Promise.all([
        fetch('/api/admin/concerns/stats'),
        fetch('/api/admin/concerns/trending'),
      ]);

      const statsData = await statsRes.json();
      const trendingData = await trendingRes.json();

      setStats(statsData);
      setTrending(trendingData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎛️ Concerns Management</h1>
          <p className="text-gray-600">Monitor voter concerns across local, state, and national levels</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Concerns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-600 mt-1">Across all levels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Local Concerns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.local}</div>
              <p className="text-xs text-gray-600 mt-1">County-specific</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">State Concerns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.state}</div>
              <p className="text-xs text-gray-600 mt-1">Georgia-wide</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">National Concerns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.national}</div>
              <p className="text-xs text-gray-600 mt-1">U.S.-wide</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-600" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.trending}</div>
              <p className="text-xs text-gray-600 mt-1">Increasing in mentions</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.pending_submissions}</div>
              <p className="text-xs text-gray-600 mt-1">Volunteer submissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="local">📍 Local</TabsTrigger>
            <TabsTrigger value="state">🏛️ State</TabsTrigger>
            <TabsTrigger value="national">🇺🇸 National</TabsTrigger>
            <TabsTrigger value="submissions">📋 Submissions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Trending Concerns (Last 7 Days)</CardTitle>
                <CardDescription>Most mentioned concerns showing upward momentum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trending.length === 0 ? (
                    <p className="text-gray-500">No trending concerns yet</p>
                  ) : (
                    trending.map((concern, index) => (
                      <div key={concern.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-lg font-bold text-gray-600 w-8">{index + 1}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{concern.topic}</div>
                            <div className="text-sm text-gray-600">
                              {concern.level === 'local' && `📍 ${concern.county}`}
                              {concern.level === 'state' && '🏛️ Statewide'}
                              {concern.level === 'national' && '🇺🇸 National'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">↑ {concern.change}%</div>
                          <div className="text-sm text-gray-600">{concern.mentions} mentions</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full" size="lg" onClick={() => setActiveTab('local')}>
                    📍 Manage Local Concerns
                  </Button>
                  <Button className="w-full" size="lg" onClick={() => setActiveTab('submissions')}>
                    📋 Review Submissions
                  </Button>
                  <Button className="w-full" size="lg" variant="outline">
                    🤖 Data Sources
                  </Button>
                  <Button className="w-full" size="lg" variant="outline">
                    📊 View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Local Tab */}
          <TabsContent value="local">
            <ConcernsManager level="local" />
          </TabsContent>

          {/* State Tab */}
          <TabsContent value="state">
            <ConcernsManager level="state" />
          </TabsContent>

          {/* National Tab */}
          <TabsContent value="national">
            <ConcernsManager level="national" />
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <SubmissionsReviewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============================================================================
// CONCERNS MANAGER COMPONENT
// ============================================================================

function ConcernsManager({ level }: { level: 'local' | 'state' | 'national' }) {
  const [concerns, setConcerns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);

  useEffect(() => {
    fetchConcerns();
  }, [level, selectedCounty, searchTerm, showTrendingOnly]);

  const fetchConcerns = async () => {
    try {
      const params = new URLSearchParams({
        level,
        ...(selectedCounty !== 'all' && { county: selectedCounty }),
        ...(searchTerm && { search: searchTerm }),
        ...(showTrendingOnly && { trending: 'true' }),
      });

      const res = await fetch(`/api/admin/concerns?${params}`);
      const data = await res.json();
      setConcerns(data);
    } catch (error) {
      console.error('Error fetching concerns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {level === 'local' ? '📍 Local Concerns' : level === 'state' ? '🏛️ State Concerns' : '🇺🇸 National Concerns'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search concerns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          {level === 'local' && (
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Counties</option>
              <option value="Fulton">Fulton</option>
              <option value="Gwinnett">Gwinnett</option>
              <option value="Cobb">Cobb</option>
              <option value="DeKalb">DeKalb</option>
            </select>
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showTrendingOnly}
              onChange={(e) => setShowTrendingOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Trending Only</span>
          </label>
          <Button>+ Add New</Button>
        </div>

        {/* Concerns List */}
        <div className="space-y-3">
          {concerns.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No concerns found</p>
          ) : (
            concerns.map((concern) => (
              <div key={concern.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{concern.concern_topic}</div>
                    <div className="text-sm text-gray-600 mt-1">{concern.description}</div>
                    <div className="flex gap-4 mt-3 text-xs text-gray-600">
                      <span>📊 Frequency: {concern.frequency}/10</span>
                      <span>💬 Mentions: {concern.mention_count}</span>
                      {concern.is_trending && <span className="text-red-600 font-semibold">🔥 TRENDING</span>}
                      {concern.mentions_trend === 'trending_up' && <span>↑ Rising</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Delete</Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SUBMISSIONS REVIEWER COMPONENT
// ============================================================================

function SubmissionsReviewer() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/concerns/submissions?status=pending');
      const data = await res.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    try {
      await fetch(`/api/admin/concerns/submissions/${submissionId}/approve`, {
        method: 'POST',
      });
      fetchSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const handleReject = async (submissionId: string) => {
    try {
      await fetch(`/api/admin/concerns/submissions/${submissionId}/reject`, {
        method: 'POST',
      });
      fetchSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Review Volunteer Submissions</CardTitle>
        <CardDescription>{submissions.length} pending review</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">All submissions reviewed!</p>
          ) : (
            submissions.map((submission) => (
              <div key={submission.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{submission.concern_topic}</div>
                    <div className="text-sm text-gray-600">{submission.county} County</div>
                  </div>
                  <div className="text-xs text-gray-500">{new Date(submission.created_at).toLocaleDateString()}</div>
                </div>

                <div className="bg-gray-50 p-3 rounded mb-4">
                  <p className="text-sm text-gray-900 italic">"{submission.what_voter_said}"</p>
                  {submission.voter_demographic && (
                    <p className="text-xs text-gray-600 mt-2">👥 {submission.voter_demographic}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(submission.id)} className="bg-green-600 hover:bg-green-700">
                    ✅ Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(submission.id)}>
                    ❌ Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    💬 Add Note
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
