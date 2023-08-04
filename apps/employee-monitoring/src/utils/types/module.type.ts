/* eslint-disable @nx/enforce-module-boundaries */
export type Module = {
  id: string;
  module: string;
  slug: string;
  url: string;
};

export type FormPostModule = Omit<Module, 'id'>;

export type ModuleId = Pick<Module, 'id'>;
