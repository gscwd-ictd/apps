import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PassSlip } from '../../../../libs/utils/src/lib/types/pass-slip.type';

type LoadingPassSlip = {
  loadingPassSlip: boolean;
  loadingPassSlips: boolean;
};

type ErrorPassSlip = {
  errorPassSlip: string;
  errorPassSlips: string;
};

type PassSlipState = {
  passSlips: Array<PassSlip>;
  passSlip: PassSlip;
  loading: LoadingPassSlip;
  error: ErrorPassSlip;

  getPassSlips: () => void;
  getPassSlipsSuccess: (response: Array<PassSlip>) => void;
  getPassSlipsFail: (error: string) => void;

  cancelPassSlip: () => void;
  cancelPassSlipSuccess: (response: PassSlip) => void;
  cancelPassSlipFail: (error: string) => void;
};
