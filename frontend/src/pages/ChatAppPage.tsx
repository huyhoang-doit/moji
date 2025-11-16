import Logout from '@/components/auth/Logout';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';
import React from 'react';
import { toast } from 'sonner';

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);

  const handleClick = async () => {
    try {
      await api.get('users/test', {
        withCredentials: true
      });
      toast.success('Oke');
    } catch (error) {
      toast.error('Lỗi khi test status 204');
    }
  };

  return (
    <div>
      {user?.username}
      ChatAppPage
      <Logout />
      <Button onClick={handleClick}>Test</Button>
    </div>
  );
};

export default ChatAppPage;
