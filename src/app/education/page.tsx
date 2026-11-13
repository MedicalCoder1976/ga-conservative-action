'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EducationTopic } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export default function EducationPage() {
  const [topics, setTopics] = useState<EducationTopic[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('education_topics')
          .select('*')
          .order('category', { ascending: true })
          .order('title', { ascending: true })

        if (fetchError) {
          setError(fetchError.message)
        } else {
          setTopics(data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch topics')
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  const categories = Array.from(new Set(topics.map(t => t.category))).sort()
  const filteredTopics = selectedCategory 
    ? topics.filter(t => t.category === selectedCategory)
    : topics

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-slate-600">Loading education topics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back Home</Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-red-700">Education Center</h1>
          <p className="text-slate-600 mt-2">Learn about conservative policies and principles</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Error loading topics: {error}</p>
            </CardContent>
          </Card>
        )}

        {topics.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600">No education topics available yet.</p>
            </CardContent>
          </Card>
        )}

        {topics.length > 0 && (
          <>
            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  size="sm"
                >
                  All ({topics.length})
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat)}
                    size="sm"
                  >
                    {cat} ({topics.filter(t => t.category === cat).length})
                  </Button>
                ))}
              </div>
            </div>

            {/* Topics Grid */}
            <div className="space-y-3">
              {filteredTopics.map((topic) => (
                <Card
                  key={topic.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => toggleExpanded(topic.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-slate-900">{topic.title}</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">{topic.category}</p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 mt-1 ${
                          expandedId === topic.id ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                  </CardHeader>

                  {expandedId === topic.id && (
                    <CardContent className="pt-0 border-t border-slate-200">
                      <p className="text-slate-700 leading-relaxed mt-4">{topic.content}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {filteredTopics.length === 0 && selectedCategory && (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-slate-600">No topics found in this category.</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}
