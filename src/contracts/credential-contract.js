// @ts-check

import { Far } from '@endo/marshal';
import { makeZoeKit } from '@agoric/zoe';

/**
 * @typedef {Object} CredentialTerms
 * @property {string} issuer - The DID of the credential issuer
 * @property {string} schema - The schema of the credential
 */

/**
 * @type {ContractStartFn}
 */
const start = async (zcf) => {
  // Store credentials with their status
  const credentials = new Map();

  const createCredential = (issuer, holder, schema, data) => {
    const credentialId = `${issuer}-${Date.now()}`;
    credentials.set(credentialId, {
      issuer,
      holder,
      schema,
      data,
      status: 'active',
      timestamp: Date.now(),
    });
    return credentialId;
  };

  const revokeCredential = (credentialId) => {
    const credential = credentials.get(credentialId);
    if (!credential) {
      throw new Error(`Credential ${credentialId} not found`);
    }
    credential.status = 'revoked';
    credentials.set(credentialId, credential);
    return true;
  };

  const verifyCredential = (credentialId) => {
    const credential = credentials.get(credentialId);
    if (!credential) {
      return { valid: false, reason: 'Credential not found' };
    }
    if (credential.status !== 'active') {
      return { valid: false, reason: 'Credential is revoked' };
    }
    return { valid: true, credential };
  };

  const getPublicFacet = () => {
    return Far('CredentialPublicFacet', {
      verifyCredential,
    });
  };

  const getCreatorFacet = () => {
    return Far('CredentialCreatorFacet', {
      createCredential,
      revokeCredential,
    });
  };

  return harden({ publicFacet: getPublicFacet(), creatorFacet: getCreatorFacet() });
};

harden(start);
export { start };
