import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import type { Conversation } from '@/types/chat'
import ChatCard from './ChatCard'
import UnreadCountBadge from './UnreadCountBadge'
import GroupChatAvatar from './GroupChatAvatar'

const GroupChatCard = ({ conversation }: { conversation: Conversation }) => {
    const { user } = useAuthStore()
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useChatStore()

    if (!user) {
        return null
    }

    // Tìm participant khác trong cuộc trò chuyện
    const otherParticipant = conversation.participants.find(p => p._id !== user._id)

    if (!otherParticipant) {
        return null
    }

    // Lấy số lượng tin nhắn chưa đọc
    const unreadCount = conversation.unreadCounts[user._id] || 0;

    // Lấy tên nhóm
    const groupName = conversation.group?.name || "";

    // Lấy tin nhắn cuối cùng trong cuộc trò chuyện
    const lastMessage = conversation.lastMessage?.content ?? "";

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            await fetchMessages(id);
        }
    }

    return (
        <ChatCard
            conversationId={conversation._id}
            name={groupName}
            timestamp={
                conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage.createdAt) : undefined}
            isActive={activeConversationId === conversation._id}
            unreadCount={unreadCount}
            onSelect={handleSelectConversation}
            leftSection={
                <>
                    {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
                    <GroupChatAvatar participants={conversation.participants} type='chat' />
                </>
            }
            subtitle={
                <p className="text-sm truncate text-muted-foreground">{conversation.participants.length} thành viên</p>
            }
        />
    )
}

export default GroupChatCard
