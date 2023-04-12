// export type Leave = {
//   id?: string;
//   leaveName: string;
//   actions: string;
//   status: string;
//   creditDistribution: string;
//   accumulatedCredits: number;
//   isMonetizable: boolean;
//   canBeCarriedOver: boolean;
//   maximumCredits?: number;
// };

export type Leave = {
  id: string;
  leaveName: string;
  dateOfFiling: string;
  leaveDates: Array<string>;
  status: string;
};

export type PortalListOfLeave = {
  completed: Leave[];
  ongoing: Leave[];
} & Leave;
