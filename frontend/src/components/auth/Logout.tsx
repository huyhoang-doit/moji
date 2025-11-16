import React from 'react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';

const Logout = () => {
  const { signOut } = useAuthStore();
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div>
      <Button onClick={handleSignOut}>Đăng xuất</Button>
    </div>
  );
};

export default Logout;
