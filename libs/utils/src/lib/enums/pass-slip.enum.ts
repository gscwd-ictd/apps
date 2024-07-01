export enum NatureOfBusiness {
  OFFICIAL_BUSINESS = 'Official Business',
  PERSONAL_BUSINESS = 'Personal Business',
  UNDERTIME = 'Undertime',
  HALF_DAY = 'Half Day',
}

export enum ObTransportation {
  OFFICE_VEHICLE = 'Office Vehicle',
  PRIVATE_OR_PERSONAL_VEHICLE = 'Private/Personal Vehicle',
  PUBLIC_VEHICLE = 'Public Vehicle',
}

export enum PassSlipStatus {
  DISAPPROVED = 'disapproved',
  DISAPPROVED_BY_HRMO = 'disapproved by hrmo',
  CANCELLED = 'cancelled',
  APPROVED = 'approved',
  ONGOING = 'ongoing',
  USED = 'used',
  UNUSED = 'unused',
  FOR_HRMO_APPROVAL = 'for hrmo approval',
  FOR_SUPERVISOR_APPROVAL = 'for supervisor approval',
  FOR_DISPUTE = 'for dispute',
  AWAITING_MEDICAL_CERTIFICATE = 'awaiting medical certificate',
  APPROVED_WITH_MEDICAL_CERTIFICATE = 'approved with medical certificate',
  APPROVED_WITHOUT_MEDICAL_CERTIFICATE = 'approved without medical certificate',
}
