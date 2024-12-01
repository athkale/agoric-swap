import { create } from 'zustand';
import { DID, Credential } from '../types/did';

interface AuthState {
  isAuthenticated: boolean;
  address: string | null;
  did: DID | null;
  credentials: Credential[];
  setAuth: (address: string) => void;
  clearAuth: () => void;
  setDID: (did: DID) => void;
  addCredential: (credential: Credential) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  address: null,
  did: null,
  credentials: [],
  setAuth: (address) => set({ isAuthenticated: true, address }),
  clearAuth: () => set({ isAuthenticated: false, address: null, did: null, credentials: [] }),
  setDID: (did) => set({ did }),
  addCredential: (credential) => 
    set((state) => ({ 
      credentials: [...state.credentials, credential] 
    })),
}));