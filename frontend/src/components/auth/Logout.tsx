import React from 'react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { LogOut } from 'lucide-react';

const Logout = () => {
  const { signOut } = useAuthStore();
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <div>
      <Button variant="completeGhost" onClick={handleSignOut}>
        <LogOut className='text-destructive' />
        Đăng xuất
      </Button>
    </div>
  );
};

export default Logout;
