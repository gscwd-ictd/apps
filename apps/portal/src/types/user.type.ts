export type User = {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PendingUser = {
  companyId: string | null;
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExt: string;
  sex: string;
  birthDate: Date;
  mobile: string;
  email: string;
  photoUrl?: string;
};
