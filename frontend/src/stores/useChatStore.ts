import { chatService } from '@/services/chatService';
import type { ChatState } from '@/types/store';
import { create } from 'zustand';
import { persist } from "zustand/middleware"
import { useAuthStore } from './useAuthStore';
import type { Message } from '@/types/chat';

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

            },
            sendDirectMessage: async (recipientId: string, content: string, imgUrl?: string) => {
                try {
                    const { activeConversationId } = get();
                    await chatService.sendDirectMessage(recipientId, content, imgUrl, activeConversationId || undefined);

                    set((state) => ({
                        conversations: state.conversations.map((c) =>
                            c._id === activeConversationId ? { ...c, seenBy: [] } : c
                        )
                    }));

                } catch (error) {
                    console.error('Failed to send direct message:', error);
                }
            },
            sendGroupMessage: async (conversationId: string, content: string, imgUrl?: string) => {
                try {
                    await chatService.sendGroupMessage(conversationId, content, imgUrl);

                    set((state) => ({
                        conversations: state.conversations.map((c) =>
                            c._id === get().activeConversationId ? { ...c, seenBy: [] } : c
                        )
                    }));

                } catch (error) {
                    console.error('Failed to send group message:', error);
                }
            },
            addMessage: async (message: Message) => {
                try {
                    const { user } = useAuthStore.getState();
                    const { fetchMessages } = get()

                    message.isOwn = message.senderId === user?._id;

                    const conversationId = message.conversationId

                    // Update chat state
                    let prevItems = get().messages[conversationId]?.items ?? [];
                    if (prevItems.length === 0) {
                        await fetchMessages(conversationId);
                        prevItems = get().messages[conversationId]?.items ?? [];
                    }

                    set((state) => {
                        if (prevItems.some(msg => msg._id === message._id)) {
                            return state;
                        }
                        return {
                            messages: {
                                ...state.messages,
                                [conversationId]: {
                                    items: [...prevItems, message],
                                    hasMore: state.messages[conversationId]?.hasMore ?? true,
                                    nextCursor: state.messages[conversationId]?.nextCursor ?? null,
                                },
                            },
                        }
                    });
                } catch (error) {
                    console.error('Failed to add message:', error);
                }
            },
            updateConversation: (conversation) => {
                set((state) => ({
                    conversations: state.conversations.map((c) =>
                        c._id === conversation._id ? { ...c, ...conversation } : c
                    ),
                }));
            }
        })
        , {
            name: "chat-storage",
            partialize: (state) => ({
                conversations: state.conversations,
            }),
        })
)