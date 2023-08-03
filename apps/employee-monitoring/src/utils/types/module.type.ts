/* eslint-disable @nx/enforce-module-boundaries */
export type Module = {
  _id: string;
  module: string;
  slug: string;
  url: string;
};

export type FormPostModule = Omit<Module, '_id'>;
