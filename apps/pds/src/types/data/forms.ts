export type FormChildValues = {
  childName: string
  childBirthday: string
}

export type FormEducValues = {
  schoolName: string
  degree: string
  from: number
  to: number | string
  units: string
  yearGraduated: number | string
  awards: string
  checkboxOngoing: boolean
}

export type FormEligValues = {
  eligName: string
  rating: string
  examDateStart: string
  examDateEnd: string
  examPlace: string
  licenseNo: string
  validity: string
  // refDateEnd: string;
}

export type FormWorkExpValues = {
  positionTitle: string
  companyName: string
  from: Date | string
  to: Date | string
  salaryGrade: string
  monthlySalary: number
  appointmentStatus: string
  govtService: string
}

export type FormVolWorkValues = {
  orgName: string
  from: string
  to: string
  hours: number
  position: string
}

export type FormLNDValues = {
  title: string
  from: Date
  to: Date
  hours: number
  lndType: string
  conductedBy: string
}

export type FormOISNHValues = {
  title: string
}

export type FormOIMembershipValues = {
  title: string
}

export type FormOIRecogValues = {
  title: string
}

export type FormRefValues = {
  refName: string
  refTelNo: string
  refAddress: string
}

export type MyFormValuesType =
  | 'FormChildValues'
  | 'FormEducValues'
  | 'FormEligValues'
  | 'FormWorkExpValues'
  | 'FormVolWorkValues'

export type MyPdsFormValuesType =
  | 'firstName'
  | 'lastName'
  | 'middleName'
  | 'nameExt'
  | 'childName'
  | 'childBirthday'
  | 'schoolName'
  | 'degree'
  | 'from'
  | 'to'
  | 'units'
  | 'yearGraduated'
  | 'awards'
  | 'eligName'
  | 'rating'
  | 'examDateStart'
  | 'examDateEnd'
  | 'examPlace'
  | 'licenseNo'
  | 'validity'
  | 'positionTitle'
  | 'companyName'
  | 'salaryGrade'
  | 'monthlySalary'
  | 'appointmentStatus'
  | 'isGovernment'
  | 'positionTitle'
  | 'companyName'
  | 'from'
  | 'to'
  | 'salaryGrade'
  | 'monthlySalary'
  | 'appointmentStatus'
  | 'orgName'
  | 'hours'
  | 'position'
  | 'title'
  | 'lndType'
  | 'conductedBy'
  | 'relation'
  | 'refName'
  | 'refTelNo'
  | 'refAddress'
  | 'firstName'

export type MyPdsFormSelectListValuesType =
  | 'gender'
  | 'bloodType'
  | 'civilStatus'
  | 'dualCitizenshipType'
  | 'eligibility'
  | 'govtId'
  | 'appointmentStatus'
  | 'govtService'
  | 'highschool'
  | 'lndType'
  | 'salaryGrade'
  | 'secondary'
  | 'juniorhighschool'
  | 'seniorhighschool'
  | 'country'
