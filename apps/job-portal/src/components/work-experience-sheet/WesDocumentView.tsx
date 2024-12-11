import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import dynamic from 'next/dynamic';
import { WesDocument } from './WesDocument';
import { FunctionComponent, useEffect, useState } from 'react';
import { axiosFetcher } from '../modular/fetcher/Fetcher';
import { useWorkExpSheetStore, WorkExperienceSheet } from '../../store/work-experience-sheet.store';
import { Applicant } from 'apps/job-portal/utils/types/data/types';
import useSWR from 'swr';

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

type WesDocumentViewProps = {
  applicantWes: any;
};

export const WesDocumentView: FunctionComponent<WesDocumentViewProps> = ({ applicantWes }) => {
  const workExperiencesSheet = useWorkExpSheetStore((state) => state.workExperiencesSheet);
  const setWorkExperiencesSheet = useWorkExpSheetStore((state) => state.setWorkExperiencesSheet);

  const [hasSubmittedWES, setHasSubmittedWES] = useState<boolean>(false);
  const [localWorkExperiencesSheet, setLocalWorkExperiencesSheet] = useState<Array<WorkExperienceSheet>>([]);
  const [applicantData, setApplicantData] = useState({} as Applicant);

  const { data } = useSWR(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/name`, axiosFetcher);

  const formatDate = (assignedDate: string) => {
    if (!isEmpty(assignedDate)) {
      const date = new Date(assignedDate);
      return dayjs(date.toLocaleDateString()).format('MM/DD/YYYY');
    } else {
      return '';
    }
  };

  // fetch applicant name
  useEffect(() => {
    if (!isEmpty(data)) {
      setApplicantData({
        ...applicantData,
        firstName: data.applicantFirstName,
        middleName: data.applicantMiddleName,
        lastName: data.applicantLastName,
        nameExtension: data.applicantNameExtension,
        fullName: data.fullName,
      });
    }
  }, [data]);

  useEffect(() => {
    if (!isEmpty(applicantWes)) {
      localStorage.removeItem('workExperiencesSheet');

      setHasSubmittedWES(true);
      setWorkExperiencesSheet(applicantWes);
      // setApplicantData(applicantWes.personalInfo)
    } else if (isEmpty(applicantWes)) {
      setHasSubmittedWES(false);
      setLocalWorkExperiencesSheet(JSON.parse(localStorage.getItem('workExperiencesSheet')!));
    }
  }, []);

  return (
    <>
      <div className="h-full w-full flex justify-center items-center">
        {!isEmpty(applicantData) ? (
          <>
            <PDFDownloadLink
              document={
                <WesDocument
                  formatDate={formatDate}
                  workExperiencesSheet={
                    hasSubmittedWES ? workExperiencesSheet : !hasSubmittedWES ? localWorkExperiencesSheet : []
                  }
                  applicant={applicantData}
                  isSubmitted={hasSubmittedWES ? true : false}
                />
              }
              fileName={
                applicantData?.lastName.split(' ').join('_') +
                '_' +
                applicantData?.firstName.split(' ').join('_') +
                '_WES.pdf'
              }
              className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>

            <PDFViewer width={'100%'} height={'100%'} showToolbar className="hidden md:block">
              <WesDocument
                formatDate={formatDate}
                workExperiencesSheet={
                  hasSubmittedWES ? workExperiencesSheet : !hasSubmittedWES ? localWorkExperiencesSheet : []
                }
                applicant={applicantData}
                isSubmitted={hasSubmittedWES ? true : false}
              />
            </PDFViewer>
          </>
        ) : null}
      </div>
    </>
  );
};
