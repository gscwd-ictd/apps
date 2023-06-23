/* eslint-disable @nx/enforce-module-boundaries */
import { create } from 'zustand';
import { AlertState } from '../types/alert.type';
import { Applicant, PostingApplicantId } from '../types/applicant.type';
import { ErrorState, ModalState } from '../types/modal.type';
import { Publication } from '../types/publication.type';
import { devtools } from 'zustand/middleware';
import { Pds } from 'apps/pds/src/store/pds.store';

type PublicationLoading = {
  loadingPendingPublications: boolean;
  loadingFulfilledPublications: boolean;
  loadingPublications: boolean;
  loadingPublication: boolean;
};

type PublicationError = {
  errorPendingPublications: string;
  errorFulfilledPublications: string;
  errorPublications: string;
  errorPublication: string;
};

type PublicationShortList = Pick<Publication, 'vppId'> & PostingApplicantId;

type ApplicantDetails = Pick<Applicant, 'applicantId' | 'applicantType'>;

type PublicationResponse = {
  updateResponse: Array<PublicationShortList>;
};

export const PUBLICATION: Publication = {
  vppId: '',
  postingDate: null,
  postingDeadline: null,
  positionId: '',
  positionTitle: '',
  itemNumber: '',
  numberOfPositions: undefined,
  salaryGradeLevel: undefined,
  salaryGrade: '',
  annualSalary: '',
  education: '',
  training: '',
  eligibility: '',
  experience: '',
  placeOfAssignment: '',
  occupationName: '',
  prfNo: '',
  prfId: '',
  withExam: 0,
  postingStatus: null,
};

export type EndorsementState = {
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
  showPds: boolean;
  setShowPds: (showPds: boolean) => void;
  selectedPublicationId: string;
  setSelectedPublicationId: (value: string) => void;
  selectedPublication: Publication;
  setSelectedPublication: (publication: Publication) => void;
  selectedApplicantDetails: ApplicantDetails;
  setSelectedApplicantDetails: (
    selectedApplicantDetails: ApplicantDetails
  ) => void;
  applicantList: Array<Applicant>;
  setApplicantList: (applicants: Array<Applicant>) => void;
  filteredApplicantList: Array<Applicant>;
  setFilteredApplicantList: (applicants: Array<Applicant>) => void;
  publicationList: Array<Publication>;
  setPublicationList: (publications: Array<Publication>) => void;
  filteredPublicationList: Array<Publication>;
  setFilteredPublicationList: (publications: Array<Publication>) => void;
  selectedApplicants: Array<Applicant>;
  setSelectedApplicants: (value: Array<Applicant>) => void;
  pendingIsLoaded: boolean;
  setPendingIsLoaded: (pendingIsLoaded: boolean) => void;
  fulfilledIsLoaded: boolean;
  setFulfilledIsLoaded: (fulfilledIsLoaded: boolean) => void;
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

  // new

  publicationLoading: PublicationLoading;
  publicationResponse: PublicationResponse;
  publicationError: PublicationError;

  getPendingPublications: () => void;
  getPendingPublicationsSuccess: (response: Array<Publication>) => void;
  getPendingPublicationsFail: (error: string) => void;

  getFulfilledPublications: () => void;
  getFulfilledPublicationsSuccess: (response: Array<Publication>) => void;
  getFulfilledPublicationsFail: (error: string) => void;

  getPublications: () => void;
  getPublicationsSuccess: (response: Array<Publication>) => void;
  getPublicationsFail: (error: string) => void;

  updatePublication: () => void;
  updatePublicationSuccess: (response: Array<PublicationShortList>) => void;
  updatePublicationFail: (error: string) => void;

  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  emptyResponseAndError: () => void;
};

