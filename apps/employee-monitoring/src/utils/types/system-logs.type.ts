/* eslint-disable @nx/enforce-module-boundaries */
export type SystemLogs = {
  _id: string;
  dateLogged: string;
  userName: string;
};

export type SystemLogId = Pick<SystemLogs, '_id'>;
