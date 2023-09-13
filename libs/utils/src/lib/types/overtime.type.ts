export type OvertimeApplication = {
  overtimeApplication: {
    overtimeSupervisorId: string;
    plannedDate: string;
    estimatedHours: number;
    purpose: string;
  };
  employees: Array<string>;
};
