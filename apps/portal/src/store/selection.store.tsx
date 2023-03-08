import { create } from 'zustand';
import { ModalState, ErrorState } from '../types/modal.type';
import {
  ApplicantWithScores,
  PsbScores,
  Ranking,
} from '../types/selection.type';
import { Publication, PublicationDetails } from '../types/publication.type';
import { AlertState } from '../types/alert.type';

export const RANKING: Ranking = {
  ranking: [],
  numberOfApplicants: '',
  dateOfPanelInterview: '',
  salaryGrade: 0,
  numberOfQualifiedApplicants: '',
  numberOfInterviewedApplicants: '',
  interviewDone: '',
  allPsbSubmitted: '',
};

export type SelectionState = {
  alert: AlertState;
  setAlert: (alert: AlertState) => void;
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  action: string;
  setAction: (value: string) => void;
  error: ErrorState;
  setError: (error: ErrorState) => void;
  publicationList: Array<Publication>;
  setPublicationList: (publications: Array<Publication>) => void;
  selectedPublicationId: string;
  setSelectedPublicationId: (value: string) => void;
  selectedPublication: Publication;
  setSelectedPublication: (publication: Publication) => void;
  ranking: Ranking;
  setRanking: (ranking: Ranking) => void;
  selectedApplicants: Array<ApplicantWithScores>;
  setSelectedApplicants: (applicants: Array<ApplicantWithScores>) => void;
  filteredApplicantList: Array<ApplicantWithScores>;
  setFilteredApplicantList: (applicantList: Array<ApplicantWithScores>) => void;
  applicantList: Array<ApplicantWithScores>;
  setApplicantList: (applicants: Array<ApplicantWithScores>) => void;
  filteredPublicationList: Array<Publication>;
  setFilteredPublicationList: (
    filteredPublications: Array<Publication>
  ) => void;
  publicationDetails: PublicationDetails;
  setPublicationDetails: (publicationDetails: PublicationDetails) => void;
  applicantScores: Array<PsbScores>;
  setApplicantScores: (applicantScores: Array<PsbScores>) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  pendingPublicationList: Array<Publication>;
  setPendingPublicationList: (
    pendingPublicationList: Array<Publication>
  ) => void;
  fulfilledPublicationList: Array<Publication>;
  setFulfilledPublicationList: (
    fulfilledPublicationList: Array<Publication>
  ) => void;
  tab: number;
  setTab: (tab: number) => void;
};

export const useAppSelectionStore = create<SelectionState>((set) => ({
  alert: { isOpen: false, page: 1 },
  modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
  action: '',
  error: { isError: false, errorMessage: '' },
  selectedPublicationId: '',
  selectedPublication: {} as Publication,
  ranking: {} as Ranking,
  selectedApplicants: [],
  filteredApplicantList: [],
  applicantList: [],
  publicationList: [],
  filteredPublicationList: [],
  publicationDetails: {} as PublicationDetails,
  applicantScores: [],
  tab: 1,
  pendingPublicationList: [],
  fulfilledPublicationList: [],
  isLoading: false,
  setAlert: (alert: AlertState) => {
    set((state) => ({ ...state, alert }));
  },
  setModal: (modal: ModalState) => {
    set((state) => ({ ...state, modal }));
  },
  setAction: (action: string) => {
    set((state) => ({ ...state, action }));
  },
  setError: (error: ErrorState) => {
    set((state) => ({ ...state, error }));
  },
  setSelectedPublicationId: (selectedPublicationId: string) => {
    set((state) => ({ ...state, selectedPublicationId }));
  },
  setSelectedPublication: (selectedPublication: Publication) => {
    set((state) => ({ ...state, selectedPublication }));
  },
  setRanking: (ranking: Ranking) => {
    set((state) => ({ ...state, ranking }));
  },
  setSelectedApplicants: (selectedApplicants: Array<ApplicantWithScores>) => {
    set((state) => ({ ...state, selectedApplicants }));
  },
  setFilteredApplicantList: (
    filteredApplicantList: Array<ApplicantWithScores>
  ) => {
    set((state) => ({ ...state, filteredApplicantList }));
  },
  setApplicantList: (applicantList: Array<ApplicantWithScores>) => {
    set((state) => ({ ...state, applicantList }));
  },
  setPublicationList: (publicationList: Array<Publication>) => {
    set((state) => ({ ...state, publicationList }));
  },
  setFilteredPublicationList: (filteredPublicationList: Array<Publication>) => {
    set((state) => ({ ...state, filteredPublicationList }));
  },
  setPublicationDetails: (publicationDetails: PublicationDetails) => {
    set((state) => ({ ...state, publicationDetails }));
  },
  setApplicantScores: (applicantScores: Array<PsbScores>) => {
    set((state) => ({ ...state, applicantScores }));
  },
  setPendingPublicationList: (publicationList: Array<Publication>) => {
    set((state) => ({ ...state, publicationList }));
  },
  setFulfilledPublicationList: (
    fulfilledPublicationList: Array<Publication>
  ) => {
    set((state) => ({ ...state, fulfilledPublicationList }));
  },
  setTab: (tab: number) => {
    set((state) => ({ ...state, tab }));
  },
  setIsLoading: (isLoading: boolean) => {
    set((state) => ({ ...state, isLoading }));
  },
}));
