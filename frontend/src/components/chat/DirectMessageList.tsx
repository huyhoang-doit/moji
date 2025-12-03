import { useChatStore } from '@/stores/useChatStore'
import DirectMessageCard from './DirectMessageCard'

const DirectMessageList = () => {
  // lấy thông tin conversations từ store chat
  const { conversations } = useChatStore()

  if( !conversations) {
    return 
  }
  const directConversations = conversations.filter(c => c.type === 'direct');

  return (
   <div className='flex-1 overflow-auto p-2 space-y-2'>
    {directConversations.map((conversation, index) => (
      <DirectMessageCard key={index} conversation={conversation} />
    ))}
   </div>
  )
}

export default DirectMessageList
