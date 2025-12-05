import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import type { SocketState } from '@/types/store';
import { useChatStore } from './useChatStore';

const baseURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const useSocketStore = create<SocketState>((set, get) => ({
    onlineUsers: [],
    socket: null,
    connectSocket: () => {
        const { accessToken } = useAuthStore.getState();
        const exitingSocket = get().socket;
        if (!accessToken) {
            console.warn('No access token, cannot connect socket');
            return;
        }
        if (exitingSocket) { // tranh tao nhieu ket noi
            console.warn('Socket already connected');
            return;
        }

        const socket = io(baseURL, {
            auth: {
                token: accessToken,
            },
            transports: ['websocket'],
        });

        set({ socket });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        })


        // Lắng nghe sự kiện online-users từ server
        socket.on('online-users', (userIds: string[]) => {
            set({ onlineUsers: userIds });
        })

        // new message event
        socket.on('new-message', ({ message, conversation, unreadCounts }) => {
            console.log("🚀 ~ conversation:", conversation)
            console.log("🚀 ~ message:", message)
            useChatStore.getState().addMessage(message);

            const lastMessage = {
                _id: conversation.lastMessage?._id,
                content: conversation.lastMessage?.content,
                createdAt: conversation.lastMessage?.createdAt,
                sender: {
                    _id: conversation.lastMessage?.senderId,
                    displayName: '',
                    avatarUrl: null
                }
            }

            const updateConversation = {
                ...conversation,
                lastMessage: lastMessage,
                unseenCount: unreadCounts[conversation._id] || 0
            }

            if (useChatStore.getState().activeConversationId !== message.conversationId) {
                // Đánh đấu đã đọc
            }

            useChatStore.getState().updateConversation(updateConversation);
        });

    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}))