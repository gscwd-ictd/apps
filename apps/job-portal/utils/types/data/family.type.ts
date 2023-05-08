//Spouse

export type FamilyType = Spouse & Parent

export type Family = {
  parents: Parent
  spouse: Spouse
  children: Array<Child>
}

export type Spouse = {
  firstName: string
  middleName: string
  lastName: string
  employer: string
  telephoneNumber: string
  nameExtension?: string
  businessAddress: string
  occupation: string
  applicantId?: string
}

export type SpouseForm = {
  spouseLName: string
  spouseFName: string
  spouseMName: string
  spouseNameExt?: string
  spouseEmpBusName: string
  spouseBusAddr: string
  spouseTelNo: string
  spouseOccupation: string
}

export type ParentForm = {
  fatherFName: string
  fatherMName: string
  fatherLName: string
  fatherNameExt: string
  motherLName: string
  motherFName: string
  motherMName: string
}

//Parent
export type Parent = {
  fatherFirstName: string
  fatherMiddleName: string
  fatherLastName: string
  fatherNameExtension: string
  motherFirstName: string
  motherMiddleName: string
  motherLastName: string
  motherMaidenName?: string
  applicantId?: string
}

//Child
export type Child = {
  childName: string
  birthDate: string
  _id?: string
}
