/* eslint-disable @nx/enforce-module-boundaries */
export type SystemLog = {
  _id: string;
  dateLogged: string;
  timeLogged: string;
  userName: string;
  method: string;
  route: string;
  body: object;
};

export type SystemLogId = Pick<SystemLog, '_id'>;


// comment