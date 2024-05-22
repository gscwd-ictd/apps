export type WorkSuspension = {
  id: string;
  name: string;
  suspensionDate: string;
  suspensionHours: number;
};

export type FormPostWorkSuspension = Omit<WorkSuspension, 'id'> & { app: string };
