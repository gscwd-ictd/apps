import { Pds } from '../../store/pds.store'

export type Eligibility = {
  name: string
  rating: number
  examDate: string
  examPlace: string
  licenseNumber: string
  validity: Date
}

export type Address = {
  houseNumber: string
  street: string
  subdivision: string
  barangay: string
  city: string
  province: string
  zipCode: string
}

export type Child = {
  childName: string
  birthDate: Date
}

export type Education = {
  schoolName: string
  from: number
  to: number
  yearGraduated: number
  awards: string
  units: string
  degree: string
}

export type WorkExperience = {
  positionTitle: string
  companyName: string
  monthlySalary: number
  appointmentStatus: string
  isGovernmentService: boolean
  salaryGrade: string
  from: Date
  to: Date
}

export type VoluntaryWork = {
  _id: string
  organizationName: string
  position: string
  from: Date
  to: Date
  numberOfHours: number
}

export type LearningDevelopment = {
  title: string
  conductedBy: string
  type: string
  from: Date
  to: Date
  numberOfHours: number
}

export type References = {
  name: string
  address: string
  telephoneNumber: string
}

export type BasicInfo = {
  personalInfo: {
    email: string
    firstName: string
    middleName: string
    lastName: string
    nameExtension: string
    birthDate: Date
    birthPlace: string
    sex: string
    civilStatus: string
    height: number
    weight: number
    bloodType: string
    mobileNumber: string
    telephoneNumber: string
    citizenship: string
    citizenshipType: string
    country: string
  }
  address: {
    permanentAddress: Address
    residentialAddress: Address
  }
  governmentIssuedIds: {
    gsisNumber: string
    pagibigNumber: string
    philhealthNumber: string
    sssNumber: string
    tinNumber: string
    agencyNumber: string
  }
}

export type Family = {
  spouse: {
    firstName: string
    middleName: string
    lastName: string
    nameExtension: string
    occupation: string
    employer: string
    businessAddress: string
    telephoneNumber: string
  }
  parents: {
    mother: {
      motherFirstName: string
      motherMiddleName: string
      motherLastName: string
      motherMaidenName: string
    }
    father: {
      fatherFirstName: string
      fatherMiddleName: string
      fatherLastName: string
      fatherNameExtension: string
    }
  }
  children: Array<Child>
}

export type OtherInfo = {
  skills: string[]
  recognitions: string[]
  organizations: string[]
  supportingDetails: {
    officeRelation: {
      withinThirdDegree: boolean
      withinFourthDegree: boolean
      details: string
    }
    guiltyCharged: {
      isGuilty: boolean
      guiltyDetails: string
      isCharged: boolean
      chargedDateFiled: Date
      chargedCaseStatus: string
    }
    convicted: {
      isConvicted: boolean
      details: string
    }
    separatedService: {
      isSeparated: boolean
      details: string
    }
    candidateResigned: {
      isCandidate: boolean
      candidateDetails: string
      isResigned: boolean
      resignedDetails: string
    }
    immigrant: {
      isImmigrant: boolean
      details: string
    }
    indigenousPwdSoloParent: {
      isIndigenousMember: boolean
      indigenousMemberDetails: string
      isPwd: boolean
      pwdIdNumber: string
      isSoloParent: boolean
      soloParentIdNumber: string
    }
  }
  references: Array<References>
  governmentIssuedId: {
    issuedId: string
    idNumber: string
    issueDate: Date
    issuePlace: string
  }
}

// export type PDS = {
//   basicInfo: BasicInfo
//   family: Family
//   education: {
//     elementary: Education
//     secondary: Education
//     vocational: Array<Education>
//     college: Array<Education>
//     graduate: Array<Education>
//   }
//   eligibility: Array<Eligibility>
//   workExperience: Array<WorkExperience>
//   voluntaryWork: Array<VoluntaryWork>
//   learningDevelopment: Array<LearningDevelopment>
//   otherInfo: OtherInfo
// }

export type Data = {
  formatDate: Function
  pds: Pds
}
