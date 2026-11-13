// ============================================================================
// ADMIN API ROUTES - Concern Submissions
// Location: src/app/api/admin/concerns/submissions/route.ts
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/admin/concerns/submissions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';

    const { data, error } = await supabase
      .from('concern_submissions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// PATCH /api/admin/concerns/submissions
// Approve or reject submissions
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, status, linkedConcernId } = body;

    if (status === 'approved') {
      // Update submission status and link to concern
      const { error: updateError } = await supabase
        .from('concern_submissions')
        .update({ status: 'approved', linked_concern_id: linkedConcernId })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // Increment mention_count for the linked concern
      const { data: concern, error: fetchError } = await supabase
        .from('voter_concerns')
        .select('mention_count')
        .eq('id', linkedConcernId)
        .single();

      if (fetchError) throw fetchError;

      const newMentionCount = (concern?.mention_count || 0) + 1;

      const { error: updateConcernError } = await supabase
        .from('voter_concerns')
        .update({ mention_count: newMentionCount })
        .eq('id', linkedConcernId);

      if (updateConcernError) throw updateConcernError;

      return NextResponse.json({ message: 'Submission approved and linked' });
    } else if (status === 'rejected') {
      const { error } = await supabase
        .from('concern_submissions')
        .update({ status: 'rejected' })
        .eq('id', submissionId);

      if (error) throw error;

      return NextResponse.json({ message: 'Submission rejected' });
    }

    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

