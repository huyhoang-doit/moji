import { cn, formatMessageTime } from '@/lib/utils';
import type { Conversation, Message } from '@/types/chat'
import React from 'react'
import UserAvatar from './UserAvatar';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
interface MessageItemProps {
    message: Message;
    index: number;
    messages: Message[];
    selectedConversation: Conversation;
    lastMessageStatus: "delivered" | "seen";
}

const MessageItem = (
    {
        message,
        index,
        messages,
        selectedConversation,
        lastMessageStatus
    }: MessageItemProps
) => {
    const prev = messages[index - 1]

    const isGroupBreak = index === 0 ||
        message.senderId !== prev?.senderId ||
        new Date(message.createdAt).getTime() - new Date(prev?.createdAt).getTime() > 300000 // 5 minutes

    const participant = selectedConversation.participants.find(p => p._id.toString() === message.senderId)

    return (
        <div className={cn("flex gap-2 message-bounce", message.isOwn ? "justify-end" : "justify-start")}>
            {/* avatar */}
            {!message.isOwn && (<>
                <div>
                    {isGroupBreak && (
                        <UserAvatar type="chat" name={participant?.displayName ?? "Moji"} avatarUrl={participant?.avatarUrl ?? undefined} />
                    )}
                </div>
            </>)}
            {/* tin nhắn */}
            <div className={cn("max-w-xs lg:max-w-md space-y-1 flex flex-col",
                message.isOwn ? "items-end" : "items-start"
            )}>
                <Card
                    className={cn("p-3", message.isOwn ? "chat-bubble-sent border-0" : "bg-chat-bubble-received")}
                >
                    <p className='text-sm leading-relaxed break-words'>{message.content}</p>
                </Card>
                {/* timestamp */}
                {isGroupBreak && (
                    <span className='text-xs text-muted-foreground px-1'>
                        {formatMessageTime(new Date(message.createdAt))}
                    </span>
                )}

                {/* seen/delivered */}
                {message.isOwn && message._id === selectedConversation.lastMessage?._id && (
                    <Badge variant="outline" className={cn('text-xs px-1.5 py-0.5 h-4 border-0',
                        lastMessageStatus === "seen" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        {lastMessageStatus}
                    </Badge>
                )}
            </div>

        </div>
    )
}

export default MessageItem
