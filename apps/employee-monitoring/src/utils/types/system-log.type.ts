/* eslint-disable @nx/enforce-module-boundaries */
export type SystemLog = {
  id: string;
  dateLogged: string;
  timeLogged: string;
  userFullName: string;
  method: string;
  route: string;
  body: object;
};

export type SystemLogId = Pick<SystemLog, 'id'>;
