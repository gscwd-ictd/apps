import { create } from 'zustand';
import { PrfDetails, Position, ForApprovalPrf, PrfTrail, PrfDetailsForApproval } from '../types/prf.types';
import { devtools } from 'zustand/middleware';
import { Competencies, JobDescription, QualificationStandards } from '../types/vacancies.type';

export type PrfError = {
  status: boolean;
  message: string;
};

type FilteredCompetencies = Pick<Competencies, 'core' | 'crossCutting' | 'functional' | 'managerial'>;

export type PositionDutyResponsibilities = {
  duties: {
    core: Array<{ competency: string; description: string; domain: string; level: string; percentage: string }>;
    support: Array<{ competency: string; description: string; domain: string; level: string; percentage: string }>;
  };
  positionId: string;
  summary: string;
};

export type PrfState = {
  response: {
    patchResponse: any;
    getPrfResponse: PrfDetails; //single get prf
    getPrfTrailResponse: PrfTrail; //single prf trail
    getPrfForApprovalResponse: PrfDetailsForApproval; // single prf for approval
    getPositionJdResponse: JobDescription;
    getPositionDrcResponse: PositionDutyResponsibilities;
    getPositionQsResponse: QualificationStandards;
    getPositionPlResponse: FilteredCompetencies;
  };

  loading: {
    loadingResponse: boolean; //for patch
    loadingPrf: boolean; // single prf
    loadingPrfTrail: boolean; //single prf trail
    loadingForApprovalList: boolean;
    loadingPendingList: boolean;
    loadingDisapprovedList: boolean;
    loadingCancelledList: boolean;
    loadingPositionJd: boolean;
    loadingPositionDrc: boolean;
    loadingPositionQs: boolean;
    loadingPositionPl: boolean;
  };

  errors: {
    errorResponse: string; // for patch error
    errorPrf: string; //single get prf error
    errorPrfTrail: string; //single prf trail error
    errorForApprovalList: string;
    errorPendingList: string;
    errorDisapprovedList: string;
    errorCancelledList: string;
    errorPositionJd: string;
    errorPositionDrc: string;
    errorPositionQs: string;
    errorPositionPl: string;
  };

  patchPrf: () => void;
  patchPrfSuccess: (response) => void;
  patchPrfFail: (error: string) => void;

  getPrfDetails: (loading: boolean) => void;
  getPrfDetailsSuccess: (loading: boolean, response) => void;
  getPrfDetailsFail: (loading: boolean, error: string) => void;

  getPrfTrail: (loading: boolean) => void;
  getPrfTrailSuccess: (loading: boolean, response) => void;
  getPrfTrailFail: (loading: boolean, error: string) => void;

  getPrfDetailsForApproval: (loading: boolean) => void;
  getPrfDetailsForApprovalSuccess: (loading: boolean, response) => void;
  getPrfDetailsForApprovalFail: (loading: boolean, error: string) => void;

  getPositionJobDescription: (loading: boolean) => void;
  getPositionJobDescriptionSuccess: (loading: boolean, response) => void;
  getPositionJobDescriptionFail: (loading: boolean, error: string) => void;

  getPositionDuties: (loading: boolean) => void;
  getPositionDutiesSuccess: (loading: boolean, response) => void;
  getPositionDutiesFail: (loading: boolean, error: string) => void;

  getPositionQualificationStandards: (loading: boolean) => void;
  getPositionQualificationStandardsSuccess: (loading: boolean, response) => void;
  getPositionQualificationStandardsFail: (loading: boolean, error: string) => void;

  getPositionCompetencies: (loading: boolean) => void;
  getPositionCompetenciesSuccess: (loading: boolean, response) => void;
  getPositionCompetenciesFail: (loading: boolean, error: string) => void;

  pendingPrfs: Array<PrfDetails>;
  forApprovalPrfs: Array<ForApprovalPrf>;
  disapprovedPrfs: Array<PrfDetails>;
  cancelledPrfs: Array<PrfDetails>;

  getPrfDetailsForApprovalList: (loading: boolean) => void;
  getPrfDetailsForApprovalListSuccess: (loading: boolean, response) => void;
  getPrfDetailsForApprovalListFail: (loading: boolean, error: string) => void;

  getPrfDetailsPendingList: (loading: boolean) => void;
  getPrfDetailsPendingListSuccess: (loading: boolean, response) => void;
  getPrfDetailsPendingListFail: (loading: boolean, error: string) => void;

  getPrfDetailsDisapprovedList: (loading: boolean) => void;
  getPrfDetailsDisapprovedListSuccess: (loading: boolean, response) => void;
  getPrfDetailsDisapprovedListFail: (loading: boolean, error: string) => void;

  getPrfDetailsCancelledList: (loading: boolean) => void;
  getPrfDetailsCancelledListSuccess: (loading: boolean, response) => void;
  getPrfDetailsCancelledListFail: (loading: boolean, error: string) => void;

  pendingPrfModalIsOpen: boolean;
  setPendingPrfModalIsOpen: (pendingPrfModalIsOpen: boolean) => void;
  forApprovalPrfModalIsOpen: boolean;
  setForApprovalPrfModalIsOpen: (forApprovalPrfModalIsOpen: boolean) => void;
  disapprovedPrfModalIsOpen: boolean;
  setDisapprovedPrfModalIsOpen: (disapprovedPrfModalIsOpen: boolean) => void;
  cancelledPrfModalIsOpen: boolean;
  setCancelledPrfModalIsOpen: (cancelledPrfModalIsOpen: boolean) => void;
  viewPositionModalIsOpen: boolean;
  setViewPositionModalIsOpen: (viewPositionModalIsOpen: boolean) => void;

  selectedPrfId: string;
  setSelectedPrfId: (selectedPrfId: string) => void;

  error: PrfError;
  isModalOpen: boolean;
  modalPage: number;
  positions: Array<Position>;
  selectedPositions: Array<Position>;
  filteredPositions: Array<Position>;
  withExam: boolean;

  activeItem: number;
  setError: (error: PrfError) => void;
  setIsModalOpen: (state: boolean) => void;
  setModalPage: (currentPage: number) => void;
  setPositions: (positions: Array<Position>) => void;
  setSelectedPositions: (positions: Array<Position>) => void;
  setFilteredPositions: (positions: Array<Position>) => void;
  updatePositions: (positions: Array<Position>, sequenceNo: number) => void;
  setWithExam: (state: boolean) => void;
  setPendingPrfs: (pendingPrfs: Array<PrfDetails>) => void;
  setForApprovalPrfs: (forApprovalPrs: Array<ForApprovalPrf>) => void;
  setDisapprovedPrfs: (disapprovedPrfs: Array<PrfDetails>) => void;
  setActiveItem: (activeItem: number) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  prfOtpModalIsOpen: boolean;
  setPrfOtpModalIsOpen: (prfOtpModalIsOpen: boolean) => void;

  prfConfirmModalIsOpen: boolean;
  setPrfConfirmModalIsOpen: (prfConfirmModalIsOpen: boolean) => void;

  selectedPosition: Position;
  setSelectedPosition: (selectedPosition: Position) => void;

  emptyResponseAndError: () => void;
};

