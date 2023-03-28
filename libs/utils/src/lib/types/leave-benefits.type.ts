export type LeaveBenefit = {
  id?: string;
  leaveName: string;
  creditDistribution: CreditDistribution;
  accumulatedCredits: number;
  isMonetizable: boolean;
  canBeCarriedOver: boolean;
  maximumCredits?: number;
  category: LeaveCategory;
};

export enum CreditDistribution {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
}

export enum LeaveCategory {
  RECURRING = 'recurring',
  CUMULATIVE = 'cumulative',
  SPECIAL = 'special',
}

export type LeaveBenefitId = Pick<LeaveBenefit, 'id'>;
