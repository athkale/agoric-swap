import { useState, useCallback, useEffect } from 'react';
import { useAccount, useContractWrite, useContractRead, useConnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { CredentialManagerABI } from '../contracts/CredentialManagerABI';

// This is the default local Hardhat node address for the first deployed contract
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export const useCredentialContract = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if the connected address is an issuer
  const { data: isIssuer } = useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CredentialManagerABI,
    functionName: 'issuers',
    args: [address],
    enabled: !!address,
    watch: true,
  });

  // Contract write functions
  const { writeAsync: issueCredential } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CredentialManagerABI,
    functionName: 'issueCredential',
  });

  const { writeAsync: addIssuer } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CredentialManagerABI,
    functionName: 'addIssuer',
  });

  const handleConnect = useCallback(async () => {
    try {
      if (connectors[0]) {
        await connect({ connector: connectors[0] });
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err);
    }
  }, [connect, connectors]);

  const addNewIssuer = useCallback(async (issuerAddress: string) => {
    if (!isConnected || !address) {
      throw new Error('Please connect your wallet first');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Adding issuer:', issuerAddress);

      const tx = await addIssuer({
        args: [issuerAddress],
      });

      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      return tx.hash;
    } catch (err: any) {
      console.error('Add issuer error:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, addIssuer]);

  const createCredential = useCallback(async (
    issuer: string,
    holder: string,
    schema: string,
    data: string | object
  ) => {
    if (!isConnected || !address) {
      throw new Error('Please connect your wallet first');
    }

    // Check if we're on the right network (31337 is Hardhat's chainId)
    if (chain?.id !== 31337) {
      if (switchNetwork) {
        try {
          await switchNetwork(31337);
        } catch (err) {
          console.error('Network switch error:', err);
          throw new Error('Failed to switch network. Please switch to localhost manually.');
        }
      } else {
        throw new Error('Please switch to localhost network manually');
      }
    }

    // Check if the connected address is an issuer
    if (!isIssuer) {
      throw new Error('Your address is not authorized to issue credentials. Please get authorized first.');
    }

    try {
      setLoading(true);
      setError(null);

      // Ensure data is a string
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);

      console.log('Issuing credential with params:', {
        issuer,
        holder,
        schema,
        dataString
      });

      const tx = await issueCredential({
        args: [issuer, holder, schema, dataString],
      });

      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      return tx.hash;
    } catch (err: any) {
      console.error('Contract interaction error:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, chain?.id, switchNetwork, issueCredential, isIssuer]);

  return {
    loading,
    error,
    createCredential,
    addNewIssuer,
    isIssuer: !!isIssuer,
    address,
    isConnected,
    connect: handleConnect,
    chainId: chain?.id,
  };
};
