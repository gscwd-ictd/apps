import { create } from 'zustand';
import { Competency } from '../types/competency.type';
import { devtools } from 'zustand/middleware';

type CompetencyState = {
  competency: Competency;
  competencies: Array<Competency>;
  loading: boolean;
  error: string;

  getCompetencies: (loading: boolean) => void;
  getCompetenciesSuccess: (response: Array<Competency>) => void;
  getCompetenciesFail: (error: string) => void;
};

export const useCompetencyStore = create<CompetencyState>()(
  devtools((set) => ({
    competency: {} as Competency,
    competencies: [],
    loading: false,
    error: '',

    getCompetencies: (loading: boolean) =>
      set((state) => ({ ...state, loading: loading })),

    getCompetenciesSuccess: (response: Array<Competency>) =>
      set((state) => ({ ...state, competencies: response, loading: false })),

    getCompetenciesFail: (error: string) =>
      set((state) => ({ ...state, error, loading: false })),
  }))
);
