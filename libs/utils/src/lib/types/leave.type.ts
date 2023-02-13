export type Leave = {
  id?: string;
  leaveName: string;
  actions: string;
  status: string;
  creditDistribution: string;
  accumulatedCredits: number;
  isMonetizable: boolean;
  canBeCarriedOver: boolean;
  maximumCredits?: number;
};
