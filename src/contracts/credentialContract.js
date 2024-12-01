// @ts-check
import { Far } from '@agoric/marshal';
import { makeIssuerKit, AmountMath } from '@agoric/ertp';
import { makeZoe } from '@agoric/zoe';
import { E } from '@agoric/eventual-send';

/**
 * @typedef {Object} CredentialData
 * @property {string} type - Type of credential
 * @property {string} title - Title of the credential
 * @property {string} description - Description of the credential
 * @property {string} recipient - Recipient's address
 * @property {string} issuer - Issuer's address
 * @property {string} issuedAt - Timestamp of issuance
 * @property {string[]} chains - List of chains where credential is verified
 */

/**
 * @type {import('@agoric/zoe').ContractStartFn}
 */
const start = async (zcf) => {
  // Create the credential mint and issuer
  const { mint: credentialMint, issuer: credentialIssuer } = makeIssuerKit(
    'Credentials',
    'set',
  );

  // Store verified issuers
  const verifiedIssuers = new Set();
  
  // Store issued credentials
  const credentials = new Map();
  
  // Store cross-chain verifications
  const chainVerifications = new Map();

  const addVerifiedIssuer = (issuer) => {
    verifiedIssuers.add(issuer);
  };

  const isVerifiedIssuer = (issuer) => verifiedIssuers.has(issuer);

  const issueCredential = async (
    issuer,
    credentialData,
    signature,
    chains,
  ) => {
    // Verify issuer
    if (!isVerifiedIssuer(issuer)) {
      throw new Error('Not a verified issuer');
    }

    // Create unique credential ID
    const credentialId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Store credential data
    credentials.set(credentialId, {
      ...credentialData,
      issuer,
      signature,
      chains,
      issuedAt: new Date().toISOString(),
      revoked: false,
    });

    // Mint credential NFT
    const amount = AmountMath.make(credentialIssuer.getBrand(), [credentialId]);
    const payment = credentialMint.mintPayment(amount);

    return { credentialId, payment };
  };

  const verifyCredential = (credentialId, chain) => {
    const credential = credentials.get(credentialId);
    if (!credential) {
      return false;
    }

    if (credential.revoked) {
      return false;
    }

    return credential.chains.includes(chain);
  };

  const revokeCredential = (issuer, credentialId) => {
    const credential = credentials.get(credentialId);
    if (!credential) {
      throw new Error('Credential not found');
    }

    if (credential.issuer !== issuer) {
      throw new Error('Not authorized to revoke');
    }

    credential.revoked = true;
    credentials.set(credentialId, credential);
  };

  const addChainVerification = (credentialId, chain) => {
    const credential = credentials.get(credentialId);
    if (!credential) {
      throw new Error('Credential not found');
    }

    if (!credential.chains.includes(chain)) {
      credential.chains.push(chain);
      credentials.set(credentialId, credential);
    }
  };

  const getCredential = (credentialId) => {
    return credentials.get(credentialId);
  };

  const publicFacet = Far('CredentialPublicFacet', {
    getIssuer: () => credentialIssuer,
    verifyCredential,
    getCredential,
  });

  const creatorFacet = Far('CredentialCreatorFacet', {
    addVerifiedIssuer,
    issueCredential,
    revokeCredential,
    addChainVerification,
  });

  return { publicFacet, creatorFacet };
};

harden(start);
export { start };
