export interface Profile {
  id: string;
  wallet_address: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  email?: string;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  preferences?: {
    theme?: string;
    notifications?: boolean;
  };
  updated_at: string;
  created_at: string;
}

export interface Credential {
  id: string;
  issuer: string;
  holder: string;
  type: string;
  title: string;
  description?: string;
  data?: any;
  image_url?: string;
  expiry_date: string;
  issuance_date: string;
  category?: string;
  tags?: string[];
  signature: string;
  chain_id: number;
  verification_status: 'unverified' | 'verified' | 'expired' | 'invalid';
  verification_count: number;
  last_verified?: string;
  metadata?: {
    issuer_name?: string;
    issuer_logo?: string;
    credential_schema?: string;
  };
  created_at: string;
}

export interface TimeCapsule {
  id: string;
  creator_id: string;
  title: string;
  content?: string;
  unlock_date: string;
  is_unlocked: boolean;
  recipients: string[];
  attachments?: {
    file_url: string;
    file_type: string;
    file_name: string;
  }[];
  metadata?: {
    encryption_type?: string;
    access_conditions?: any;
  };
  created_at: string;
}

export interface WalletHistory {
  id: string;
  wallet_address: string;
  transaction_type: 'send' | 'receive' | 'stake' | 'unstake' | 'swap';
  amount: number;
  token_address?: string;
  token_symbol?: string;
  chain_id: number;
  transaction_hash: string;
  status: 'pending' | 'completed' | 'failed';
  gas_fee?: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'credential' | 'timecapsule' | 'wallet' | 'system';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}
