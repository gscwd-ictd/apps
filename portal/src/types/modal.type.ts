import { Dispatch, SetStateAction } from 'react';

export type ErrorState = {
  isError: boolean;
  errorMessage: string | any;
};

export type ModalState = {
  isOpen: boolean;
  page: number;
  title: string;
  subtitle: string;
};

export type Error = {
  isError: boolean;
  errorMessage: string;
};

export type StandardModalState = {
  modal: ModalState;
  setModal: Dispatch<SetStateAction<ModalState>>;
  action: string;
  setAction: Dispatch<SetStateAction<string>>;
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
  error: ErrorState;
  setError: Dispatch<SetStateAction<ErrorState>>;
};
