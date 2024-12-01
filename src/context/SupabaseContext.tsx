import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '../lib/supabase/client';
import type { Profile } from '../lib/supabase/types';

interface SupabaseContextType {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (address) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [address]);

  async function loadProfile() {
    try {
      setLoading(true);
      setError(null);

      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProfile) {
        setProfile(existingProfile as Profile);
      } else if (address) {
        // Create new profile if it doesn't exist
        const newProfile = {
          id: crypto.randomUUID(),
          wallet_address: address,
          username: `user_${address.slice(2, 8)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile as Profile);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!profile?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar(file: File): Promise<string> {
    if (!profile?.id) throw new Error('No profile found');

    try {
      setLoading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await updateProfile({ avatar_url: publicUrl });
      return publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
