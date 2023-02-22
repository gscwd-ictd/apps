export type LearningDevelopment = {
  _id?: string;
  title: string;
  conductedBy: string;
  type: string;
  from: string;
  to: string;
  numberOfHours: number | null;
  employeeId?: string;
  isEdited?: boolean;
};

export type LNDState = {
  learningDevelopment: Array<LearningDevelopment>;
  setLearningDevelopment: (LearningDevelopment: Array<LearningDevelopment>) => void;
  learningDevelopmentOnEdit: boolean;
  setLearningDevelopmentOnEdit: (learningDevelopmentOnEdit: boolean) => void;
};
