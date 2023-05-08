import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { Address } from '../../types/data/address.type'
import { PersonalInfo, GovernmentIssuedIds } from '../../types/data/basic-info.type'
import { Spouse } from '../../types/data/family.type'
import { References } from '../../types/data/pds.type'

export type Employee = {
  applicantId: string
  lastName: string
  middleName: string
  firstName: string
  fullName: string
  email: string
  nameExt: string
  assignment: string
  companyId?: string
  positionTitle: string
}

export type PDSFormInputs = {
  lastName: string
  firstName: string
  middleName: string
  nameExtension: string
  birthDate: string
  sex: string
  birthPlace: string
  civilStatus: string
  height: number
  weight: number
  bloodType: string
  citizenship: string
  citizenshipType: string
  country: string
  telephoneNumber: string
  mobileNumber: string
  email: string
  gsisNumber: string
  pagibigNumber: string
  philhealthNumber: string
  sssNumber: string
  tinNumber: string
  agencyNumber: string
  resHouseNumber: string
  resZipCode: string
  elemSchoolName: string
  elemDegree: string
  elemFrom: number
  elemTo: number
  elemUnits: string
  elemYearGraduated: number
  elemAwards: string
  secSchoolName: string
  secDegree: string
  secFrom: number
  secTo: number
  secUnits: string
  secYearGraduated: number
  secAwards: string
  references: Array<References>
  govtId: string
  govtIdNo: string
  issueDate: string
  issuePlace: string
}

export type TabState = {
  selectedTab: number
  setSelectedTab: Dispatch<SetStateAction<number>>
  isExistingApplicant: boolean
  setIsExistingApplicant: Dispatch<SetStateAction<boolean>>
  handlePrevTab: Function
  handleNextTab: Function
  // nodeRef: MutableRefObject<any>
}

export type ErrorState = {
  resAddrError: boolean
  setResAddrError: Dispatch<SetStateAction<boolean>>
  permaAddrError: boolean
  setPermaAddrError: Dispatch<SetStateAction<boolean>>
  resAddrRef: MutableRefObject<any>
  permaAddrRef: MutableRefObject<any>
  shake: boolean
  setShake: Dispatch<SetStateAction<boolean>>
}

export type RefErrorState = {
  refError: boolean
  setRefError: Dispatch<SetStateAction<boolean>>
}
