import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      loading: false,

      setAccessToken: (accessToken: string) => {
        set({ accessToken });
      },

      clearState: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null
        })

        // clear local storage 
        localStorage.clear()
      },


      signUp: async (
        username: string,
        password: string,
        email: string,
        firstName: string,
        lastName: string
      ) => {
        try {
          set({ loading: true });
          // call api to sign up
          await authService.signUp(username, password, email, firstName, lastName);

          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        } catch (error) {
          toast.error('Đăng ký thất bại. Vui lòng thử lại.');
          console.error(error);
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username: string, password: string) => {
        try {
          set({ loading: true });
          // call api to sign in
          const data = await authService.signIn(username, password);

          // clear local storage
          localStorage.clear();

          get().setAccessToken(data.accessToken);

          // lấy data get me
          await get().fetchMe();

          toast.success('Đăng nhập thành công!');
        } catch (error) {
          toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
          console.error(error);
        } finally {
          set({ loading: false });
        }
      },
      signOut: async () => {
        try {
          set({ loading: true });
          await authService.signOut();
          get().clearState();
          toast.success('Đăng xuất thành công!');
        } catch (error) {
          toast.error('Đăng xuất thất bại. Vui lòng thử lại.');
          console.error(error);
        } finally {
          set({ loading: false });
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();

          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error('Lỗi xảy ra khi lấy dữ liệu người dùng!');
        } finally {
          set({
            loading: false
          });
        }
      },
      refresh: async () => {
        try {
          set({ loading: true });
          const { user, fetchMe } = get();

          const accessToken = await authService.refresh();

          get().setAccessToken(accessToken);

          if (!user) {
            await fetchMe();
          }
        } catch (error) {
          console.error(error);
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
          get().clearState();
        } finally {
          set({ loading: false });
        }
      }
    }), {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user // only persist user data
    })
  }
  )
);
