import { chatService } from '@/services/chatService';
import type { ChatState } from '@/types/store';
import { create } from 'zustand';
import { persist } from "zustand/middleware"

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            loading: false,

            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    loading: false,
                });
            },
            
            setActiveConversation: (conversationId: string | null) => {
                set({ activeConversationId: conversationId });
            },
            fetchConversations: async () => {
                try {
                    set({ loading: true });
                    const data = await chatService.fetchConversations();
                    set({ conversations: data.conversations , loading: false});
                } catch (error) {
                    console.error('Failed to fetch conversations:', error);
                } finally {
                    set({ loading: false });
                }
            }
        })
        , {
            name: "chat-storage",
            partialize: (state) => ({
                conversations: state.conversations,
            }),
        })
)