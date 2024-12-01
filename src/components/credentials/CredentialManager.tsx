import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCredentials } from '../../hooks/useCredentials';
import { useSupabase } from '../../context/SupabaseContext';
import type { Credential } from '../../lib/supabase/types';
import toast from 'react-hot-toast';

export function CredentialManager() {
  const { profile } = useSupabase();
  const { createCredential, getCredentials, verifyCredential, deleteCredential, loading } = useCredentials();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    metadata: {},
    expiryDate: ''
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setSelectedImage(acceptedFiles[0]);
    }
  });

  useEffect(() => {
    loadCredentials();
  }, [profile]);

  async function loadCredentials() {
    if (!profile) return;
    const data = await getCredentials();
    setCredentials(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await createCredential({
        ...formData,
        image: selectedImage || undefined
      });
      toast.success('Credential created successfully');
      setFormData({
        title: '',
        description: '',
        metadata: {},
        expiryDate: ''
      });
      setSelectedImage(null);
      loadCredentials();
    } catch (err) {
      toast.error('Failed to create credential');
      console.error(err);
    }
  }

  async function handleVerify(credential: Credential) {
    const isValid = await verifyCredential(credential);
    toast[isValid ? 'success' : 'error'](
      isValid ? 'Credential is valid' : 'Invalid credential'
    );
  }

  async function handleDelete(id: string) {
    try {
      await deleteCredential(id);
      toast.success('Credential deleted successfully');
      loadCredentials();
    } catch (err) {
      toast.error('Failed to delete credential');
      console.error(err);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">Create New Credential</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 text-black"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Metadata (JSON)</label>
            <textarea
              value={JSON.stringify(formData.metadata, null, 2)}
              onChange={(e) => {
                try {
                  const metadata = JSON.parse(e.target.value);
                  setFormData({ ...formData, metadata });
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 text-black font-mono"
              rows={4}
              placeholder="{}"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Expiry Date (Optional)</label>
            <input
              type="datetime-local"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">Image (Optional)</label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 bg-gray-200"
            >
              <input {...getInputProps()} />
              {selectedImage ? (
                <p className="text-black">{selectedImage.name}</p>
              ) : (
                <p className="text-gray-500">Drag & drop an image here, or click to select one</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Credential'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credentials.map((credential) => (
          <div key={credential.id} className="bg-gray-200 rounded-lg p-6 space-y-4">
            {credential.image_url && (
              <img
                src={credential.image_url}
                alt={credential.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            <h3 className="text-xl font-bold text-black">{credential.title}</h3>
            <p className="text-black">{credential.description}</p>
            {credential.expiry_date && (
              <p className="text-sm text-gray-600">
                Expires: {new Date(credential.expiry_date).toLocaleString()}
              </p>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => handleVerify(credential)}
                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium"
              >
                Verify
              </button>
              <button
                onClick={() => handleDelete(credential.id)}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
