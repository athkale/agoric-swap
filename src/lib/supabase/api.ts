import { supabase } from './client';
import { Profile, Credential, TimeCapsule, WalletHistory, Notification } from './types';

// Profile API
export const profileAPI = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
    return data;
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    await this.updateProfile(userId, { avatar_url: publicUrl });
    return publicUrl;
  }
};

// Credential API
export const credentialAPI = {
  async createCredential(credential: Omit<Credential, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('credentials')
      .insert([credential])
      .select()
      .single();
    if (error) throw error;
    return data as Credential;
  },

  async getCredentials(holder: string) {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('holder', holder);
    if (error) throw error;
    return data as Credential[];
  },

  async updateVerificationStatus(
    credentialId: string,
    status: Credential['verification_status']
  ) {
    const { data, error } = await supabase
      .from('credentials')
      .update({
        verification_status: status,
        verification_count: supabase.raw('verification_count + 1'),
        last_verified: new Date().toISOString()
      })
      .eq('id', credentialId);
    if (error) throw error;
    return data;
  },

  async uploadCredentialImage(credentialId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${credentialId}-${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('credentials')
      .upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('credentials')
      .getPublicUrl(fileName);

    await supabase
      .from('credentials')
      .update({ image_url: publicUrl })
      .eq('id', credentialId);

    return publicUrl;
  }
};

// Time Capsule API
export const timeCapsuleAPI = {
  async createTimeCapsule(capsule: Omit<TimeCapsule, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('time_capsules')
      .insert([capsule])
      .select()
      .single();
    if (error) throw error;
    return data as TimeCapsule;
  },

  async getTimeCapsules(userId: string) {
    const { data, error } = await supabase
      .from('time_capsules')
      .select('*')
      .or(`creator_id.eq.${userId},recipients.cs.{${userId}}`);
    if (error) throw error;
    return data as TimeCapsule[];
  },

  async uploadAttachment(capsuleId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${capsuleId}-${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('time_capsules')
      .upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('time_capsules')
      .getPublicUrl(fileName);

    return {
      file_url: publicUrl,
      file_type: file.type,
      file_name: file.name
    };
  }
};

// Wallet History API
export const walletAPI = {
  async addTransaction(transaction: Omit<WalletHistory, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('wallet_history')
      .insert([transaction])
      .select()
      .single();
    if (error) throw error;
    return data as WalletHistory;
  },

  async getTransactions(walletAddress: string) {
    const { data, error } = await supabase
      .from('wallet_history')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as WalletHistory[];
  }
};

// Notification API
export const notificationAPI = {
  async createNotification(notification: Omit<Notification, 'id' | 'created_at' | 'read'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ ...notification, read: false }])
      .select()
      .single();
    if (error) throw error;
    return data as Notification;
  },

  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Notification[];
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    if (error) throw error;
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId);
    if (error) throw error;
  }
};
