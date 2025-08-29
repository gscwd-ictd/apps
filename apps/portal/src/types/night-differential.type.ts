export type DtrEntriesDetails = {
  companyId: string;
  dtrDate: string;
  dtrId: string;
  salary: string | null;
  lunchIn: string | null;
  lunchOut: string | null;
  schedLunchIn: string | null;
  schedLunchOut: string | null;
  schedTimeIn: string | null;
  schedTimeOut: string | null;
  shift: string | null;
  timeIn: string | null;
  timeOut: string | null;
  nightDifferentialHours: number;
};

export type NightDifferentialDetailsWithComputation = {
  companyId: string;
  employeeFullName: string;
  dtrEntriesDetails: Array<DtrEntriesDetails>;
  dailyRate: number;
  hourlyRate: number;
  totalNoOfHours: number;
  totalNightDifferential: number;
};

export type NightDifferentialReport = {
  periodCovered: string;
  assignment: string;
  nightDifferentialDetailsWithComputation: Array<NightDifferentialDetailsWithComputation>;
  totalOfTotalHourlySalary: number;
  totalOfTotalNightDifferential: number;
  signatories: {
    preparedById: string | null;
    preparedByName: string | null;
    preparedByPosition: string | null;
    preparedBySignature: string | null;
    checkedById: string | null;
    checkedByName: string | null;
    checkedByPosition: string | null;
    checkedBySignature: string | null;
    approvedById: string | null;
    approvedByName: string | null;
    approvedByPosition: string | null;
    approvedBySignature: string | null;
  };
};
