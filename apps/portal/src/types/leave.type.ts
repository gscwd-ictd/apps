export type LeaveApplication = {
  id: string;
  office: string;
  firstName: string;
  middleName: string;
  lastName: string;
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
    illness: string;
    specialLeaveWomenIllness: string;
    masterDegree: boolean;
    bar: boolean;
    monetization: boolean;
    terminal: boolean;
    other: string;
  };
  numberOfWorkingDays: string;
  commutation: string;
};
