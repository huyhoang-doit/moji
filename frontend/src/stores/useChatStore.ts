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
        })
        , {
            name: "chat-storage",
            partialize: (state) => ({
                conversations: state.conversations,
            }),
        })
)