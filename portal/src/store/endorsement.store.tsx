import create from "zustand";
import { AlertState } from "../types/alert.type";
import { Applicant } from "../types/applicant.type";
import { ErrorState, ModalState } from "../types/modal.type";
import { Publication } from "../types/publication.type";

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
    postingStatus: '',
};


export type EndorsementState = {
    alert: AlertState
    setAlert: (alert: AlertState) => void
    modal: ModalState;
    setModal: (modal: ModalState) => void;
    action: string
    setAction: (value: string) => void
    error: ErrorState
    setError: (error: ErrorState) => void;
    selectedPublicationId: string
    setSelectedPublicationId: (value: string) => void
    selectedPublication: Publication;
    setSelectedPublication: (publication: Publication) => void
    applicantList: Array<Applicant>
    setApplicantList: (applicants: Array<Applicant>) => void
    filteredApplicantList: Array<Applicant>
    setFilteredApplicantList: (applicants: Array<Applicant>) => void
    publicationList: Array<Publication>
    setPublicationList: (publications: Array<Publication>) => void
    filteredPublicationList: Array<Publication>
    setFilteredPublicationList: (publications: Array<Publication>) => void
    selectedApplicants: Array<Applicant>
    setSelectedApplicants: (value: Array<Applicant>) => void
    pendingIsLoaded: boolean
    setPendingIsLoaded: (pendingIsLoaded: boolean) => void
    fulfilledIsLoaded: boolean
    setFulfilledIsLoaded: (fulfilledIsLoaded: boolean) => void
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    pendingPublicationList: Array<Publication>
    setPendingPublicationList: (pendingPublicationList: Array<Publication>) => void
    fulfilledPublicationList: Array<Publication>
    setFulfilledPublicationList: (fulfilledPublicationList: Array<Publication>) => void
    tab: number
    setTab: (tab: number) => void
}

export const useAppEndStore = create<EndorsementState>((set) => ({
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
    tab: 1,
    setAlert: (alert: AlertState) => {
        set((state) => ({ ...state, alert }))
    },
    setModal: (modal: ModalState) => {
        set((state) => ({ ...state, modal }));
    },
    setAction: (action: string) => {
        set((state) => ({ ...state, action }))
    },
    setError: (error: ErrorState) => {
        set((state) => ({ ...state, error }))
    },
    setSelectedPublicationId: (selectedPublicationId: string) => {
        set((state) => ({ ...state, selectedPublicationId }))
    },
    setSelectedPublication: (selectedPublication: Publication) => {
        set((state) => ({ ...state, selectedPublication }))
    },
    setApplicantList: (applicantList: Array<Applicant>) => {
        set((state) => ({ ...state, applicantList }))
    },
    setPublicationList: (publicationList: Array<Publication>) => {
        set((state) => ({ ...state, publicationList }))
    },
    setFilteredApplicantList: (filteredApplicantList: Array<Applicant>) => {
        set((state) => ({ ...state, filteredApplicantList }))
    },
    setFilteredPublicationList: (filteredPublicationList: Array<Publication>) => {
        set((state) => ({ ...state, filteredPublicationList }))
    },
    setSelectedApplicants: (selectedApplicants: Array<Applicant>) => {
        set((state) => ({ ...state, selectedApplicants }))
    },
    setPendingIsLoaded: (pendingIsLoaded: boolean) => {
        set((state) => ({ ...state, pendingIsLoaded }))
    },
    setFulfilledIsLoaded: (fulfilledIsLoaded: boolean) => {
        set((state) => ({ ...state, fulfilledIsLoaded }))
    },
    setIsLoading: (isLoading: boolean) => {
        set((state) => ({ ...state, isLoading }))
    },
    setPendingPublicationList: (pendingPublicationList: Array<Publication>) => {
        set((state) => ({ ...state, pendingPublicationList }))
    },
    setFulfilledPublicationList: (fulfilledPublicationList: Array<Publication>) => {
        set((state) => ({ ...state, fulfilledPublicationList }))
    },
    setTab: (tab: number) => {
        set((state) => ({ ...state, tab }))
    }
}))