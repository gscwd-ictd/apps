import { NextPage, GetServerSideProps, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'
import dayjs from 'dayjs'
import { PdsDocument } from '../../../../../components/personal-data-sheet/PdsDocument'
import { Pds } from '../../../../../store/pds.store'

type Eligibility = {
  name: string
  rating: number
  examDate: string
  examPlace: string
  licenseNumber: string
  validity: Date
  employeeId: string
}

type Address = {
  houseNumber: string
  street: string
  subdivision: string
  barangay: string
  city: string
  province: string
  zipCode: string
}

type Child = {
  childName: string
  birthDate: Date
}

type Education = {
  schoolName: string
  from: number
  to: number
  yearGraduated: number
  awards: string
  units: string
  degree: string
}

type WorkExperience = {
  positionTitle: string
  companyName: string
  monthlySalary: number
  appointmentStatus: string
  isGovernmentService: boolean
  salaryGrade: string
  from: Date
  to: Date
}

type VoluntaryWork = {
  _id: string
  organizationName: string
  position: string
  from: Date
  to: Date
  numberOfHours: number
}

type LearningDevelopment = {
  title: string
  conductedBy: string
  type: string
  from: Date
  to: Date
  numberOfHours: number
}

type References = {
  name: string
  address: string
  telephoneNumber: string
}

type Data = {
  basicInfo: {
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
  family: {
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
  education: {
    elementary: Education
    secondary: Education
    vocational: Array<Education>
    college: Array<Education>
    graduate: Array<Education>
  }
  eligibility: Array<Eligibility>
  workExperience: Array<WorkExperience>
  voluntaryWork: Array<VoluntaryWork>
  learningDevelopment: Array<LearningDevelopment>
  otherInfo: {
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
}

const PersonalDataSheetPdf: NextPage = ({ applicantPds }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const pds = applicantPds as Pds

  const formatDate = (assignedDate: string) => {
    const date = new Date(assignedDate)
    return dayjs(date.toLocaleDateString()).format('MM/DD/YYYY')
  }

  return (
    <>
      <div id="app"></div>
      <PdsDocument formatDate={formatDate} pds={pds} />
    </>
  )
}

export default PersonalDataSheetPdf

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const [applicantPdsResponse] = await Promise.all([
    fetch(`${process.env.APP_DOMAIN}personal-data-sheet/applicant/${context.params?.employeeId}?isInternal=${context.query?.isInternal}`),
  ])

  const [applicantPds] = await Promise.all([applicantPdsResponse.json()])

  return {
    props: {
      applicantPds,
    },
  }
}
