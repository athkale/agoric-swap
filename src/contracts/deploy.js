// @ts-check
import { E } from '@endo/eventual-send';
import { makeHelpers } from '@agoric/deploy-script-support';

const deployContract = async (homeP, { bundleSource, pathResolve }) => {
  const { zoe, installation: installs } = await makeHelpers(homeP);

  // Bundle the contract
  const bundle = await bundleSource(pathResolve('./credential-contract.js'));
  
  // Install the contract on Zoe
  const installation = await E(zoe).install(bundle);
  
  // Save the installation in the chain's "installs" table
  const CREDENTIAL_CONTRACT_INSTALLATION = 'credentialContract';
  await E(installs).set(CREDENTIAL_CONTRACT_INSTALLATION, installation);
  
  // Start an instance
  const { creatorFacet, publicFacet } = await E(zoe).startInstance(installation);
  
  console.log('Contract deployed successfully');
  console.log('Installation ID:', installation);
  console.log('Creator Facet:', creatorFacet);
  console.log('Public Facet:', publicFacet);
  
  return { installation, creatorFacet, publicFacet };
};

export { deployContract };
