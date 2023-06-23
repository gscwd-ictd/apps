/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { ModalState, ErrorState } from '../types/modal.type';
import {
  ApplicantWithScores,
  PsbScores,
  Ranking,
} from '../types/selection.type';
import { Publication, PublicationDetails } from '../types/publication.type';
import { AlertState } from '../types/alert.type';
import { devtools } from 'zustand/middleware';
import { Applicant } from '../types/applicant.type';
import { Pds } from 'apps/pds/src/store/pds.store';

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

type ApplicantDetails = Pick<Applicant, 'applicantId' | 'applicantType'>;

export type SelectionState = {
  response: {
    patchResponseApply: any;
  };
  loading: {
    loadingPublicationList: boolean;
    loadingPendingPublicationList: boolean;
    loadingFulfilledPublicationList: boolean;
    loadingResponse: boolean;
  };
  errors: {
    errorPublicationList: string;
    errorPendingPublicationList: string;
    errorFulfilledPublicationList: string;
    errorResponse: string;
  };

  getPublicationList: (loading: boolean) => void;
  getPublicationListSuccess: (loading: boolean, response) => void;
  getPublicationListFail: (loading: boolean, error: string) => void;

  getPendingPublicationList: (loading: boolean) => void;
  getPendingPublicationListSuccess: (loading: boolean, response) => void;
  getPendingPublicationListFail: (loading: boolean, error: string) => void;

  getFulfilledPublicationList: (loading: boolean) => void;
  getFulfilledPublicationListSuccess: (loading: boolean, response) => void;
  getFulfilledPublicationListFail: (loading: boolean, error: string) => void;

  patchPublication: () => void;
  patchPublicationSuccess: (response: Publication) => void;
  patchPublicationFail: (error: string) => void;

  appSelectionModalIsOpen: boolean;
  setAppSelectionModalIsOpen: (appSelectionModalIsOpen: boolean) => void;
  pds: Pds;
  setPds: (pds: Pds) => void;
  alert: AlertState;
  setAlert: (alert: AlertState) => void;
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  action: string;
  setAction: (value: string) => void;
  error: ErrorState;
  setError: (error: ErrorState) => void;
  publicationList: Array<Publication>;
  // setPublicationList: (publications: Array<Publication>) => void;
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
  selectedApplicantDetails: ApplicantDetails;
  setSelectedApplicantDetails: (
    selectedApplicantDetails: ApplicantDetails
  ) => void;
  publicationDetails: PublicationDetails;
  setPublicationDetails: (publicationDetails: PublicationDetails) => void;
  applicantScores: Array<PsbScores>;
  setApplicantScores: (applicantScores: Array<PsbScores>) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  pendingPublicationList: Array<Publication>;
  fulfilledPublicationList: Array<Publication>;
  tab: number;
  setTab: (tab: number) => void;
  emptyResponseAndError: () => void;
};

