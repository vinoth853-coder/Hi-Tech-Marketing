import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      role: null,
      setRole: (role) => set({ role }),
      clearState: () => set({ role: null }),
    }),
    {
      name: 'auth-store',
    }
  )
);

export default useAuthStore;
