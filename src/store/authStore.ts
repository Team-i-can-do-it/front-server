import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      setAuth: (user, token) => set({ user, accessToken: token }),
      clear: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'auth',
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken }),
    },
  ),
);
