import type { Conversation } from '@/types/chat'
import ChatCard from './ChatCard'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import { cn } from '@/lib/utils'
import UserAvatar from './UserAvatar'
import StatusBadge from './StatusBadge'
import UnreadCountBadge from './UnreadCountBadge'

const DirectMessageCard = ({ conversation }: { conversation: Conversation }) => {
    const { user } = useAuthStore()
    const { activeConversationId, setActiveConversation, messages } = useChatStore()

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

    // Lấy tin nhắn cuối cùng trong cuộc trò chuyện
    const lastMessage = conversation.lastMessage?.content ?? "";

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            // load messages nếu chưa có
            // await fetchMessages(id);
        }
    }

    return (
        <ChatCard
            conversationId={conversation._id}
            name={otherParticipant.displayName ?? ""}
            timestamp={
                conversation.lastMessage?.createdAt ? new Date(conversation.lastMessage.createdAt) : undefined}
            isActive={activeConversationId === conversation._id}
            unreadCount={unreadCount}
            onSelect={handleSelectConversation}
            leftSection={
                <>
                    <UserAvatar type='sidebar' name={otherParticipant.displayName ?? ""} avatarUrl={otherParticipant.avatarUrl ?? undefined} />
                    {/* status on/off line thực hiện khi có socket.io */}
                    <StatusBadge status="online" />
                    {
                        unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />
                    }
                </>
            }
            subtitle={
                <p className={cn("text-sm truncate", unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground")}>{lastMessage}</p>
            }
        />
    )
}

export default DirectMessageCard
