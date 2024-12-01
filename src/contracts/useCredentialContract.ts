import { useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { CREDENTIAL_CONTRACT_ADDRESS } from '../config/constants';
import CredentialContractABI from './CredentialContract.json';

export const useCredentialContract = () => {
  const { write: issueCredential, data: issueData } = useContractWrite({
    address: CREDENTIAL_CONTRACT_ADDRESS,
    abi: CredentialContractABI,
    functionName: 'issueCredential',
  });

  const { write: verifyCredential, data: verifyData } = useContractWrite({
    address: CREDENTIAL_CONTRACT_ADDRESS,
    abi: CredentialContractABI,
    functionName: 'verifyCredential',
  });

  const { write: revokeCredential, data: revokeData } = useContractWrite({
    address: CREDENTIAL_CONTRACT_ADDRESS,
    abi: CredentialContractABI,
    functionName: 'revokeCredential',
  });

  const { isLoading: isIssuing } = useWaitForTransaction({
    hash: issueData?.hash,
  });

  const { isLoading: isVerifying } = useWaitForTransaction({
    hash: verifyData?.hash,
  });

  const { isLoading: isRevoking } = useWaitForTransaction({
    hash: revokeData?.hash,
  });

  const getCredentialIssuer = async (tokenId: number) => {
    const { data } = await useContractRead({
      address: CREDENTIAL_CONTRACT_ADDRESS,
      abi: CredentialContractABI,
      functionName: 'getCredentialIssuer',
      args: [tokenId],
    });
    return data;
  };

  const getVerificationStatus = async (tokenId: number) => {
    const { data } = await useContractRead({
      address: CREDENTIAL_CONTRACT_ADDRESS,
      abi: CredentialContractABI,
      functionName: 'getVerificationStatus',
      args: [tokenId],
    });
    return data;
  };

  return {
    issueCredential,
    verifyCredential,
    revokeCredential,
    getCredentialIssuer,
    getVerificationStatus,
    isIssuing,
    isVerifying,
    isRevoking,
  };
};
