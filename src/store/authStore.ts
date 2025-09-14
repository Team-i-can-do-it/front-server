import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ApiClient from '@_api/ApiClient';

type User = { id: number; name: string; email: string } | null;

type AuthState = {
  user: User;
  accessToken: string | null;
  setAuth: (u: User, t: string | null | undefined) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, token) => {
        if (token) {
          (ApiClient.defaults.headers as any).Authorization = `Bearer ${token}`;
        } else {
          delete (ApiClient.defaults.headers as any).Authorization;
        }
        set({ user, accessToken: token ?? null });
      },
      clear: () => {
        delete (ApiClient.defaults.headers as any).Authorization;
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: 'auth',
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken }),
      onRehydrateStorage: () => (state) => {
        const t = state?.accessToken;
        if (t) {
          (ApiClient.defaults.headers as any).Authorization = `Bearer ${t}`;
        }
      },
    },
  ),
);
