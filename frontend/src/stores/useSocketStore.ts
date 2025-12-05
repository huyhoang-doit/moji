import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import type { SocketState } from '@/types/store';

const baseURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const useSocketStore = create<SocketState>((set, get) => ({
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
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}))