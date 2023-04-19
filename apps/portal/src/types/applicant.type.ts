export type Applicant = {
  postingApplicantId: string;
  applicantName: string;
  applicantType?: string;
  state?: boolean;
  sequenceNo?: number;
};

export type PostingApplicantId = Pick<Applicant, 'postingApplicantId'>;
