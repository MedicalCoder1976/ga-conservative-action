// ============================================================================
// ADMIN API ROUTES - Concerns Management
// Location: src/app/api/admin/concerns/route.ts
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/concerns
// Fetch concerns with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level') || 'local';
    const county = searchParams.get('county');
    const search = searchParams.get('search');
    const trending = searchParams.get('trending');
    const path = request.nextUrl.pathname;

    // Route to different handlers based on path
    if (path.includes('/stats')) {
      return handleStats();
    }
    if (path.includes('/trending')) {
      return handleTrending();
    }

    // Default: Get concerns
    let query = supabase
      .from('voter_concerns')
      .select('*')
      .eq('level', level);

    if (county && county !== 'all') {
      query = query.eq('county', county);
    }

    if (trending === 'true') {
      query = query.eq('is_trending', true);
    }

    if (search) {
      query = query.or(
        `concern_topic.ilike.%${search}%,description.ilike.%${search}%,what_they_say.ilike.%${search}%`
      );
    }

    const { data, error } = await query.order('frequency', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// POST /api/admin/concerns
// Create new concern
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('voter_concerns')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// ============================================================================
// Handler Functions
// ============================================================================

async function handleStats() {
  try {
    const { data, error } = await supabase.from('voter_concerns').select('level, is_trending');

    if (error) throw error;

    const stats = {
      total: data.length,
      local: data.filter((d) => d.level === 'local').length,
      state: data.filter((d) => d.level === 'state').length,
      national: data.filter((d) => d.level === 'national').length,
      trending: data.filter((d) => d.is_trending).length,
      pending_submissions: 0,
    };

    const { count } = await supabase
      .from('concern_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    stats.pending_submissions = count || 0;

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

async function handleTrending() {
  try {
    const { data, error } = await supabase
      .from('voter_concerns')
      .select('*')
      .eq('is_trending', true)
      .order('mention_count', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json(
      data.map((concern) => ({
        id: concern.id,
        topic: concern.concern_topic,
        level: concern.level,
        county: concern.county,
        frequency: concern.frequency,
        mentions: concern.mention_count,
        change: Math.floor(Math.random() * 50) + 10,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
