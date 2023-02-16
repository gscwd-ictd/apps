import { Dispatch, SetStateAction } from 'react';
import { Applicant } from './applicant.type';
import { ApplicantEndorsement } from './endorsement.type';
import { StandardModalState } from './modal.type';
import { Publication } from './publication.type';

export type ApplicantWithScores = Applicant & {
  psb_1: string;
  psb_2: string;
  psb_3: string;
  psb_4: string;
  psb_5?: string;
  psb_6?: string;
  psb_7?: string;
  psb_8?: string;
  rank?: string;
  average: string;
};

export type ApplicantScores = {};

export type PsbScores = {
  id: number;
  score: string;
};

export type Ranking = {
  ranking: Array<ApplicantWithScores>;
  numberOfApplicants: string;
  dateOfPanelInterview: string;
  salaryGrade: number;
  numberOfQualifiedApplicants: string;
  numberOfInterviewedApplicants: string;
  interviewDone: string;
  allPsbSubmitted: string;
};

export type ApplicantSelection = StandardModalState & ApplicantEndorsementWithScores;

export type ApplicantEndorsementWithScores = Omit<
  ApplicantEndorsement,
  | 'selectedPublication'
  | 'setSelectedPublication'
  | 'selectedApplicants'
  | 'setSelectedApplicants'
  | 'applicantList'
  | 'setApplicantList'
  | 'filteredApplicantList'
  | 'setFilteredApplicantList'
> & {
  publicationId: string;
  setPublicationId: Dispatch<SetStateAction<string>>;
  selectedPublication: Publication;
  setSelectedPublication: Dispatch<SetStateAction<Publication>>;
  // ranking: Ranking;
  // setRanking: Dispatch<SetStateAction<Ranking>>;
  selectedApplicants: Array<ApplicantWithScores>;
  setSelectedApplicants: Dispatch<SetStateAction<Array<ApplicantWithScores>>>;
  filteredApplicantList: Array<ApplicantWithScores>;
  setFilteredApplicantList: Dispatch<SetStateAction<Array<ApplicantWithScores>>>;
  applicantList: Array<ApplicantWithScores>;
  setApplicantList: Dispatch<SetStateAction<Array<ApplicantWithScores>>>;
};
