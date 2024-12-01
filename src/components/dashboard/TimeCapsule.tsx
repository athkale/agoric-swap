import React, { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Database } from '../../types/supabase';
import { toast } from 'react-hot-toast';
import { format, isAfter } from 'date-fns';

type TimeCapsule = Database['public']['Tables']['time_capsules']['Row'];
type TimeCapsuleInsert = Database['public']['Tables']['time_capsules']['Insert'];

export const TimeCapsule: React.FC = () => {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCredential, setSelectedCredential] = useState<string>('');
  const [unlockDate, setUnlockDate] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    fetchTimeCapsules();
  }, []);

  const fetchTimeCapsules = async () => {
    try {
      const { data, error } = await supabase
        .from('time_capsules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimeCapsules(data || []);
    } catch (error) {
      console.error('Error fetching time capsules:', error);
      toast.error('Failed to load time capsules');
    } finally {
      setLoading(false);
    }
  };

  const createTimeCapsule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedCredential || !unlockDate || !title) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newCapsule: TimeCapsuleInsert = {
        profile_id: user.id,
        credential_id: selectedCredential,
        title,
        description,
        unlock_date: new Date(unlockDate).toISOString(),
        status: 'locked',
      };

      const { error } = await supabase
        .from('time_capsules')
        .insert([newCapsule]);

      if (error) throw error;

      toast.success('Time capsule created successfully');
      fetchTimeCapsules();
      // Reset form
      setSelectedCredential('');
      setUnlockDate('');
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating time capsule:', error);
      toast.error('Failed to create time capsule');
    }
  };

  const unlockTimeCapsule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('time_capsules')
        .update({ status: 'unlocked' })
        .eq('id', id)
        .eq('status', 'unlockable');

      if (error) throw error;

      toast.success('Time capsule unlocked successfully');
      fetchTimeCapsules();
    } catch (error) {
      console.error('Error unlocking time capsule:', error);
      toast.error('Failed to unlock time capsule');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'locked':
        return 'text-red-500';
      case 'unlockable':
        return 'text-yellow-500';
      case 'unlocked':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Time Capsules</h2>

      {/* Create Time Capsule Form */}
      <form onSubmit={createTimeCapsule} className="mb-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Create New Time Capsule</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unlock Date</label>
            <input
              type="datetime-local"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Time Capsule
          </button>
        </div>
      </form>

      {/* Time Capsules List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : timeCapsules.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No time capsules found</div>
          ) : (
            timeCapsules.map((capsule) => (
              <div key={capsule.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium">{capsule.title}</h4>
                    <p className="text-gray-600 mt-1">{capsule.description}</p>
                    <div className="mt-2 text-sm">
                      <span className={getStatusColor(capsule.status)}>
                        Status: {capsule.status.charAt(0).toUpperCase() + capsule.status.slice(1)}
                      </span>
                      <span className="ml-4">
                        Unlock Date: {format(new Date(capsule.unlock_date), 'PPpp')}
                      </span>
                    </div>
                  </div>
                  {capsule.status === 'unlockable' && (
                    <button
                      onClick={() => unlockTimeCapsule(capsule.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Unlock
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeCapsule;
