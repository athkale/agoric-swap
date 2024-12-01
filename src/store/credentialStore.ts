import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CredentialType = 'student' | 'employee' | 'developer' | 'business';

export interface BaseCredential {
  id: string;
  name: string;
  type: CredentialType;
  issueDate: string;
  imageUrl?: string;
  description?: string;
}

export interface StudentCredential extends BaseCredential {
  type: 'student';
  institution: string;
  degree: string;
  graduationYear: string;
  major?: string;
  gpa?: string;
  achievements?: string[];
}

export interface EmployeeCredential extends BaseCredential {
  type: 'employee';
  company: string;
  position: string;
  startDate: string;
  department?: string;
  responsibilities?: string[];
  achievements?: string[];
}

export interface DeveloperCredential extends BaseCredential {
  type: 'developer';
  skills: string[];
  certifications: string[];
  experience: string;
  githubProfile?: string;
  portfolio?: string;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export interface BusinessCredential extends BaseCredential {
  type: 'business';
  companyName: string;
  role: string;
  industry: string;
  businessSize?: string;
  location?: string;
  achievements?: string[];
}

export type Credential = 
  | StudentCredential 
  | EmployeeCredential 
  | DeveloperCredential 
  | BusinessCredential;

interface CredentialStore {
  credentials: Credential[];
  addCredential: (credential: Omit<Credential, 'id' | 'issueDate'>) => void;
  deleteCredential: (id: string) => void;
  getCredentialCount: () => number;
  getRecentCredentials: (count: number) => Credential[];
}

export const useCredentialStore = create<CredentialStore>()(
  persist(
    (set, get) => ({
      credentials: [],
      addCredential: (newCredential) => set((state) => ({
        credentials: [...state.credentials, {
          ...newCredential,
          id: Date.now().toString(),
          issueDate: new Date().toLocaleDateString(),
        }],
      })),
      deleteCredential: (id) => set((state) => ({
        credentials: state.credentials.filter((cred) => cred.id !== id),
      })),
      getCredentialCount: () => get().credentials.length,
      getRecentCredentials: (count) => {
        const { credentials } = get();
        return [...credentials]
          .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
          .slice(0, count);
      },
    }),
    {
      name: 'credentials-storage',
    }
  )
);
