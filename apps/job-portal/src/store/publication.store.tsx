
import create from "zustand"
import { Publication } from "../types/data/publication-type"

type PublicationState = {
    publication: Publication
    setPublication: (publication: Publication) => void
}

export const usePublicationStore = create<PublicationState>((set) => ({
    publication: {} as Publication,
    setPublication: (publication: Publication) => {
        set((state) => ({ ...state, publication }))
    }
}))