import { useChatStore } from '@/stores/useChatStore';
import GroupChatCard from './GroupChatCard';

const GroupChatList = () => {
   const { conversations } = useChatStore()
  
    if( !conversations) {
      return 
    }
    const groupConversations = conversations.filter(c => c.type === 'group');
  return (
    <div className='flex-1 overflow-auto p-2 space-y-2'>
    {groupConversations.map((conversation, index) => (
      <GroupChatCard key={index} conversation={conversation} />
    ))}
   </div>
  )
}

export default GroupChatList
