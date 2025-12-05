export const updateConversationAfterCreateMessage = (conversation, message, senderId) => {
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createdAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId: message.senderId,
            createdAt: message.createdAt
        },
    });

    conversation.participants.forEach(participant => {
        const memberId = participant.userId.toString();
        const isSender = memberId === senderId.toString();

        const prevCount = conversation.unreadCounts.get(memberId) || 0;

        conversation.unreadCounts.set(
            memberId,
            isSender ? 0 : prevCount + 1
        );
    });

}


// Hỗ trợ phát sự kiện tin nhắn mới qua Socket.IO
export const emitNewMessage = (io, conversation, message) => {
    console.log("🚀 ~ emitNewMessage ~ conversation:", conversation)
    const data = {
        message,
        conversation: {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
        },
        unreadCounts: conversation.unreadCounts
    }
    console.log("🚀 ~ emitNewMessage ~ data:", data)
    io.to(conversation._id.toString()).emit('new-message', {
        message,
        conversation: {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
        },
        unreadCounts: conversation.unreadCounts
    });
}