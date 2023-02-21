import create from 'zustand';
import { AlertState } from '../types/alert.type';
import { Competency, DutiesResponsibilities, DutiesResponsibilitiesList, DutyResponsibility, PositionDR, UpdatedDRCD } from '../types/dr.type';
import { ErrorState, ModalState } from '../types/modal.type';
import { Position } from '../types/position.type';

export const DUTIES_RESPONSIBILITIES: DutiesResponsibilities = {
    core: [],
    support: [],
};

export const DUTIES_RESPONSIBILITIES_LIST: DutiesResponsibilitiesList = {
    core: [],
    support: []
}

export const DUTIES_RESPONSIBILITIES_COMPETENCIES = {
    core: [],
    support: [],
    deleted: [],
};


export type FinishedPosition = Position & {
    updatedAt?: string | null
}

export type DRCState = {
    alert: AlertState
    setAlert: (alert: AlertState) => void
    modal: ModalState;
    setModal: (modal: ModalState) => void;
    action: string
    setAction: (value: string) => void
    error: ErrorState
    setError: (error: ErrorState) => void;
    allPositions: Array<Position>;
    setAllPositions: (positions: Array<Position>) => void;
    filteredPositions: Array<Position>;
    setFilteredPositions: (positions: Array<Position>) => void;
    selectedPosition: Position;
    setSelectedPosition: (position: Position) => void;
    searchValue: string;
    setSearchValue: (value: string) => void;
    searchDRCValue: string;
    setSearchDRCValue: (value: string) => void;
    selectedDRCs: DutiesResponsibilities;
    setSelectedDRCs: (drcs: DutiesResponsibilities) => void;
    filteredDRCs: Array<DutyResponsibility>;
    setFilteredDRCs: (drcs: Array<DutyResponsibility>) => void;
    selectedDRCType: string;
    setSelectedDRCType: (type: string) => void;
    originalPool: Array<DutyResponsibility>;
    setOriginalPool: (drcPool: Array<DutyResponsibility>) => void;
    drcsForPosting: DutiesResponsibilitiesList;
    setDrcsForPosting: (drcs: DutiesResponsibilitiesList) => void;
    allDRCPool: Array<DutyResponsibility>;
    setAllDRCPool: (drcPool: Array<DutyResponsibility>) => void;
    poolInitialLoad: boolean;
    setPoolInitialLoad: (value: boolean) => void;
    checkedDRCs: DutiesResponsibilities;
    setCheckedDRCs: (drcs: DutiesResponsibilities) => void;
    allCompetencyPool: Array<Competency>;
    setAllCompetencyPool: (pool: Array<Competency>) => void;
    positionHasDRCs: boolean;
    setPositionHasDRCs: (value: boolean) => void;
    isEditted: boolean;
    setIsEditted: (value: boolean) => void;
    drcPoolIsEmpty: boolean;
    setDrcPoolIsEmpty: (value: boolean) => void;
    drcPoolIsFilled: boolean;
    setDrcPoolIsFilled: (value: boolean) => void;
    DRCIsLoaded: boolean;
    setDRCisLoaded: (value: boolean) => void;
    drcdsForUpdating: UpdatedDRCD;
    setDrcdsForUpdating: (drcds: UpdatedDRCD) => void;
    selectedDRCsOnLoad: DutiesResponsibilities;
    setSelectedDRCsOnLoad: (drcs: DutiesResponsibilities) => void;
    pendingPositions: Array<Position>
    setPendingPositions: (pendingPositions: Array<Position>) => void
    fulfilledPositions: Array<Position>
    setFulfilledPositions: (fulfilledPositions: Array<FinishedPosition>) => void
    tab: number
    setTab: (tab: number) => void
};

