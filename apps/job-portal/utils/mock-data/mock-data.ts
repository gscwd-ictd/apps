import { Pds } from 'apps/job-portal/src/store/pds.store';

export const applicant: Partial<Pds> = {
  personalInfo: {
    applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    firstName: 'Jofher',
    middleName: 'L',
    lastName: 'Nilapirot',
    nameExtension: 'Jr.',
    birthDate: '1991-03-03',
    sex: 'Male',
    civilStatus: 'Single',
    height: 1.65,
    weight: 62,
    bloodType: 'O+',
    mobileNumber: '09770912663',
    telephoneNumber: '0835002252',
    email: 'shiamshi@gmail.com',
    citizenship: 'Dual Citizenship',
    citizenshipType: 'By naturalization',
    country: 'Australia',
    birthPlace: 'Polomolok',
  },
  governmentIssuedIds: {
    gsisNumber: '11111111111',
    pagibigNumber: '1222222222',
    philhealthNumber: '133333333333',
    sssNumber: '1444444444',
    tinNumber: '155555555555',
    agencyNumber: 'S-002',
    applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
  },
  residentialAddress: {
    houseNumber: 'A4',
    street: 'Ilang-Ilang',
    subdivision: 'Cannery Housing',
    province: 'Ilocos Norte',
    provCode: '0128',
    city: 'Adams',
    cityCode: '012801',
    barangay: 'Adams (Pob.)',
    brgyCode: '012801001',
    zipCode: '9504',
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
  },
  permanentAddress: {
    houseNumber: 'A4',
    street: 'Ilang-Ilang',
    subdivision: 'Cannery Housing',
    province: 'Ilocos Norte',
    provCode: '0128',
    city: 'Adams',
    cityCode: '012801',
    barangay: 'Adams (Pob.)',
    brgyCode: '012801001',
    zipCode: '9504',
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
  },
  spouse: {
    applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    firstName: 'Arliz',
    middleName: 'Sovenestras',
    nameExtension: 'N/A',
    lastName: 'Nilapirot',
    employer: 'N/A',
    businessAddress: 'N/A',
    occupation: 'N/A',
    telephoneNumber: 'N/A',
  },
  parents: {
    fatherLastName: 'Monkey',
    fatherFirstName: 'Luffy',
    fatherMiddleName: "D'",
    fatherNameExtension: 'Sr.',
    motherLastName: 'L',
    motherFirstName: 'Jofera',
    motherMiddleName: 'Dilapires',
    applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
  },
  children: [
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      childName: 'Jover S. Nilapirot',
      birthDate: '2012-04-02',
    },
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      childName: 'Javier S. Nilapirot',
      birthDate: '2016-07-22',
    },
  ],
  elementary: {
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    schoolName: 'Elementary School',
    degree: 'Primary Education',
    from: 2000,
    to: 2006,
    yearGraduated: 2006,
    units: 'Graduated',
    awards: 'N/A',
  },
  secondary: {
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    schoolName: 'Secondary School',
    degree: 'High School',
    from: 2006,
    to: 2009,
    yearGraduated: 2009,
    units: 'Graduated',
    awards: 'N/A',
  },
  vocational: [
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      schoolName: 'Skwelahan ni bado',
      degree: 'Bachelor of Chingchong Ching',
      from: 2017,
      to: null,
      yearGraduated: null,
      units: 'N/A',
      awards: 'N/A',
    },
  ],

  college: [
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      schoolName: 'Notre Dame of Dadiangas University',
      degree: 'Bachelor of Chingchong Ching',
      from: 2013,
      to: 2016,
      yearGraduated: 2013,
      units: 'Graduated',
      awards: 'N/A',
    },
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      schoolName: 'Mindanao State University',
      degree: 'Bachelor of Science in Information and Technology',
      from: 2009,
      to: 2013,
      yearGraduated: null,
      units: 'N/A',
      awards: 'N/A',
    },
  ],
  graduate: [
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      schoolName: 'Ateneo de Davao',
      degree: 'Bachelor of Science in Information and Technology',
      from: 2020,
      to: null,
      yearGraduated: null,
      units: 'N/A',
      awards: 'N/A',
    },
  ],
  eligibility: [
    {
      name: 'Civil Service Professional',
      rating: '97.08',
      examDate: { from: '2019-03-17', to: null },
      examPlace: 'General Santos City',
      licenseNumber: '',
      validity: '',
      isOneDayOfExam: true,
      _id: '7bda7038-9a26-44a0-b649-475a6118eccc',
    },
  ],
  workExperience: [
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      positionTitle: 'General Manager',
      companyName: 'Polomolok Water District',
      from: '2015-03-22',
      to: '',
      monthlySalary: 128696,
      isGovernmentService: true,
      salaryGrade: '26-1',
      appointmentStatus: 'Permanent',
    },
  ],
  voluntaryWork: [
    {
      position: 'General Manager',
      organizationName: 'Polomolok Water District',
      from: '2015-03-22',
      to: '',
      numberOfHours: null,
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    },
  ],
  learningDevelopment: [
    {
      title: 'Chichi Burichi',
      conductedBy: 'Polomolok Water District',
      from: '2019-05-02',
      to: '2019-05-04',
      numberOfHours: 15,
      _id: '7bda7038-9a26-44a0-b649-475a6118eccc',
      type: 'Managerial/Leadership',
    },
  ],
  skills: [
    {
      skill: 'Boxer',
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    },
    {
      skill: 'Fighter',
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    },
    {
      skill: 'Biker',
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    },
    {
      skill: 'Swimmer',
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    },
  ],
  recognitions: [
    {
      recognition: 'Pedal King',
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    },
  ],
  organizations: [
    {
      organization: 'Yakuza',
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    },
  ],

  officeRelation: {
    withinThirdDegree: true,
    details: 'The assistant general manager is my uncle.',
    withinFourthDegree: false,
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
  },
  guiltyCharged: {
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    isCharged: false,
    chargedCaseStatus: '',
    chargedDateFiled: '',
    isGuilty: false,
    guiltyDetails: '',
  },
  convicted: {
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    isConvicted: false,
    details: '',
  },
  separatedService: {
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    isSeparated: false,
    details: '',
  },
  candidateResigned: {
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    isCandidate: false,
    candidateDetails: '',
    isResigned: false,
    resignedDetails: '',
  },
  immigrant: {
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    isImmigrant: true,
    details: 'Australia',
  },
  indigenousPwdSoloParent: {
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    isIndigenousMember: false,
    indigenousMemberDetails: '',
    isPwd: false,
    pwdIdNumber: '',
    isSoloParent: false,
    soloParentIdNumber: '',
  },
  references: [
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      name: 'John Seigfred Derla',
      address: 'General Santos City',
      telephoneNumber: '0833080744',
    },
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      name: 'Ricardo Vicente Narvaiza',
      address: 'General Santos City',
      telephoneNumber: '0833080745',
    },
    {
      // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
      name: 'Paul Ryner Ogdamin',
      address: 'Polomolok, South Cotabato',
      telephoneNumber: '0833080745',
    },
  ],
  governmentIssuedId: {
    // applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
    idNumber: '1234678476',
    issueDate: '2012-04-15',
    issuedId: "Driver's License",
    issuePlace: 'Polomolok, South Cotabato',
  },
};
