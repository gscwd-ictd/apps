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
    materDegree: boolean;
    bar: boolean;
    monetization: boolean;
    termal: boolean;
  };
  numberOfWorkingDays: string;
  commutation: string;
};