export const useAppSelectionStore = create<SelectionState>()(
  devtools((set) => ({
    response: {
      patchResponseApply: {},
    },
    loading: {
      loadingPublicationList: false,
      loadingPendingPublicationList: false,
      loadingFulfilledPublicationList: false,
      loadingResponse: false,
    },
    errors: {
      errorPublicationList: '',
      errorPendingPublicationList: '',
      errorFulfilledPublicationList: '',
      errorResponse: '',
    },
    selectedApplicantDetails: { applicantId: '', applicantType: '' },

    setSelectedApplicantDetails: (
      selectedApplicantDetails: ApplicantDetails
    ) => {
      set((state) => ({ ...state, selectedApplicantDetails }));
    },
    pds: {} as Pds,
    setPds: (pds: Pds) => {
      set((state) => ({ ...state, pds }));
    },

    appSelectionModalIsOpen: false,

    setAppSelectionModalIsOpen: (appSelectionModalIsOpen: boolean) => {
      set((state) => ({ ...state, appSelectionModalIsOpen }));
    },

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
    // setPublicationList: (publicationList: Array<Publication>) => {
    //   set((state) => ({ ...state, publicationList }));
    // },
    // setFilteredPublicationList: (
    //   filteredPublicationList: Array<Publication>
    // ) => {
    //   set((state) => ({ ...state, filteredPublicationList }));
    // },
    setPublicationDetails: (publicationDetails: PublicationDetails) => {
      set((state) => ({ ...state, publicationDetails }));
    },
    setApplicantScores: (applicantScores: Array<PsbScores>) => {
      set((state) => ({ ...state, applicantScores }));
    },
    // setPendingPublicationList: (publicationList: Array<Publication>) => {
    //   set((state) => ({ ...state, publicationList }));
    // },
    // setFulfilledPublicationList: (
    //   fulfilledPublicationList: Array<Publication>
    // ) => {
    //   set((state) => ({ ...state, fulfilledPublicationList }));
    // },
    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },
    setIsLoading: (isLoading: boolean) => {
      set((state) => ({ ...state, isLoading }));
    },

    //GET PUBLICATION LIST (ALL) ACTIONS
    getPublicationList: (loading: boolean) => {
      set((state) => ({
        ...state,
        publicationList: [],

        loading: {
          ...state.loading,
          loadingPublicationList: loading,
        },
        errors: {
          ...state.errors,
          errorPublicationList: '',
        },
      }));
    },
    getPublicationListSuccess: (
      loading: boolean,
      response: Array<Publication>
    ) => {
      set((state) => ({
        ...state,
        publicationList: response,
        loading: {
          ...state.loading,
          loadingPublicationList: loading,
        },
      }));
    },
    getPublicationListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPublicationList: loading,
        },
        errors: {
          ...state.errors,
          errorPublicationList: error,
        },
      }));
    },

    //GET PENDING PUBLICATION LIST ACTIONS
    getPendingPublicationList: (loading: boolean) => {
      set((state) => ({
        ...state,
        pendingPublicationList: [],

        loading: {
          ...state.loading,
          loadingPendingPublicationList: loading,
        },
        errors: {
          ...state.errors,
          errorPendingPublicationList: '',
        },
      }));
    },
    getPendingPublicationListSuccess: (
      loading: boolean,
      response: Array<Publication>
    ) => {
      set((state) => ({
        ...state,
        pendingPublicationList: response,
        loading: {
          ...state.loading,
          loadingPendingPublicationList: false,
        },
      }));
    },
    getPendingPublicationListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPendingPublicationList: loading,
        },
        errors: {
          ...state.errors,
          errorPendingPublicationList: error,
        },
      }));
    },

    //GET FULFILLED PUBLICATION LIST ACTIONS
    getFulfilledPublicationList: (loading: boolean) => {
      set((state) => ({
        ...state,
        fulfilledPublicationList: [],

        loading: {
          ...state.loading,
          loadingFulfilledPublicationList: loading,
        },
        errors: {
          ...state.errors,
          errorFulfilledPublicationList: '',
        },
      }));
    },
    getFulfilledPublicationListSuccess: (
      loading: boolean,
      response: Array<Publication>
    ) => {
      set((state) => ({
        ...state,
        fulfilledPublicationList: response,
        loading: {
          ...state.loading,
          loadingFulfilledPublicationList: false,
        },
      }));
    },
    getFulfilledPublicationListFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingFulfilledPublicationList: loading,
        },
        errors: {
          ...state.errors,
          errorFulfilledPublicationList: error,
        },
      }));
    },

    //PATCH SLECTION
    patchPublication: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseApply: {},
        },
        loading: {
          ...state.loading,
          loadingResponse: true,
        },
        errors: {
          ...state.errors,
          errorResponse: '',
        },
      }));
    },
    patchPublicationSuccess: (response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseApply: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    patchPublicationFail: (error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
        errors: {
          ...state.errors,
          errorResponse: error,
        },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponseApply: {},
        },
        error: {
          ...state.error,
          errorPublicationList: '',
          errorPendingPublicationList: '',
          errorFulfilledPublicationList: '',
          errorResponse: '',
        },
      }));
    },
  }))
);
