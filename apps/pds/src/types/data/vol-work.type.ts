export type VoluntaryWork = {
  _id?: string;
  organizationName: string;
  position: string;
  from: string;
  to: string | null;
  numberOfHours: number | null;
  employeeId?: string;
  isCurrentlyVol?: boolean;
  isEdited?: boolean;
  isHoursApplicable?: boolean;
};

export type VolWorkState = {
  voluntaryWork: Array<VoluntaryWork>;
  setVoluntaryWork: (voluntaryWork: Array<VoluntaryWork>) => void;
  voluntaryWorkOnEdit: boolean;
  setVoluntaryWorkOnEdit: (voluntaryWorkOnEdit: boolean) => void;
};
