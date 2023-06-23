export type LeaveBenefit = {
  id?: string;
  leaveName: string;
  creditDistribution: CreditDistribution | null;
  accumulatedCredits: number;
  isMonetizable: boolean;
  canBeCarriedOver: boolean;
  maximumCredits?: number | null;
  leaveType: LeaveType;
};

export type LeaveBenefitOptions = Pick<LeaveBenefit, 'id' | 'leaveName'>;

export enum CreditDistribution {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
}

export enum LeaveType {
  RECURRING = 'recurring',
  CUMULATIVE = 'cumulative',
  SPECIAL = 'special leave benefit',
}

export type LeaveBenefitId = Pick<LeaveBenefit, 'id'>;
