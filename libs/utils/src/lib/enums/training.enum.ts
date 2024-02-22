export enum TrainingTypes {
  SUPERVISORY = 'supervisory',
  PROFESSIONAL = 'professional',
  TECHNICAL = 'technical',
  FOUNDATIONAL = 'foundational',
  MANAGERIAL = 'leadership/managerial',
}

// export enum TrainingPreparationStatus {
//   PENDING = 'pending',
//   ON_GOING_NOMINATION = 'on going nomination',
//   NOMINATION_DONE = 'nomination done',
//   PDC_APPROVAL = 'for pdc approval',
//   GM_APPROVAL = 'for gm approval',
//   FOR_BATCHING = 'for batching',
//   DONE_BATCHING = 'done batching',
//   DONE = 'done',
// }

export enum TrainingStatus {
  PENDING = 'pending',
  ON_GOING_NOMINATION = 'on going nomination',
  NOMINATION_DONE = 'nomination done',
  PDC_SECRETARY_APPROVAL = 'for pdc secretary approval',
  PDC_SECRETARY_DECLINED = 'pdc secretary declined',
  PDC_CHAIRMAN_APPROVAL = 'for pdc chairman approval',
  PDC_CHAIRMAN_DECLINED = 'pdc chairman declined',
  GM_APPROVAL = 'for gm approval',
  GM_DECLINED = 'gm declined',
  FOR_BATCHING = 'for batching',
  DONE_BATCHING = 'done batching',
  UPCOMING = 'upcoming',
  ON_GOING_TRAINING = 'on going training',
  REQUIREMENTS_SUBMISSION = 'requirements submission',
  COMPLETED = 'completed',
}

export enum NomineeType {
  NOMINEE = 'nominee',
  STAND_IN = 'stand-in',
}

export enum NomineeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

//for PDC Chairman & Secretariat action
export enum PdcApprovalAction {
  APPROVE = 'approve',
  DISAPPROVE = 'disapprove',
}
