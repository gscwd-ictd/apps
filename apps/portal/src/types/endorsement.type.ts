import { Dispatch, SetStateAction } from 'react';
import { Applicant } from './applicant.type';
import { StandardModalState } from './modal.type';
import { Publication } from './publication.type';

export type ApplicantEndorsement = StandardModalState & {
  selectedPublicationId: string;
  setSelectedPublicationId: Dispatch<SetStateAction<string>>;
  selectedPublication: Publication;
  setSelectedPublication: Dispatch<SetStateAction<Publication>>;
  selectedApplicants: Array<Applicant>;
  setSelectedApplicants: Dispatch<SetStateAction<Array<Applicant>>>;
  publicationList: Array<Publication>;
  setPublicationList: Dispatch<SetStateAction<Array<Publication>>>;
  filteredPublicationList: Array<Publication>;
  setFilteredPublicationList: Dispatch<SetStateAction<Array<Publication>>>;
  applicantList: Array<Applicant>;
  setApplicantList: Dispatch<SetStateAction<Array<Applicant>>>;
  filteredApplicantList: Array<Applicant>;
  setFilteredApplicantList: Dispatch<SetStateAction<Array<Applicant>>>;
};
