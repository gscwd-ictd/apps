/* eslint-disable @nx/enforce-module-boundaries */
export type SystemLog = {
  id: string;
  dateLogged: string;
  timeLogged: string;
  userFullName: string;
  method: string;
  route: string;
  body: object;
  /** what the user did, in plain words */
  action: string;
};

export type SystemLogId = Pick<SystemLog, 'id'>;
