export enum TrainingTypes {
  SUPERVISORY = 'supervisory',
  PROFESSIONAL = 'professional',
  TECHNICAL = 'technical',
  FOUNDATIONAL = 'foundational',
  MANAGERIAL = 'leadership/managerial',
}

export enum TrainingPreparationStatus {
  PENDING = 'pending',
  ON_GOING_NOMINATION = 'on going nomination',
  NOMINATION_DONE = 'nomination done',
  PDC_APPROVAL = 'for pdc approval',
  GM_APPROVAL = 'for gm approval',
  FOR_BATCHING = 'for batching',
  DONE_BATCHING = 'done batching',
  DONE = 'done',
}

export enum TrainingStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'on going',
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
