export enum CreditDistributions {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum LeaveStatus {
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
  FOR_HRMO_APPROVAL = 'for hrmo approval',
  FOR_SUPERVISOR_APPROVAL = 'for supervisor approval',
  FOR_HRDM_APPROVAL = 'for hrdm approval',
  DISAPPROVED_BY_SUPERVISOR = 'disapproved by supervisor',
  DISAPPROVED_BY_HRDM = 'disapproved by hrdm',
  DISAPPROVED_BY_HRMO = 'disapproved by hrmo',
}

// hrmo_approval(SLB), immediate supervisor, hrdm_approval,

export enum LeaveName {
  VACATION = 'Vacation Leave',
  FORCED = 'Forced Leave',
  SICK = 'Sick Leave',
  MATERNITY = 'Maternity Leave',
  PATERNITY = 'Paternity Leave',
  SPECIAL_PRIVILEGE = 'Special Privilege Leave',
  SOLO_PARENT = 'Solo Parent Leave',
  STUDY = 'Study Leave',
  VAWC = 'VAWC Leave',
  REHABILITATION = 'Rehabilitation Leave',
  SPECIAL_LEAVE_BENEFITS_FOR_WOMEN = 'Special Leave Benefits for Women',
  SPECIAL_EMERGENCY_CALAMITY = 'Special Emergency (Calamity) Leave',
  ADOPTION = 'Adoption Leave',
  OTHERS = 'Others',
}