// export const usePrfStore = create<PrfState>((set) => ({
export const usePrfStore = create<PrfState>()(
  devtools((set) => ({
    response: {
      patchResponse: {} as any,
      getPrfResponse: {} as PrfDetails,
      getPrfTrailResponse: {} as PrfTrail,
      getPrfForApprovalResponse: {} as PrfDetailsForApproval,
      getPositionJdResponse: {} as JobDescription,
      getPositionDrcResponse: {} as any,
      getPositionQsResponse: {} as QualificationStandards,
      getPositionPlResponse: {} as FilteredCompetencies,
    },
    loading: {
      loadingResponse: false,
      loadingPrf: false,
      loadingPrfTrail: false,
      loadingForApprovalList: false,
      loadingPendingList: false,
      loadingDisapprovedList: false,
      loadingCancelledList: false,
      loadingPositionJd: false,
      loadingPositionDrc: false,
      loadingPositionQs: false,
      loadingPositionPl: false,
    },
    errors: {
      errorResponse: '',
      errorPrf: '',
      errorPrfTrail: '',
      errorForApprovalList: '',
      errorPendingList: '',
      errorDisapprovedList: '',
      errorCancelledList: '',
      errorPositionDrc: '',
      errorPositionJd: '',
      errorPositionPl: '',
      errorPositionQs: '',
    },

    pendingPrfModalIsOpen: false,
    forApprovalPrfModalIsOpen: false,
    disapprovedPrfModalIsOpen: false,
    cancelledPrfModalIsOpen: false,
    viewPositionModalIsOpen: false,

    selectedPosition: {} as Position,

    selectedPrfId: '',

    prfOtpModalIsOpen: false,

    prfConfirmModalIsOpen: false,

    error: { status: false, message: '' },

    isModalOpen: false,

    modalPage: 1,

    positions: [],

    selectedPositions: [],

    filteredPositions: [],

    withExam: false,

    pendingPrfs: [],

    forApprovalPrfs: [],

    disapprovedPrfs: [],

    cancelledPrfs: [],

    activeItem: 0,

    isLoading: false,

    setSelectedPosition: (selectedPosition: Position) => set((state) => ({ ...state, selectedPosition })),

    setViewPositionModalIsOpen: (viewPositionModalIsOpen: boolean) => {
      set((state) => ({ ...state, viewPositionModalIsOpen }));
    },

    setCancelledPrfModalIsOpen: (cancelledPrfModalIsOpen: boolean) => {
      set((state) => ({ ...state, cancelledPrfModalIsOpen }));
    },

    setPendingPrfModalIsOpen: (pendingPrfModalIsOpen: boolean) => {
      set((state) => ({ ...state, pendingPrfModalIsOpen }));
    },

    setForApprovalPrfModalIsOpen: (forApprovalPrfModalIsOpen: boolean) => {
      set((state) => ({ ...state, forApprovalPrfModalIsOpen }));
    },

    setDisapprovedPrfModalIsOpen: (disapprovedPrfModalIsOpen: boolean) => {
      set((state) => ({ ...state, disapprovedPrfModalIsOpen }));
    },

    setSelectedPrfId: (selectedPrfId: string) => {
      set((state) => ({ ...state, selectedPrfId }));
    },

    setPrfOtpModalIsOpen: (prfOtpModalIsOpen: boolean) => {
      set((state) => ({ ...state, prfOtpModalIsOpen }));
    },

    setPrfConfirmModalIsOpen: (prfConfirmModalIsOpen: boolean) => {
      set((state) => ({ ...state, prfConfirmModalIsOpen }));
    },

    setIsLoading: (isLoading: boolean) => {
      set((state) => ({ ...state, isLoading }));
    },

    setError: (error: PrfError) => {
      set((state) => ({ ...state, error }));
    },

    setIsModalOpen: (isModalOpen: boolean) => {
      set((state) => ({ ...state, isModalOpen }));
    },

    setModalPage: (currentPage: number) => {
      set((state) => ({ ...state, modalPage: currentPage }));
    },

    setPositions: (positions: Array<Position>) => {
      // create a copy of positions array
      const allPositions = [...positions];

      // loop through the copied array
      allPositions.map((position: Position, index: number) => {
        // set default value for selected state into false -> this is the basis for the checkbox
        position.isSelected = false;

        // set default value for position remarks to empty string
        position.remarks = '';

        // set the sequence number of this position to the current index
        position.sequenceNo = index;
      });

      set((state) => ({ ...state, positions: allPositions }));
    },

    setSelectedPositions: (positions: Array<Position>) => {
      // create an empty array to hold objects of selected positions
      const selectedPositions: Array<Position> = [];

      // loop through positions array
      positions.map((position: Position) => {
        // check if current position is selected. if yes, push to selected positions array
        if (position.isSelected) selectedPositions.push(position);
      });

      // set the new value for selected positions array
      set((state) => ({ ...state, selectedPositions }));
    },

    setFilteredPositions: (positions: Array<Position>) => {
      set((state) => ({ ...state, filteredPositions: positions }));
    },

    updatePositions: (positions: Array<Position>, sequenceNo: number) => {
      // create a copy of positions array
      const updatedPositions = [...positions];

      // loop throug this array
      updatedPositions.map((position: Position, arrIndex: number) => {
        // check current index is equal to the selected index
        if (sequenceNo === arrIndex) {
          // negate the current value of is selected
          position.isSelected = !position.isSelected;

          // set remarks to default value
          position.remarks = '';
        }
      });

      // set the new value
      set((state) => ({ ...state, positions: updatedPositions }));
    },

    setWithExam: (withExam: boolean) => {
      set((state) => ({ ...state, withExam }));
    },

    setPendingPrfs: (pendingPrfs: Array<PrfDetails>) => {
      set((state) => ({ ...state, pendingPrfs }));
    },

    setForApprovalPrfs: (forApprovalPrfs: Array<any>) => {
      set((state) => ({ ...state, forApprovalPrfs }));
    },

    setDisapprovedPrfs: (disapprovedPrfs: Array<any>) => {
      set((state) => ({ ...state, disapprovedPrfs }));
    },

    setActiveItem: (activeItem: number) => {
      set((state) => ({ ...state, activeItem }));
    },

    //PATCH PRF ACTIONS
    patchPrf: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponse: {},
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
    patchPrfSuccess: (response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponse: response,
        },
        loading: {
          ...state.loading,
          loadingResponse: false,
        },
      }));
    },
    patchPrfFail: (error: string) => {
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

    //GET PRF DETAILS - PENDING/DISAPPROVED
    getPrfDetails: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPrf: loading,
        },
        errors: {
          ...state.errors,
          errorPrf: '',
        },
      }));
    },
    getPrfDetailsSuccess: (loading: boolean, response: PrfDetails) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          getPrfResponse: response,
        },
        loading: {
          ...state.loading,
          loadingPrf: loading,
        },
      }));
    },
    getPrfDetailsFail: (loading: boolean, errors: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPrf: loading,
        },
        errors: {
          ...state.errors,
          errorPrf: errors,
        },
      }));
    },

    //GET PRF DETAILS INDIVIDUAL - FOR APPROVAL (MODAL)
    getPrfDetailsForApproval: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPrf: loading,
        },
        errors: {
          ...state.errors,
          errorPrf: '',
        },
      }));
    },
    getPrfDetailsForApprovalSuccess: (loading: boolean, response: PrfDetailsForApproval) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          getPrfForApprovalResponse: response,
        },
        loading: {
          ...state.loading,
          loadingPrf: loading,
        },
      }));
    },
    getPrfDetailsForApprovalFail: (loading: boolean, errors: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPrf: loading,
        },
        errors: {
          ...state.errors,
          errorPrf: errors,
        },
      }));
    },

    //GET PRF DETAILS LIST - FOR APPROVAL
    getPrfDetailsForApprovalList: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingForApprovalList: loading,
        },
        errors: {
          ...state.errors,
          errorForApprovalList: '',
        },
      }));
    },

    getPrfDetailsForApprovalListSuccess: (loading: boolean, response: Array<ForApprovalPrf>) => {
      set((state) => ({
        ...state,
        forApprovalPrfs: response,
        loading: {
          ...state.loading,
          loadingForApprovalList: loading,
        },
      }));
    },
    getPrfDetailsForApprovalListFail: (loading: boolean, errors: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingForApprovalList: loading,
        },
        errors: {
          ...state.errors,
          errorForApprovalList: errors,
        },
      }));
    },

    //GET PRF DETAILS LIST - PENDING
    getPrfDetailsPendingList: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPendingList: loading,
        },
        errors: {
          ...state.errors,
          errorPendingList: '',
        },
      }));
    },
    getPrfDetailsPendingListSuccess: (loading: boolean, response: Array<PrfDetails>) => {
      set((state) => ({
        ...state,
        pendingPrfs: response,
        loading: {
          ...state.loading,
          loadingPendingList: loading,
        },
      }));
    },
    getPrfDetailsPendingListFail: (loading: boolean, errors: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPendingList: loading,
        },
        errors: {
          ...state.errors,
          errorPendingList: errors,
        },
      }));
    },

    //GET PRF DETAILS LIST - DISAPPROVED
    getPrfDetailsDisapprovedList: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingDisapprovedList: loading,
        },
        errors: {
          ...state.errors,
          errorDisapprovedList: '',
        },
      }));
    },
    getPrfDetailsDisapprovedListSuccess: (loading: boolean, response: Array<PrfDetails>) => {
      set((state) => ({
        ...state,
        disapprovedPrfs: response,
        loading: {
          ...state.loading,
          loadingDisapprovedList: loading,
        },
      }));
    },
    getPrfDetailsDisapprovedListFail: (loading: boolean, errors: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingDisapprovedList: loading,
        },
        errors: {
          ...state.errors,
          errorDisapprovedList: errors,
        },
      }));
    },

    // GET PENDING PRF-LIST
    getPrfDetailsCancelledList: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingCancelledList: loading,
        },
        errors: {
          ...state.errors,
          errorCancelledList: '',
        },
      }));
    },
    getPrfDetailsCancelledListSuccess: (loading: boolean, response: Array<PrfDetails>) => {
      set((state) => ({
        ...state,
        cancelledPrfs: response,
        loading: {
          ...state.loading,
          loadingCancelledList: loading,
        },
      }));
    },
    getPrfDetailsCancelledListFail: (loading: boolean, errors: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingCancelledList: loading,
        },
        errors: {
          ...state.errors,
          errorCancelledList: errors,
        },
      }));
    },

    //GET PRF TRAIL
    getPrfTrail: (loading: boolean) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPrfTrail: loading,
        },
        errors: {
          ...state.errors,
          errorPrfTrail: '',
        },
      }));
    },
    getPrfTrailSuccess: (loading: boolean, response) => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          getPrfTrailResponse: response,
        },
        loading: {
          ...state.loading,
          loadingPrfTrail: loading,
        },
      }));
    },
    getPrfTrailFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: {
          ...state.loading,
          loadingPrfTrail: loading,
        },
        errors: {
          ...state.errors,
          errorPrfTrail: error,
        },
      }));
    },

    // GET POSITION JOB DESC
    getPositionJobDescription: (loading: boolean) => {
      set((state) => ({ ...state, loading: { ...state.loading, loadingPositionJd: loading } }));
    },

    getPositionJobDescriptionSuccess: (loading: boolean, response) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositionJd: loading },
        response: { ...state.response, getPositionJdResponse: response },
      }));
    },

    getPositionJobDescriptionFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositionJd: loading },
        errors: { ...state.errors, errorPositionJd: error },
      }));
    },

    // GET POSITION DUTIES
    getPositionDuties: (loading: boolean) => {
      set((state) => ({ ...state, loading: { ...state.loading, loadingPositionDrc: loading } }));
    },

    getPositionDutiesSuccess: (loading: boolean, response) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositionDrc: loading },
        response: { ...state.response, getPositionDrcResponse: response },
      }));
    },

    getPositionDutiesFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositionDrc: loading },
        errors: { ...state.errors, errorPositionDrc: error },
      }));
    },

    // GET POSITION QUALIFICATION STANDARDS
    getPositionQualificationStandards: (loading: boolean) => {
      set((state) => ({ ...state, loading: { ...state.loading, loadingPositionQs: loading } }));
    },

    getPositionQualificationStandardsSuccess: (loading: boolean, response) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositionQs: loading },
        response: { ...state.response, getPositionQsResponse: response },
      }));
    },

    getPositionQualificationStandardsFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositionQs: loading },
        errors: { ...state.errors, errorPositionQs: error },
      }));
    },

    // GET POSITION COMPETENCIES
    getPositionCompetencies: (loading: boolean) => {
      set((state) => ({ ...state, loading: { ...state.loading, loadingPositionPl: loading } }));
    },

    getPositionCompetenciesSuccess: (loading: boolean, response) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositionPl: loading },
        response: { ...state.response, getPositionPlResponse: response },
      }));
    },

    getPositionCompetenciesFail: (loading: boolean, error: string) => {
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingPositionPl: loading },
        errors: { ...state.errors, errorPositionPl: error },
      }));
    },

    emptyResponseAndError: () => {
      set((state) => ({
        ...state,
        response: {
          ...state.response,
          patchResponse: {},
          getPrfForApprovalResponse: {} as PrfDetailsForApproval,
          getPrfResponse: {} as PrfDetails,
          getPrfTrailResponse: {} as PrfTrail,
        },
        errors: {
          ...state.errors,
          errorResponse: '',
          errorPrf: '',
          errorPrfTrail: '',
          errorForApprovalList: '',
          errorPendingList: '',
          errorDisapprovedList: '',
        },
      }));
    },
  }))
);