export const useAppEndStore = create<EndorsementState>()(
  devtools((set) => ({
    pds: {} as Pds,
    alert: { isOpen: false, page: 1 },
    modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
    action: '',
    error: { isError: false, errorMessage: '' },
    selectedPublicationId: '',
    selectedPublication: {} as Publication,
    applicantList: [],
    publicationList: [],
    filteredApplicantList: [],
    filteredPublicationList: [],
    selectedApplicants: [],
    pendingIsLoaded: false,
    fulfilledIsLoaded: false,
    isLoading: false,
    pendingPublicationList: [],
    fulfilledPublicationList: [],
    showPds: false,
    publicationError: {
      errorFulfilledPublications: '',
      errorPendingPublications: '',
      errorPublications: '',
      errorPublication: '',
    },
    publicationLoading: {
      loadingPendingPublications: false,
      loadingFulfilledPublications: false,
      loadingPublications: false,
      loadingPublication: false,
    },
    publicationResponse: { updateResponse: [] },

    searchValue: '',
    selectedApplicantDetails: {} as ApplicantDetails,

    tab: 1,

    setPds: (pds: Pds) => {
      set((state) => ({ ...state, pds }));
    },

    setShowPds: (showPds: boolean) => {
      set((state) => ({ ...state, showPds }));
    },

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
    setApplicantList: (applicantList: Array<Applicant>) => {
      set((state) => ({ ...state, applicantList }));
    },
    setPublicationList: (publicationList: Array<Publication>) => {
      set((state) => ({ ...state, publicationList }));
    },
    setFilteredApplicantList: (filteredApplicantList: Array<Applicant>) => {
      set((state) => ({ ...state, filteredApplicantList }));
    },
    setFilteredPublicationList: (
      filteredPublicationList: Array<Publication>
    ) => {
      set((state) => ({ ...state, filteredPublicationList }));
    },
    setSelectedApplicants: (selectedApplicants: Array<Applicant>) => {
      set((state) => ({ ...state, selectedApplicants }));
    },
    setPendingIsLoaded: (pendingIsLoaded: boolean) => {
      set((state) => ({ ...state, pendingIsLoaded }));
    },
    setFulfilledIsLoaded: (fulfilledIsLoaded: boolean) => {
      set((state) => ({ ...state, fulfilledIsLoaded }));
    },
    setIsLoading: (isLoading: boolean) => {
      set((state) => ({ ...state, isLoading }));
    },
    setPendingPublicationList: (pendingPublicationList: Array<Publication>) => {
      set((state) => ({ ...state, pendingPublicationList }));
    },
    setFulfilledPublicationList: (
      fulfilledPublicationList: Array<Publication>
    ) => {
      set((state) => ({ ...state, fulfilledPublicationList }));
    },
    setTab: (tab: number) => {
      set((state) => ({ ...state, tab }));
    },

    setSelectedApplicantDetails: (
      selectedApplicantDetails: ApplicantDetails
    ) => {
      set((state) => ({ ...state, selectedApplicantDetails }));
    },

    getPendingPublications: () =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingPendingPublications: true,
        },
        pendingPublicationList: [],
        publicationError: {
          ...state.publicationError,
          errorPendingPublications: '',
        },
      })),

    getPendingPublicationsSuccess: (response: Array<Publication>) =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingPendingPublications: false,
        },
        pendingPublicationList: response,
      })),

    getPendingPublicationsFail: (error: string) =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingPendingPublications: false,
        },
        publicationError: {
          ...state.publicationError,
          errorPendingPublications: error,
        },
      })),

    getFulfilledPublications: () =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingFulfilledPublications: true,
        },
        fulfilledPublicationList: [],
        publicationError: {
          ...state.publicationError,
          errorFulfilledPublications: '',
        },
      })),

    getFulfilledPublicationsSuccess: (response: Array<Publication>) =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingFulfilledPublications: false,
        },
        fulfilledPublicationList: response,
      })),

    getFulfilledPublicationsFail: (error: string) =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingFulfilledPublications: false,
        },
        publicationError: {
          ...state.publicationError,
          errorFulfilledPublications: error,
        },
      })),

    getPublications: () =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingPublications: true,
        },
        publicationList: [],
        filteredPublicationList: [],
        publicationError: { ...state.publicationError, errorPublications: '' },
      })),

    getPublicationsSuccess: (response: Array<Publication>) =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingPublications: false,
        },
        publicationList: response,
        filteredPublicationList: response,
      })),

    getPublicationsFail: (error: string) =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingPublications: false,
        },
        publicationError: {
          ...state.publicationError,
          errorPublications: error,
        },
      })),

    updatePublication: () =>
      set((state) => ({
        ...state,
        publicationResponse: {
          ...state.publicationResponse,
          updateResponse: [],
        },
        publicationLoading: {
          ...state.publicationLoading,
          loadingPublication: true,
        },
        publicationError: { ...state.publicationError, errorPublication: '' },
      })),

    updatePublicationSuccess: (response: Array<PublicationShortList>) =>
      set((state) => ({
        ...state,
        publicationResponse: { updateResponse: response },
        publicationLoading: {
          ...state.publicationLoading,
          loadingPublication: false,
        },
      })),

    updatePublicationFail: (error: string) =>
      set((state) => ({
        ...state,
        publicationLoading: {
          ...state.publicationLoading,
          loadingPublication: false,
        },
        publicationError: {
          ...state.publicationError,
          errorPublication: error,
        },
      })),

    setSearchValue: (searchValue: string) =>
      set((state) => ({ ...state, searchValue })),

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,

        publicationError: {
          errorFulfilledPublications: '',
          errorPendingPublications: '',
          errorPublications: '',
          errorPublication: '',
        },
        publicationResponse: { updateResponse: [] },
      }));
    },
  }))
);
