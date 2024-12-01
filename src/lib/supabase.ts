import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export const getTimeCapsules = async (profileId: string) => {
  const now = new Date().toISOString()
  
  // Delete expired capsules first
  await supabase
    .from('time_capsules')
    .delete()
    .eq('profile_id', profileId)
    .not('auto_delete_date', 'is', null)
    .lt('auto_delete_date', now)

  // Get remaining capsules
  const { data, error } = await supabase
    .from('time_capsules')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getViewableCapsules = async (profileId: string) => {
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('time_capsules')
    .select('*')
    .eq('profile_id', profileId)
    .lte('unlock_date', now)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getLockedCapsules = async (profileId: string) => {
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('time_capsules')
    .select('*')
    .eq('profile_id', profileId)
    .gt('unlock_date', now)
    .order('unlock_date', { ascending: true })

  if (error) throw error
  return data
}

export const createTimeCapsule = async (capsule: Database['public']['Tables']['time_capsules']['Insert']) => {
  const { data, error } = await supabase
    .from('time_capsules')
    .insert({
      ...capsule,
      is_locked: true,
      is_viewed: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateTimeCapsule = async (
  id: string,
  updates: Database['public']['Tables']['time_capsules']['Update']
) => {
  const { data, error } = await supabase
    .from('time_capsules')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const viewCapsule = async (id: string) => {
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('time_capsules')
    .update({
      is_viewed: true,
      is_locked: false
    })
    .eq('id', id)
    .lte('unlock_date', now)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteTimeCapsule = async (id: string) => {
  const { error } = await supabase
    .from('time_capsules')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const addComment = async (capsuleId: string, comment: {
  content: string
  created_by: string
}) => {
  const { data: capsule, error: fetchError } = await supabase
    .from('time_capsules')
    .select('comments')
    .eq('id', capsuleId)
    .single()

  if (fetchError) throw fetchError

  const newComment = {
    id: crypto.randomUUID(),
    content: comment.content,
    created_at: new Date().toISOString(),
    created_by: comment.created_by
  }

  const updatedComments = [...(capsule.comments || []), newComment]

  const { data, error } = await supabase
    .from('time_capsules')
    .update({ comments: updatedComments })
    .eq('id', capsuleId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const addReaction = async (capsuleId: string, reactionType: string) => {
  const { data: capsule, error: fetchError } = await supabase
    .from('time_capsules')
    .select('reactions')
    .eq('id', capsuleId)
    .single()

  if (fetchError) throw fetchError

  const existingReactionIndex = capsule.reactions?.findIndex(r => r.type === reactionType) ?? -1
  let updatedReactions = [...(capsule.reactions || [])]

  if (existingReactionIndex >= 0) {
    updatedReactions[existingReactionIndex] = {
      ...updatedReactions[existingReactionIndex],
      count: updatedReactions[existingReactionIndex].count + 1
    }
  } else {
    updatedReactions.push({ type: reactionType, count: 1 })
  }

  const { data, error } = await supabase
    .from('time_capsules')
    .update({ reactions: updatedReactions })
    .eq('id', capsuleId)
    .select()
    .single()

  if (error) throw error
  return data
}
