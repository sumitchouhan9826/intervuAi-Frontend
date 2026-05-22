import { create } from 'zustand';

const useUIStore = create((set) => ({
  sidebarOpen: false,
  theme: 'light',
  searchQuery: '',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

export default useUIStore;
