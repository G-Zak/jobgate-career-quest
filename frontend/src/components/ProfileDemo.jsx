import React from 'react';
import ProfilePage from '../features/profile/ProfilePage';
import { DarkModeProvider } from '../contexts/DarkModeContext';

const ProfileDemo = () => {
  return (
    <DarkModeProvider>
      <div className="min-h-screen">
        <ProfilePage />
      </div>
    </DarkModeProvider>
  );
};

export default ProfileDemo;
