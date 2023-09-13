export type OvertimeForm = {
  overtimeSupervisorId: string;
  plannedDate: string;
  estimatedHours: number;
  purpose: string;
  employees: Array<string>;
};
