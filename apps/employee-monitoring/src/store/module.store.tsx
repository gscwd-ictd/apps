import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Module, ModuleId } from '../utils/types/module.type';

type ResponseModule = {
  postResponse: Module;
  updateResponse: Module;
  deleteResponse: ModuleId;
};

type LoadingModule = {
  loadingModules: boolean;
  loadingModule: boolean;
};

type ErrorModule = {
  errorModules: string;
  errorModule: string;
};

export type ModulesState = {
  modules: Array<Module>;
  module: ResponseModule;
  loading: LoadingModule;
  error: ErrorModule;

  getModules: (loading: boolean) => void;
  getModulesSuccess: (loading: boolean, response: Array<Module>) => void;
  getModulesFail: (loading: boolean, error: string) => void;

  postModule: () => void;
  postModuleSuccess: (response: Module) => void;
  postModuleFail: (error: string) => void;

  updateModule: () => void;
  updateModuleSuccess: (response: Module) => void;
  updateModuleFail: (error: string) => void;

  deleteModule: () => void;
  deleteModuleSuccess: (response: ModuleId) => void;
  deleteModuleFail: (error: string) => void;

  emptyResponse: () => void;
};

export const useModulesStore = create<ModulesState>()(
  devtools((set) => ({
    modules: [],
    module: {
      postResponse: {} as Module,
      updateResponse: {} as Module,
      deleteResponse: {} as ModuleId,
    },
    loading: {
      loadingModules: false,
      loadingModule: false,
    },
    error: {
      errorModules: '',
      errorModule: '',
    },

    getModules: (loading: boolean) =>
      set((state) => ({
        ...state,
        modules: [],
        loading: { ...state.loading, loadingModules: loading },
        error: { ...state.error, errorModules: '' },
      })),
    getModulesSuccess: (loading: boolean, response: Array<Module>) =>
      set((state) => ({
        ...state,
        modules: response,
        loading: { ...state.loading, loadingModules: loading },
      })),
    getModulesFail: (loading: boolean, error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingModules: loading },
        error: { ...state.error, errorModules: error },
      })),

    postModule: () =>
      set((state) => ({
        ...state,
        module: { ...state.module, postResponse: {} as Module },
        loading: { ...state.loading, loadingModule: true },
        error: { ...state.error, errorModule: '' },
      })),
    postModuleSuccess: (response: Module) =>
      set((state) => ({
        ...state,
        module: { ...state.module, postResponse: response },
        loading: { ...state.loading, loadingModule: false },
      })),
    postModuleFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingModule: false },
        error: { ...state.error, errorModule: error },
      })),

    updateModule: () =>
      set((state) => ({
        ...state,
        module: { ...state.module, updateResponse: {} as Module },
        loading: { ...state.loading, loadingModule: true },
        error: { ...state.error, errorModule: '' },
      })),
    updateModuleSuccess: (response: Module) =>
      set((state) => ({
        ...state,
        module: {
          ...state.module,
          updateResponse: response,
        },
        loading: { ...state.loading, loadingModule: false },
      })),
    updateModuleFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingModule: false },
        error: { ...state.error, errorModule: error },
      })),

    deleteModule: () =>
      set((state) => ({
        ...state,
        module: { ...state.module, deleteResponse: {} as ModuleId },
        loading: { ...state.loading, loadingModule: true },
        error: { ...state.error, errorModule: '' },
      })),
    deleteModuleSuccess: (response: ModuleId) =>
      set((state) => ({
        ...state,
        module: { ...state.module, deleteResponse: response },
        loading: { ...state.loading, loadingModule: false },
      })),
    deleteModuleFail: (error: string) =>
      set((state) => ({
        ...state,
        loading: { ...state.loading, loadingModule: false },
        error: { ...state.error, errorModule: error },
      })),

    emptyResponse: () =>
      set((state) => ({
        ...state,
        module: {
          ...state.module,
          postResponse: {} as Module,
          updateResponse: {} as Module,
          deleteResponse: {} as ModuleId,
        },
        error: {
          ...state.error,
          errorModules: '',
          errorModule: '',
        },
      })),
  }))
);
