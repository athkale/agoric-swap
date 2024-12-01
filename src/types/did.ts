export interface DID {
  id: string;
  controller: string;
  created: string;
  updated: string;
  status: 'active' | 'revoked';
}

export interface Credential {
  id: string;
  type: string;
  issuer: string;
  holder: string;
  issuanceDate: string;
  expirationDate?: string;
  claims: Record<string, any>;
  proof?: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    jws?: string;
  };
}