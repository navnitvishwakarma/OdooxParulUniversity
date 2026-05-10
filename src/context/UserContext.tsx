import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  image: string;
}

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    name: 'Aman Patel',
    email: 'aman.patel@email.com',
    phone: '+1 (555) 123-4567',
    location: 'Vadodara, Gujarat',
    bio: "Cultural enthusiast and avid traveler from Vadodara. Love exploring Gujarat's heritage sites and trying authentic street food.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200'
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
