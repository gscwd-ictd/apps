import { Publication } from 'apps/job-portal/utils/types/data/publication-type';
import { create } from 'zustand';

type PublicationState = {
  publication: Publication;
  setPublication: (publication: Publication) => void;
};

export const usePublicationStore = create<PublicationState>((set) => ({
  publication: {} as Publication,
  setPublication: (publication: Publication) => {
    set((state) => ({ ...state, publication }));
  },
}));
