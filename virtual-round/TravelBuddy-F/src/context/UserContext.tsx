import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar_url: string;
}

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.get('/users/profile');
      setUser({
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200'
      });
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, refreshProfile: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
