'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface VoterConcern {
  id: string;
  level: 'local' | 'state' | 'national';
  county?: string;
  concern_topic: string;
  description: string;
  what_they_say: string;
  frequency: number;
  is_trending: boolean;
  mention_count: number;
  created_at: string;
  updated_at: string;
}

interface ConcernSubmission {
  id: string;
  user_id: string;
  county: string;
  concern_topic: string;
  what_voter_said: string;
  status: 'pending' | 'approved' | 'rejected' | 'merged';
  created_at: string;
  linked_concern_id?: string;
}

export function ConcernsAdminDashboard() {
  const [concerns, setConcerns] = useState<VoterConcern[]>([]);
  const [submissions, setSubmissions] = useState<ConcernSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'local' | 'state' | 'national'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchConcerns();
    fetchSubmissions();
  }, []);

  const fetchConcerns = async () => {
    try {
      const response = await fetch('/api/admin/concerns');
      if (!response.ok) throw new Error('Failed to fetch concerns');
      const data = await response.json();
      setConcerns(data);
    } catch (error) {
      console.error('Error fetching concerns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/concerns/submissions');
      if (!response.ok) throw new Error('Failed to fetch submissions');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const approveSubmission = async (submissionId: string, concernId: string) => {
    try {
      const response = await fetch('/api/admin/concerns/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          status: 'approved',
          linkedConcernId: concernId,
        }),
      });
      if (!response.ok) throw new Error('Failed to approve submission');
      fetchSubmissions();
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const rejectSubmission = async (submissionId: string) => {
    try {
      const response = await fetch('/api/admin/concerns/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          status: 'rejected',
        }),
      });
      if (!response.ok) throw new Error('Failed to reject submission');
      fetchSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  const filteredConcerns = concerns.filter((concern) => {
    const levelMatch = selectedLevel === 'all' || concern.level === selectedLevel;
    const countyMatch = selectedCounty === 'all' || concern.county === selectedCounty;
    const searchMatch =
      concern.concern_topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concern.description.toLowerCase().includes(searchTerm.toLowerCase());
    return levelMatch && countyMatch && searchMatch;
  });

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const trendingConcerns = concerns.filter((c) => c.is_trending);
  const nationalConcerns = concerns.filter((c) => c.level === 'national');
  const stateConcerns = concerns.filter((c) => c.level === 'state');
  const localConcerns = concerns.filter((c) => c.level === 'local');

  if (loading) {
    return <div className="p-6">Loading concerns...</div>;
  }

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Voter Concerns Admin</h1>
          <p className="text-gray-600">Manage multi-level voter concerns and submissions</p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Concerns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{concerns.length}</div>
            <p className="text-xs text-gray-500">across all levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              Trending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trendingConcerns.length}</div>
            <p className="text-xs text-gray-500">actively trending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
            <p className="text-xs text-gray-500">awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Counties Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(localConcerns.map((c) => c.county)).size}
            </div>
            <p className="text-xs text-gray-500">local areas tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="national">National</TabsTrigger>
          <TabsTrigger value="submissions">Submissions ({pendingSubmissions.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trending Concerns</CardTitle>
              <CardDescription>Concerns currently trending up with increased mentions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingConcerns.length === 0 ? (
                  <p className="text-gray-500">No trending concerns at this time</p>
                ) : (
                  trendingConcerns.map((concern) => (
                    <div key={concern.id} className="border-b pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{concern.concern_topic}</p>
                          <p className="text-sm text-gray-600">{concern.what_they_say}</p>
                          <div className="mt-2 flex gap-2">
                            <span className="inline-block rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                              {concern.level}
                            </span>
                            {concern.county && (
                              <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                {concern.county}
                              </span>
                            )}
                            <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                              {concern.mention_count} mentions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Local Tab */}
        <TabsContent value="local" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Local Concerns</CardTitle>
              <CardDescription>County-level voter concerns and issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search local concerns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counties</SelectItem>
                    {Array.from(new Set(localConcerns.map((c) => c.county))).map((county) => (
                      <SelectItem key={county} value={county || ''}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {localConcerns
                  .filter((c) => (selectedCounty === 'all' ? true : c.county === selectedCounty))
                  .map((concern) => (
                    <div key={concern.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{concern.concern_topic}</p>
                          <p className="text-sm text-gray-600 mt-1">{concern.what_they_say}</p>
                          <div className="mt-2 flex gap-2 flex-wrap">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {concern.county}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              Freq: {concern.frequency}/10
                            </span>
                            {concern.is_trending && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Trending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* State Tab */}
        <TabsContent value="state" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Georgia State Concerns</CardTitle>
              <CardDescription>Statewide voter issues and priorities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stateConcerns.map((concern) => (
                <div key={concern.id} className="border rounded-lg p-4">
                  <p className="font-semibold">{concern.concern_topic}</p>
                  <p className="text-sm text-gray-600 mt-1">{concern.what_they_say}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Freq: {concern.frequency}/10
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {concern.mention_count} mentions
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* National Tab */}
        <TabsContent value="national" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>National Concerns</CardTitle>
              <CardDescription>USA-wide voter priorities and issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {nationalConcerns.map((concern) => (
                <div key={concern.id} className="border rounded-lg p-4">
                  <p className="font-semibold">{concern.concern_topic}</p>
                  <p className="text-sm text-gray-600 mt-1">{concern.what_they_say}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      Freq: {concern.frequency}/10
                    </span>
                    {concern.is_trending && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Trending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Submissions</CardTitle>
              <CardDescription>Review and approve voter concern submissions from volunteers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingSubmissions.length === 0 ? (
                <p className="text-gray-500">No pending submissions</p>
              ) : (
                pendingSubmissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <div className="space-y-2">
                      <p className="font-semibold">{submission.concern_topic}</p>
                      <p className="text-sm text-gray-600">"{submission.what_voter_said}"</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {submission.county}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Pending
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Link to Concern
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Link to Existing Concern</DialogTitle>
                            <DialogDescription>
                              Select a concern to link this submission to, or leave empty to create new
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {concerns
                              .filter((c) => c.county === submission.county)
                              .map((concern) => (
                                <Button
                                  key={concern.id}
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => approveSubmission(submission.id, concern.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {concern.concern_topic}
                                </Button>
                              ))}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectSubmission(submission.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
