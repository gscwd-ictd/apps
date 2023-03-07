//Spouse

export type FamilyType = Spouse & Parent;

export type SpouseForm = {
  spouseLName: string;
  spouseFName: string;
  spouseMName: string;
  spouseNameExt?: string;
  spouseEmpBusName: string;
  spouseBusAddr: string;
  spouseTelNo: string;
  spouseOccupation: string;
};

export type ElemEducation = {
  elemSchoolName: string;
  elemDegree: string;
  elemFrom: number;
  elemTo: number;
  elemUnits: string;
  elemAwards: string;
  elemYearGraduated: number | null;
};

export type ParentForm = {
  fatherFName: string;
  fatherMName: string;
  fatherLName: string;
  fatherNameExt: string;
  motherLName: string;
  motherFName: string;
  motherMName: string;
};

export type Spouse = {
  firstName: string;
  middleName: string;
  lastName: string;
  employer: string;
  telephoneNumber: string;
  nameExtension?: string;
  businessAddress: string;
  occupation: string;
  employeeId?: string;
};

//Parent
export type Parent = {
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  fatherNameExtension: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  motherMaidenName?: string;
  employeeId?: string;
};

//Child
export type Child = {
  childName: string;
  birthDate: string;
  employeeId?: string;
  _id?: string;
};
