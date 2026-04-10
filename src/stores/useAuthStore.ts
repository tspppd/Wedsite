import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/index';


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  upgradeToPro: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set({
          user: {
            id: '1',
            name: email.split('@')[0],
            email,
            plan: 'free',
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        set({
          user: {
            id: '1',
            name: 'Google User',
            email: 'user@gmail.com',
            plan: 'free',
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      },

      register: async (name: string, email: string, _password: string) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        set({
          user: {
            id: '1',
            name,
            email,
            plan: 'free',
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      upgradeToPro: () => {
        set((state) => ({
          user: state.user ? { ...state.user, plan: 'pro' } : null,
        }));
      },
    }),
    {
      name: 'wedding-auth',
    }
  )
);
