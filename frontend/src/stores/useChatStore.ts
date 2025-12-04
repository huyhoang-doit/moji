import { chatService } from '@/services/chatService';
import type { ChatState } from '@/types/store';
import { create } from 'zustand';
import { persist } from "zustand/middleware"
import { useAuthStore } from './useAuthStore';

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            conversationLoading: false, // for conversations list
            messageLoading: false, // for messages list

            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    conversationLoading: false,
                });
            },

            setActiveConversation: (conversationId: string | null) => {
                set({ activeConversationId: conversationId });
            },
            fetchConversations: async () => {
                try {
                    set({ conversationLoading: true });
                    const data = await chatService.fetchConversations();
                    set({ conversations: data.conversations, conversationLoading: false });
                } catch (error) {
                    console.error('Failed to fetch conversations:', error);
                } finally {
                    set({ conversationLoading: false });
                }
            },
            fetchMessages: async (conversationId?: string) => {
                const { activeConversationId, messages } = get();
                const { user } = useAuthStore.getState();
                const converId = conversationId ?? activeConversationId;

                if (!converId) return;
                const current = messages?.[converId];
                const nextCursor = current?.nextCursor === undefined ? "" : current?.nextCursor;

                if (nextCursor === null) return; // No more messages to fetch

                set({ messageLoading: true });

                try {
                    const { messages: fetched, cursor } = await chatService.fetchMessages(converId, nextCursor)

                    const processed = fetched.map(msg => ({
                        ...msg,
                        isOwn: msg.senderId === user?._id
                    }));


                    set((state: any) => {
                        const prev = state.messages[converId]?.items ?? [];
                        const merged = prev.length > 0 ? [...processed, ...prev] : processed;
                        return {
                            messages: {
                                ...state.messages,
                                [converId]: {
                                    items: merged,
                                    hasMore: !!cursor,
                                    nextCursor: cursor,
                                },
                            },
                        };
                    })
                } catch (error) {
                    console.error('Failed to fetch messages:', error);
                } finally {
                    set({ messageLoading: false });
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