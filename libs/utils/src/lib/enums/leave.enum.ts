export enum CreditDistributions {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum LeaveStatus {
  ONGOING = 'ongoing',
  APPROVED = 'approved',
  FOR_APPROVAL = 'for approval',
  DISAPPROVED = 'disapproved',
  CANCELLED = 'cancelled',
  FOR_HRMO_APPROVAL = 'for hrmo approval',
  FOR_SUPERVISOR_APPROVAL = 'for supervisor approval',
  FOR_HRDM_APPROVAL = 'for hrdm approval',
  DISAPPROVED_BY_SUPERVISOR = 'disapproved by supervisor',
  DISAPPROVED_BY_HRDM = 'disapproved by hrdm',
}

// hrmo_approval(SLB), immediate supervisor, hrdm_approval,
