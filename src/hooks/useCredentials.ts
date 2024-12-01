import { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { supabase } from '../lib/supabase/client';
import type { Credential } from '../lib/supabase/types';
import { ethers } from 'ethers';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';

export function useCredentials() {
  const { profile } = useSupabase();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function createCredential(data: {
    title: string;
    description: string;
    image?: File;
    metadata: Record<string, any>;
    expiryDate?: string;
  }) {
    if (!profile?.id || !address) throw new Error('No profile or wallet connected');

    try {
      setLoading(true);
      setError(null);

      // Upload image if provided
      let imageUrl = '';
      if (data.image) {
        const fileExt = data.image.name.split('.').pop();
        const fileName = `${profile.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('credentials')
          .upload(fileName, data.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('credentials')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Create message to sign
      const message = JSON.stringify({
        title: data.title,
        description: data.description,
        metadata: data.metadata,
        issuer: address,
        chainId: chain?.id,
        timestamp: new Date().toISOString()
      });

      // Sign message
      const signature = await signMessageAsync({ message });

      // Create credential record
      const credential: Partial<Credential> = {
        id: crypto.randomUUID(),
        profile_id: profile.id,
        title: data.title,
        description: data.description,
        image_url: imageUrl,
        metadata: data.metadata,
        signature,
        message,
        issuer: address,
        chain_id: chain?.id,
        expiry_date: data.expiryDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdCredential, error } = await supabase
        .from('credentials')
        .insert([credential])
        .select()
        .single();

      if (error) throw error;
      return createdCredential as Credential;
    } catch (err) {
      console.error('Error creating credential:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function verifyCredential(credential: Credential): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);

      // Verify signature
      const recoveredAddress = ethers.verifyMessage(
        credential.message,
        credential.signature
      );

      // Check if recovered address matches issuer
      const isValid = recoveredAddress.toLowerCase() === credential.issuer.toLowerCase();

      // Check expiry
      if (credential.expiry_date) {
        const isExpired = new Date(credential.expiry_date) < new Date();
        if (isExpired) return false;
      }

      return isValid;
    } catch (err) {
      console.error('Error verifying credential:', err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function getCredentials() {
    if (!profile?.id) return [];

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Credential[];
    } catch (err) {
      console.error('Error fetching credentials:', err);
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function deleteCredential(id: string) {
    if (!profile?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', id)
        .eq('profile_id', profile.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting credential:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    createCredential,
    verifyCredential,
    getCredentials,
    deleteCredential,
    loading,
    error
  };
}
