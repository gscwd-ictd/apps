import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Module, ModuleId } from '../utils/types/module.type';

export type ModulesState = {
  getModules: Array<Module>;
  setGetModules: (getModules: Array<Module>) => void;

  errorModules: string;
  setErrorModules: (errorModules: string) => void;

  postModule: Module;
  setPostModule: (postModule: Module) => void;

  updateModule: Module;
  setUpdateModule: (updateModule: Module) => void;

  deleteModule: ModuleId;
  setDeleteModule: (deleteModule: ModuleId) => void;

  errorModule: string;
  setErrorModule: (errorModule: string) => void;

  emptyResponse: () => void;
};

export const useModulesStore = create<ModulesState>()(
  devtools((set) => ({
    getModules: [],
    setGetModules: (getModules) => set({ getModules }),

    errorModules: '',
    setErrorModules: (errorModules) => set({ errorModules }),

    postModule: {} as Module,
    setPostModule: (postModule) => set({ postModule }),

    updateModule: {} as Module,
    setUpdateModule: (updateModule) => set({ updateModule }),

    deleteModule: {} as ModuleId,
    setDeleteModule: (deleteModule) => set({ deleteModule }),

    errorModule: '',
    setErrorModule: (errorModule) => set({ errorModule }),

    emptyResponse: () =>
      set({
        postModule: {} as Module,
        updateModule: {} as Module,
        deleteModule: {} as ModuleId,

        errorModules: '',
        errorModule: '',
      }),
  }))
);
