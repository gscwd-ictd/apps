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

// type ApplicantDetails = Pick<
//   Applicant,
//   'applicantId' | 'applicantType' | 'postingApplicantId' | 'applicantName'
// >;
type ApplicantDetails = {
  applicantId: string;
  applicantType: string;
  postingApplicantId: string;
  applicantName: string;
  applicantAvgScore: string;
  positionTitle: string;
  rank: string;
};

type PsbDetails = {
  psbNo: number;
  psbName: string;
  score: string;
  remarks: string;
};

export type SelectionState = {
  response: {
    patchResponseApply: any;
  };
  loading: {
    loadingPublicationList: boolean;
    loadingPendingPublicationList: boolean;
    loadingFulfilledPublicationList: boolean;
    loadingResponse: boolean;
    loadingPsbDetails: boolean;
  };
  errors: {
    errorPublicationList: string;
    errorPendingPublicationList: string;
    errorFulfilledPublicationList: string;
    errorResponse: string;
    errorPsbDetails: string;
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

  getPsbDetails: () => void;
  getPsbDetailsSuccess: (
    response: Array<PsbDetails>,
    applicantList: Array<ApplicantWithScores>,
    applicantDetails: ApplicantDetails
  ) => void;
  getPsbDetailsFail: (error: string) => void;
  psbDetails: Array<PsbDetails>;
  setPsbDetails: (psbDetails: Array<PsbDetails>) => void;

  pds: Pds;
  setPds: (pds: Pds) => void;
  showPdsAlert: boolean;
  setShowPdsAlert: (showPdsAlert: boolean) => void;
  showPsbDetailsAlert: boolean;
  setShowPsbDetailsAlert: (showPsbDetailsAlert: boolean) => void;
  alertConfirmationIsOpen: boolean;
  setAlertConfirmationIsOpen: (alertConfirmation: boolean) => void;
  alertInfoIsOpen: boolean;
  setAlertInfoIsOpen: (alertInfoIsOpen: boolean) => void;
  errorPatch: boolean;
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  action: string;
  setAction: (value: string) => void;
  error: ErrorState;
  setError: (error: ErrorState) => void;
  publicationList: Array<Publication>;
  dropdownAction: string;
  setDropdownAction: (dropdownAction: string) => void;
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
    filteredPublicationList: Array<Publication>
  ) => void;
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
  filteredValue: string;
  setFilteredValue: (filteredValue: string) => void;
};

export const useAppSelectionStore = create<SelectionState>()(
  devtools((set) => ({
    filteredValue: '',
    setFilteredValue: (filteredValue: string) =>
      set((state) => ({ ...state, filteredValue })),
    response: {
      patchResponseApply: {},
    },
    loading: {
      loadingPublicationList: false,
      loadingPendingPublicationList: false,
      loadingFulfilledPublicationList: false,
      loadingResponse: false,
      loadingPsbDetails: false,
    },
    errors: {
      errorPublicationList: '',
      errorPendingPublicationList: '',
      errorFulfilledPublicationList: '',
      errorResponse: '',
      errorPsbDetails: '',
    },
    selectedApplicantDetails: {
      applicantId: '',
      applicantType: '',
      postingApplicantId: '',
      applicantName: '',
      applicantAvgScore: '',
      positionTitle: '',
      rank: '',
    },
    setSelectedApplicantDetails: (
      selectedApplicantDetails: ApplicantDetails
    ) => {
      set((state) => ({ ...state, selectedApplicantDetails }));
    },
    showPdsAlert: false,
    setShowPdsAlert: (showPdsAlert: boolean) =>
      set((state) => ({ ...state, showPdsAlert })),
    dropdownAction: '',
    setDropdownAction: (dropdownAction: string) =>
      set((state) => ({ ...state, dropdownAction })),

    psbDetails: [],
    setPsbDetails: (psbDetails: Array<PsbDetails>) =>
      set((state) => ({ ...state, psbDetails })),

    getPsbDetails: () =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPsbDetails: true },
        psbDetails: [],
        errors: { ...state.errors, errorPsbDetails: '' },
      })),

    getPsbDetailsSuccess: (
      response: Array<PsbDetails>,
      applicantList: Array<ApplicantWithScores>,
      applicantDetails: ApplicantDetails
    ) => {
      const filteredApplicant = applicantList.find(
        (applicant) =>
          applicant.postingApplicantId === applicantDetails.postingApplicantId
      );
      response &&
        response.map((psb) => {
          if (psb.psbNo === 1) psb.score = filteredApplicant.psb_1;
          if (psb.psbNo === 2) psb.score = filteredApplicant.psb_2;
          if (psb.psbNo === 3) psb.score = filteredApplicant.psb_3;
          if (psb.psbNo === 4) psb.score = filteredApplicant.psb_4;
          if (psb.psbNo === 5) psb.score = filteredApplicant.psb_5;
          if (psb.psbNo === 6) psb.score = filteredApplicant.psb_6;
          if (psb.psbNo === 7) psb.score = filteredApplicant.psb_7;
          if (psb.psbNo === 8) psb.score = filteredApplicant.psb_8;
        });

      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPsbDetails: false },
        psbDetails: response,
      }));
    },

    getPsbDetailsFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPsbDetails: false },
        errors: { ...state.errors, errorPsbDetails: error },
      })),

    pds: {} as Pds,
    setPds: (pds: Pds) => {
      set((state) => ({ ...state, pds }));
    },
    showPsbDetailsAlert: false,
    setShowPsbDetailsAlert: (showPsbDetailsAlert: boolean) =>
      set((state) => ({ ...state, showPsbDetailsAlert })),

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
    alertConfirmationIsOpen: false,
    alertInfoIsOpen: false,
    errorPatch: false,
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
    setFilteredPublicationList: (
      filteredPublicationList: Array<Publication>
    ) => {
      set((state) => ({ ...state, filteredPublicationList }));
    },
    setPublicationDetails: (publicationDetails: PublicationDetails) => {
      set((state) => ({ ...state, publicationDetails }));
    },
    setApplicantScores: (applicantScores: Array<PsbScores>) => {
      set((state) => ({ ...state, applicantScores }));
    },

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
        filteredPublicationList: response,
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
        errorPatch: false,
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
        errorPatch: false,
        alertConfirmationIsOpen: false,
        alertInfoIsOpen: true,
        modal: { ...state.modal, isOpen: false },
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
        errorPatch: true,
        alertConfirmationIsOpen: false,
        alertInfoIsOpen: true,
      }));
    },

    setAlertConfirmationIsOpen: (alertConfirmationIsOpen: boolean) =>
      set((state) => ({ ...state, alertConfirmationIsOpen })),

    setAlertInfoIsOpen: (alertInfoIsOpen: boolean) =>
      set((state) => ({ ...state, alertInfoIsOpen })),

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
