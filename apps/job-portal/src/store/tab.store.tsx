import create from 'zustand'

export type TabState = {
  selectedTab: number
  setSelectedTab: (selectedTab: number) => void
  isExistingApplicant: boolean
  setIsExistingApplicant: (isExistingApplicant: boolean) => void
  handlePrevTab: () => void
  handleNextTab: () => void
}

export const useTabStore = create<TabState>((set, get) => ({
  selectedTab: 1,
  isExistingApplicant: false,
  setSelectedTab: (selectedTab: number) => set((state) => ({ ...state, selectedTab })),
  setIsExistingApplicant: (isExistingApplicant: boolean) => set((state) => ({ ...state, isExistingApplicant })),
  handleNextTab: async () => {
    const selectedTab = get().selectedTab
    if (selectedTab < 11) {
      set({ selectedTab: selectedTab + 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  handlePrevTab: async () => {
    const selectedTab = get().selectedTab
    if (selectedTab > 0) {
      set({ selectedTab: selectedTab - 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
}))
