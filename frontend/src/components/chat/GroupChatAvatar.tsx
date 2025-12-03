import type { Participant } from '@/types/chat';
import React from 'react'
import { int } from 'zod'
import UserAvatar from './UserAvatar';
import { Ellipsis } from 'lucide-react';

interface IGroupChatAvatarProps {
    participants: Participant[];
    type: "sidebar" | "chat";
}

const GroupChatAvatar = ({ participants, type }: IGroupChatAvatarProps) => {
    const avatars = []
    const limit = Math.min(participants.length, 4);
    for (let i = 0; i < limit; i++) {
        const member = participants[i];
        avatars.push(
            <UserAvatar
                key={i}
                type={type}
                name={member.displayName ?? ""}
                avatarUrl={member.avatarUrl ?? undefined}
                className='size-10'
            />
        )
    }
    return (
        <div className='relative flex -space-x-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2'>
            {avatars}

            {/* Nếu có nhiều hơn 4 thành viên */}
            {participants.length > limit && (
                <div className='flex items-center justify-center size-8 rounded-full bg-muted text-muted-foreground ring-2 ring-background'>
                    <Ellipsis className='size-4' />
                </div>
            )}

        </div>
    )
}

export default GroupChatAvatar
