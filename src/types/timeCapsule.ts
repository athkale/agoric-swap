export type CapsuleType = 'message' | 'memory' | 'prediction' | 'nft' | 'legacy';

export interface TimeCapsule {
  id: string;
  title: string;
  content: string;
  unlockDate: Date;
  type: CapsuleType;
  isLocked: boolean;
  createdAt: Date;
  createdBy: string;
  visibility: 'public' | 'private';
  attachments?: {
    type: 'image' | 'video' | 'nft';
    url: string;
  }[];
  reactions?: {
    type: string;
    count: number;
  }[];
  comments?: {
    id: string;
    content: string;
    createdAt: Date;
    createdBy: string;
  }[];
}
