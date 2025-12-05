import api from "@/lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

interface FetchMessagesProps {
    messages: Message[];
    cursor?: string;
}

const PAGE_SIZE = 50;

export const chatService = {
    async fetchConversations(): Promise<ConversationResponse> {
        const response = await api.get('/conversations');
        return response.data;
    },

    async fetchMessages(id: string, cursor?: string): Promise<FetchMessagesProps> {
        const response = await api.get(`/conversations/${id}/messages?limit=${PAGE_SIZE}`, {
            params: {
                cursor
            }
        });
        return {
            messages: response.data.messages,
            cursor: response.data.nextCursor
        };
    },

    async sendDirectMessage(recipientId: string, content: string, imgUrl?: string, conversationId?: string): Promise<Message> {
        const response = await api.post(`/messages/direct`, {
            recipientId,
            content,
            conversationId,
            imgUrl
        });
        return response.data.message;
    },
    async sendGroupMessage(conversationId: string, content: string, imgUrl?: string): Promise<Message> {
        const response = await api.post(`/messages/group`, {
            content,
            conversationId,
            imgUrl
        });
        return response.data.message;
    }
}