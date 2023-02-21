import create from "zustand"

type PdsState = {
    tab: number
    setTab: (tab: number) => void
}


export const usePdsStore = create<PdsState>((set) => ({
    tab: 1,
    setTab: (tab: number) => {
        set((state) => ({ ...state, tab }))
    }
}))