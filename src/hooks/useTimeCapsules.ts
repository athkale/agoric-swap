import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Database } from '../types/supabase'
import {
  getTimeCapsules,
  getViewableCapsules,
  getLockedCapsules,
  createTimeCapsule,
  updateTimeCapsule,
  deleteTimeCapsule,
  viewCapsule,
  addComment,
  addReaction
} from '../lib/supabase'

type TimeCapsule = Database['public']['Tables']['time_capsules']['Row']
type NewTimeCapsule = Omit<Database['public']['Tables']['time_capsules']['Insert'], 'profile_id'>
type TimeCapsuleUpdate = Database['public']['Tables']['time_capsules']['Update']

export const useTimeCapsules = () => {
  const { address } = useAccount()
  const [allCapsules, setAllCapsules] = useState<TimeCapsule[]>([])
  const [viewableCapsules, setViewableCapsules] = useState<TimeCapsule[]>([])
  const [lockedCapsules, setLockedCapsules] = useState<TimeCapsule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (address) {
      fetchAllCapsules()
    }
  }, [address])

  const fetchAllCapsules = async () => {
    try {
      setLoading(true)
      const [all, viewable, locked] = await Promise.all([
        getTimeCapsules(address!),
        getViewableCapsules(address!),
        getLockedCapsules(address!)
      ])
      setAllCapsules(all)
      setViewableCapsules(viewable)
      setLockedCapsules(locked)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const create = async (capsule: NewTimeCapsule) => {
    try {
      setLoading(true)
      const newCapsule = await createTimeCapsule({
        ...capsule,
        profile_id: address!
      })
      await fetchAllCapsules()
      return newCapsule
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const update = async (id: string, updates: TimeCapsuleUpdate) => {
    try {
      setLoading(true)
      const updatedCapsule = await updateTimeCapsule(id, updates)
      await fetchAllCapsules()
      return updatedCapsule
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string) => {
    try {
      setLoading(true)
      await deleteTimeCapsule(id)
      await fetchAllCapsules()
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const view = async (id: string) => {
    try {
      setLoading(true)
      const updatedCapsule = await viewCapsule(id)
      await fetchAllCapsules()
      return updatedCapsule
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const comment = async (capsuleId: string, content: string) => {
    try {
      setLoading(true)
      const updatedCapsule = await addComment(capsuleId, {
        content,
        created_by: address!
      })
      await fetchAllCapsules()
      return updatedCapsule
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const react = async (capsuleId: string, reactionType: string) => {
    try {
      setLoading(true)
      const updatedCapsule = await addReaction(capsuleId, reactionType)
      await fetchAllCapsules()
      return updatedCapsule
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    allCapsules,
    viewableCapsules,
    lockedCapsules,
    loading,
    error,
    create,
    update,
    remove,
    view,
    comment,
    react,
    refresh: fetchAllCapsules
  }
}
