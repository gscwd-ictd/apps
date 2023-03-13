export type LeaveContents = {
  id: string;
  office: string;
  name: string;
  dateOfFiling: string | null;
  position: string;
  salary: string;
  typeOfLeave: string;
  detailsOfLeave: {
    withinThePhilippines: boolean;
    abroad: boolean;
    location: string;
    inHospital: boolean;
    outPatient: boolean;
    illness: string | null;
    specialLeaveWomenIllness: string | null;
    masterDegree: boolean;
    bar: boolean;
    monetization: boolean;
    terminal: boolean;
    other: string | null;
  };
  numberOfWorkingDays: string;
  commutation: string | null;
};

export type LeaveId = Pick<LeaveContents, 'id'>;

export type Leave = {
  ongoing: Leave[];
  id: string;
  leaveName: string;
  dateOfFiling: string;
  leaveDates: Array<string>;
  status: string;
};

export type LeaveList = {
  completed: Array<Leave>;
  ongoing: Array<Leave>;
};
