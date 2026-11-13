import { createClient } from '@/lib/supabase/client'

export interface ActivityData {
  userId: string
  county: string
  activityType: string
  points: number
  notes?: string
}

export async function uploadActivityPhoto(
  file: File,
  userId: string
): Promise<string> {
  const supabase = createClient()
  if (!supabase) {
    throw new Error('Failed to initialize Supabase client')
  }

  const timestamp = Date.now()
  const filename = `activity-photos/${userId}/${timestamp}.jpg`

  const { data, error } = await supabase.storage
    .from('activity-photos')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Photo upload failed: ${error.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('activity-photos').getPublicUrl(data.path)

  return publicUrl
}

export async function logActivity(
  activity: ActivityData,
  photoUrl?: string
): Promise<string> {
  const supabase = createClient()
  if (!supabase) {
    throw new Error('Failed to initialize Supabase client')
  }

  const { data, error } = await supabase
    .from('activities')
    .insert({
      user_id: activity.userId,
      county: activity.county,
      activity_type: activity.activityType,
      points: activity.points,
      photo_url: photoUrl || null,
      notes: activity.notes || null,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to log activity: ${error.message}`)
  }

  return data.id
}

export async function updateUserPoints(
  userId: string,
  points: number
): Promise<void> {
  const supabase = createClient()
  if (!supabase) {
    throw new Error('Failed to initialize Supabase client')
  }

  const { error } = await supabase.rpc('increment_user_points', {
    user_id: userId,
    points_to_add: points,
  })

  if (error) {
    // Fallback: fetch current points and update
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch user points: ${fetchError.message}`)
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: profile.points + points })
      .eq('id', userId)

    if (updateError) {
      throw new Error(`Failed to update user points: ${updateError.message}`)
    }
  }
}

export async function updateCountyScore(
  county: string,
  points: number
): Promise<void> {
  const supabase = createClient()
  if (!supabase) {
    throw new Error('Failed to initialize Supabase client')
  }

  const { error } = await supabase.rpc('increment_county_score', {
    county_name: county,
    score_to_add: points,
  })

  if (error) {
    // Fallback: fetch current score and update
    const { data: countyData, error: fetchError } = await supabase
      .from('counties')
      .select('activity_score')
      .eq('name', county)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch county score: ${fetchError.message}`)
    }

    const newScore = countyData.activity_score + points
    const newIntensity = calculateColorIntensity(newScore)

    const { error: updateError } = await supabase
      .from('counties')
      .update({
        activity_score: newScore,
        color_intensity: newIntensity,
      })
      .eq('name', county)

    if (updateError) {
      throw new Error(`Failed to update county score: ${updateError.message}`)
    }
  }
}

export function calculateColorIntensity(activityScore: number): number {
  // Convert activity score to 0-255 color value
  // Formula: min(activityScore / 100 * 255, 255)
  const intensity = Math.min((activityScore / 100) * 255, 255)
  return Math.round(intensity)
}
