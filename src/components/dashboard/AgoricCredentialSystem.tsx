import React, { useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiCheck, FiClock } from 'react-icons/fi';
import { credentialAPI } from '../../lib/supabase/api';
import type { Credential } from '../../lib/supabase/types';

interface Credential {
  id: string;
  issuer: string;
  holder: string;
  type: string;
  title: string;
  description: string;
  data: any;
  image_url: string;
  expiry_date: string;
  issuance_date: string;
  category: string;
  tags: string[];
  signature: string;
  chain_id: number;
  verification_status: 'unverified' | 'verified' | 'expired' | 'invalid';
  verification_count: number;
  created_at: string;
  metadata: {
    issuer_name: string;
  };
}

export const AgoricCredentialSystem: React.FC = () => {
  const { address } = useAccount();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [newCredential, setNewCredential] = useState({
    type: '',
    title: '',
    description: '',
    data: '',
    image: '',
    expiryDate: '',
    issuanceDate: new Date().toISOString().split('T')[0],
    category: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      loadCredentials();
    }
  }, [address]);

  const loadCredentials = async () => {
    try {
      setIsLoading(true);
      const data = await credentialAPI.getCredentials(address!);
      setCredentials(data);
      toast.success('Credentials loaded successfully');
    } catch (error) {
      console.error('Error loading credentials:', error);
      toast.error('Failed to load credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setNewCredential(prev => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const addTag = () => {
    if (newTag.trim() && !newCredential.tags.includes(newTag.trim())) {
      setNewCredential(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewCredential(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const createCredential = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask');
        return;
      }

      if (!newCredential.title || !newCredential.type || !newCredential.expiryDate) {
        toast.error('Please fill in all required fields');
        return;
      }

      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      // Create base credential object
      const credentialData: Omit<Credential, 'id' | 'created_at'> = {
        issuer: address || '',
        holder: address || '',
        type: newCredential.type,
        title: newCredential.title,
        description: newCredential.description,
        data: newCredential.data,
        image_url: '',
        expiry_date: newCredential.expiryDate,
        issuance_date: newCredential.issuanceDate,
        category: newCredential.category,
        tags: newCredential.tags,
        signature: '',
        chain_id: Number(network.chainId),
        verification_status: 'unverified',
        verification_count: 0,
        metadata: {
          issuer_name: address,
        }
      };

      // Sign the credential
      const message = ethers.solidityPackedKeccak256(
        ['string', 'string', 'string', 'string', 'string', 'uint256'],
        [
          credentialData.title,
          credentialData.issuer,
          credentialData.holder,
          credentialData.type,
          credentialData.expiry_date,
          credentialData.chain_id
        ]
      );

      const signature = await signer.signMessage(ethers.getBytes(message));
      credentialData.signature = signature;

      // Upload image if exists
      if (newCredential.image) {
        const imageFile = await fetch(newCredential.image).then(r => r.blob());
        const file = new File([imageFile], 'credential-image.png', { type: 'image/png' });
        const savedCredential = await credentialAPI.createCredential(credentialData);
        const imageUrl = await credentialAPI.uploadCredentialImage(savedCredential.id, file);
        credentialData.image_url = imageUrl;
      }

      // Save credential to Supabase
      await credentialAPI.createCredential(credentialData);
      
      toast.success('Credential created successfully');
      resetForm();
      await loadCredentials();
    } catch (error) {
      console.error('Error creating credential:', error);
      toast.error('Failed to create credential');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCredential = async (credential: Credential) => {
    try {
      setIsLoading(true);
      const message = ethers.solidityPackedKeccak256(
        ['string', 'string', 'string', 'string', 'string', 'uint256'],
        [
          credential.title,
          credential.issuer,
          credential.holder,
          credential.type,
          credential.expiry_date,
          credential.chain_id
        ]
      );

      const recoveredAddress = ethers.verifyMessage(ethers.getBytes(message), credential.signature);
      const isValidSignature = recoveredAddress.toLowerCase() === credential.issuer.toLowerCase();
      const isExpired = new Date(credential.expiry_date) < new Date();

      const status = isExpired ? 'expired' : (isValidSignature ? 'verified' : 'invalid');
      
      // Update verification status in Supabase
      await credentialAPI.updateVerificationStatus(credential.id, status);
      await loadCredentials();

      if (isExpired) {
        toast.error('Credential has expired');
      } else if (isValidSignature) {
        toast.success('Credential verified successfully');
      } else {
        toast.error('Invalid credential signature');
      }
    } catch (error) {
      console.error('Error verifying credential:', error);
      toast.error('Failed to verify credential');
    } finally {
      setIsLoading(false);
    }
  };

  const getVerificationStatusColor = (status: Credential['verification_status']) => {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'expired':
        return 'text-red-600';
      case 'invalid':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const getVerificationStatusIcon = (status: Credential['verification_status']) => {
    switch (status) {
      case 'verified':
        return <FiCheck className="w-4 h-4" />;
      case 'expired':
        return <FiClock className="w-4 h-4" />;
      case 'invalid':
        return <FiX className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const resetForm = () => {
    setNewCredential({
      type: '',
      title: '',
      description: '',
      data: '',
      image: '',
      expiryDate: '',
      issuanceDate: new Date().toISOString().split('T')[0],
      category: '',
      tags: [],
    });
    setPreviewImage(null);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl border border-gray-200">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#D06A48]">Create New Credential</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-black mb-2">Title *</label>
              <input
                type="text"
                placeholder="Credential Title"
                value={newCredential.title}
                onChange={(e) => setNewCredential({ ...newCredential, title: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Type *</label>
              <select
                value={newCredential.type}
                onChange={(e) => setNewCredential({ ...newCredential, type: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
              >
                <option value="">Select Type</option>
                <option value="academic">Academic</option>
                <option value="professional">Professional</option>
                <option value="certification">Certification</option>
                <option value="identity">Identity</option>
                <option value="membership">Membership</option>
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Category</label>
              <input
                type="text"
                placeholder="Credential Category"
                value={newCredential.category}
                onChange={(e) => setNewCredential({ ...newCredential, category: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Description</label>
              <textarea
                placeholder="Credential Description"
                value={newCredential.description}
                onChange={(e) => setNewCredential({ ...newCredential, description: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black h-24 resize-none"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-black mb-2">Issuance Date *</label>
              <input
                type="date"
                value={newCredential.issuanceDate}
                onChange={(e) => setNewCredential({ ...newCredential, issuanceDate: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Expiry Date *</label>
              <input
                type="date"
                value={newCredential.expiryDate}
                onChange={(e) => setNewCredential({ ...newCredential, expiryDate: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Tags</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {newCredential.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 rounded-lg text-black flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiX />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-black mb-2">Image</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer
                          ${isDragActive ? 'border-blue-300 bg-blue-50' : 'bg-white'}`}
              >
                <input {...getInputProps()} />
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(null);
                        setNewCredential(prev => ({ ...prev, image: '' }));
                      }}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full text-red-600 hover:text-red-700"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="text-black">
                    <FiUpload className="mx-auto text-2xl mb-2" />
                    <p>Drag & drop an image or click to select</p>
                    <p className="text-sm text-gray-500">(Max size: 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={createCredential}
          className="w-full px-6 py-3 bg-black text-white rounded-lg
                   hover:bg-gray-800 transition-all duration-300 mt-4"
        >
          Create Credential
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#D06A48]">Your Credentials</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : credentials.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No credentials found. Create your first credential above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((cred) => (
              <div key={cred.id} className="p-4 bg-white rounded-md border border-gray-300">
                <div className="flex flex-col gap-3">
                  {cred.image_url && (
                    <img
                      src={cred.image_url}
                      alt={cred.title}
                      className="w-full h-32 object-cover rounded-mb"
                    />
                  )}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-blue-500 font-semibold text-lg">{cred.title}</h3>
                        <span className={`flex items-center gap-1 ${getVerificationStatusColor(cred.verification_status)}`}>
                          {getVerificationStatusIcon(cred.verification_status)}
                          <span className="text-sm capitalize">{cred.verification_status}</span>
                        </span>
                      </div>
                      <p className="text-black">{cred.type}</p>
                      <p className="text-gray-500 text-sm">ID: {cred.id.substring(0, 8)}...</p>
                      <p className="text-gray-500 text-sm">Issuer: {cred.issuer.substring(0, 8)}...</p>
                      <p className="text-gray-500 text-sm">Chain ID: {cred.chain_id}</p>
                      <p className="text-gray-500 text-sm">
                        Valid: {new Date(cred.issuance_date).toLocaleDateString()} - {new Date(cred.expiry_date).toLocaleDateString()}
                      </p>
                      {cred.metadata && (
                        <p className="text-gray-500 text-sm">
                          Issuer Name: {cred.metadata.issuer_name}
                        </p>
                      )}
                      {cred.verification_count > 0 && (
                        <p className="text-gray-500 text-sm">
                          Verified {cred.verification_count} time{cred.verification_count !== 1 ? 's' : ''}
                        </p>
                      )}
                      {cred.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                          {cred.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-200 rounded-lg text-sm text-black"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => verifyCredential(cred)}
                      className={`px-4 py-2 text-white rounded-lg 
                               hover:shadow-lg transition-all duration-300
                               ${cred.verification_status === 'verified' 
                                 ? 'bg-green-500 hover:bg-green-600' 
                                 : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                      {cred.verification_status === 'verified' ? 'Verify Again' : 'Verify'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
