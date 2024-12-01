import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimeCapsule, CapsuleType } from '../types/timeCapsule';

interface TimeCapsuleStore {
  capsules: TimeCapsule[];
  addCapsule: (capsule: Omit<TimeCapsule, 'id' | 'createdAt'>) => void;
  getCapsulesByType: (type: CapsuleType) => TimeCapsule[];
  getUnlockedCapsules: () => TimeCapsule[];
  getLockedCapsules: () => TimeCapsule[];
  deleteCapsule: (id: string) => void;
  updateCapsule: (id: string, updates: Partial<TimeCapsule>) => void;
  addComment: (capsuleId: string, content: string, createdBy: string) => void;
  addReaction: (capsuleId: string, reactionType: string) => void;
}

export const useTimeCapsuleStore = create<TimeCapsuleStore>()(
  persist(
    (set, get) => ({
      capsules: [],
      
      addCapsule: (capsule) =>
        set((state) => ({
          capsules: [
            ...state.capsules,
            {
              ...capsule,
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(),
              reactions: [],
              comments: [],
            },
          ],
        })),

      getCapsulesByType: (type) =>
        get().capsules.filter((capsule) => capsule.type === type),

      getUnlockedCapsules: () =>
        get().capsules.filter(
          (capsule) => new Date(capsule.unlockDate) <= new Date()
        ),

      getLockedCapsules: () =>
        get().capsules.filter(
          (capsule) => new Date(capsule.unlockDate) > new Date()
        ),

      deleteCapsule: (id) =>
        set((state) => ({
          capsules: state.capsules.filter((capsule) => capsule.id !== id),
        })),

      updateCapsule: (id, updates) =>
        set((state) => ({
          capsules: state.capsules.map((capsule) =>
            capsule.id === id ? { ...capsule, ...updates } : capsule
          ),
        })),

      addComment: (capsuleId, content, createdBy) =>
        set((state) => ({
          capsules: state.capsules.map((capsule) =>
            capsule.id === capsuleId
              ? {
                  ...capsule,
                  comments: [
                    ...(capsule.comments || []),
                    {
                      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      content,
                      createdAt: new Date(),
                      createdBy,
                    },
                  ],
                }
              : capsule
          ),
        })),

      addReaction: (capsuleId, reactionType) =>
        set((state) => ({
          capsules: state.capsules.map((capsule) =>
            capsule.id === capsuleId
              ? {
                  ...capsule,
                  reactions: [
                    ...(capsule.reactions || []).filter(
                      (r) => r.type !== reactionType
                    ),
                    {
                      type: reactionType,
                      count:
                        ((capsule.reactions || []).find(
                          (r) => r.type === reactionType
                        )?.count || 0) + 1,
                    },
                  ],
                }
              : capsule
          ),
        })),
    }),
    {
      name: 'time-capsules-storage',
    }
  )
);
