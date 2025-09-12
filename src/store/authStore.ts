import { create } from 'zustand';

type User = { id: number; name: string; email: string } | null;
type AuthState = {
  user: User;
  accessToken: string | null;
  setAuth: (u: User, t: string) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, token) => set({ user, accessToken: token }),
  clear: () => set({ user: null, accessToken: null }),
}));