export const useDrStore = create<DRCState>((set) => ({
    alert: { isOpen: false, page: 1 },
    modal: { isOpen: false, page: 1, subtitle: '', title: '' } as ModalState,
    allPositions: [],
    filteredPositions: [],
    selectedPosition: {} as Position,
    searchValue: '',
    searchDRCValue: '',
    selectedDRCs: DUTIES_RESPONSIBILITIES,
    filteredDRCs: [],
    selectedDRCType: '',
    originalPool: [],
    drcsForPosting: DUTIES_RESPONSIBILITIES_LIST,
    allDRCPool: [],
    poolInitialLoad: false,
    checkedDRCs: DUTIES_RESPONSIBILITIES,
    allCompetencyPool: [],
    positionHasDRCs: false,
    isEditted: false,
    drcPoolIsEmpty: false,
    drcPoolIsFilled: false,
    DRCIsLoaded: false,
    drcdsForUpdating: DUTIES_RESPONSIBILITIES_COMPETENCIES,
    selectedDRCsOnLoad: DUTIES_RESPONSIBILITIES,
    error: { isError: false, errorMessage: '' },
    action: '',
    pendingPositions: [],
    fulfilledPositions: [],
    tab: 1,
    setAlert: (alert: AlertState) => {
        set((state) => ({ ...state, alert }))
    },
    setModal: (modal: ModalState) => {
        set((state) => ({ ...state, modal }));
    },
    setAllPositions: (allPositions: Array<Position>) => {
        set((state) => ({ ...state, allPositions }));
    },
    setFilteredPositions: (filteredPositions: Array<Position>) => {
        set((state) => ({ ...state, filteredPositions }));
    },
    setSelectedPosition: (selectedPosition: Position) => {
        set((state) => ({ ...state, selectedPosition }));
    },
    setSearchValue: (searchValue: string) => {
        set((state) => ({ ...state, searchValue }));
    },
    setSearchDRCValue: (searchDRCValue: string) => {
        set((state) => ({ ...state, searchDRCValue }));
    },
    setSelectedDRCs: (selectedDRCs: DutiesResponsibilities) => {
        set((state) => ({ ...state, selectedDRCs }));
    },
    setFilteredDRCs: (filteredDRCs: Array<DutyResponsibility>) => {
        set((state) => ({ ...state, filteredDRCs }));
    },
    setSelectedDRCType: (selectedDRCType: string) => {
        set((state) => ({ ...state, selectedDRCType }));
    },
    setOriginalPool: (originalPool: Array<DutyResponsibility>) => {
        set((state) => ({ ...state, originalPool }));
    },
    setDrcsForPosting: (drcsForPosting: DutiesResponsibilitiesList) => {
        set((state) => ({ ...state, drcsForPosting }));
    },
    setAllDRCPool: (allDRCPool: Array<DutyResponsibility>) => {
        set((state) => ({ ...state, allDRCPool }));
    },
    setPoolInitialLoad: (poolInitialLoad: boolean) => {
        set((state) => ({ ...state, poolInitialLoad }));
    },
    setCheckedDRCs: (checkedDRCs: DutiesResponsibilities) => {
        set((state) => ({ ...state, checkedDRCs }));
    },
    setAllCompetencyPool: (allCompetencyPool: Array<Competency>) => {
        set((state) => ({ ...state, allCompetencyPool }));
    },
    setPositionHasDRCs: (positionHasDRCs: boolean) => {
        set((state) => ({ ...state, positionHasDRCs }));
    },
    setIsEditted: (isEditted: boolean) => {
        set((state) => ({ ...state, isEditted }));
    },
    setDrcPoolIsEmpty: (drcPoolIsEmpty: boolean) => {
        set((state) => ({ ...state, drcPoolIsEmpty }));
    },
    setDrcPoolIsFilled: (drcPoolIsFilled: boolean) => {
        set((state) => ({ ...state, drcPoolIsFilled }));
    },
    setDRCisLoaded: (DRCIsLoaded: boolean) => {
        set((state) => ({ ...state, DRCIsLoaded }));
    },
    setDrcdsForUpdating: (drcdsForUpdating: UpdatedDRCD) => {
        set((state) => ({ ...state, drcdsForUpdating }));
    },
    setSelectedDRCsOnLoad: (selectedDRCsOnLoad: DutiesResponsibilities) => {
        set((state) => ({ ...state, selectedDRCsOnLoad }));
    },
    setError: (error: ErrorState) => {
        set((state) => ({ ...state, error }))
    },
    setAction: (action: string) => {
        set((state) => ({ ...state, action }))
    },
    setPendingPositions: (pendingPositions: Array<Position>) => {
        set((state) => ({ ...state, pendingPositions }))
    },
    setFulfilledPositions: (fulfilledPositions: Array<FinishedPosition>) => {
        set((state) => ({ ...state, fulfilledPositions }))
    },
    setTab: (tab: number) => {
        set((state) => ({ ...state, tab }))
    }
}));
