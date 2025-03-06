'use client';

import { PdsDocument } from './PdsDocument';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import dynamic from 'next/dynamic';

type PdsViewProps = {
  applicantPds: any;
};

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export const PdsView: FunctionComponent<PdsViewProps> = ({ applicantPds }) => {
  const formatDate = (assignedDate: string) => {
    if (!isEmpty(assignedDate)) {
      const date = new Date(assignedDate);
      return dayjs(date.toLocaleDateString()).format('MM/DD/YYYY');
    } else {
      return '';
    }
  };
  return (
    <>
      <div className="h-full w-full flex justify-center items-center">
        <PDFDownloadLink
          document={<PdsDocument formatDate={formatDate} pds={applicantPds} />}
          fileName={
            applicantPds?.personalInfo?.lastName.split(' ').join('_') +
            '_' +
            applicantPds?.personalInfo?.firstName.split(' ').join('_') +
            '_PDS.pdf'
          }
          className="md:hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
        </PDFDownloadLink>

        <PDFViewer width={'100%'} height={'100%'} showToolbar className="hidden md:block">
          <PdsDocument formatDate={formatDate} pds={applicantPds} />
        </PDFViewer>
      </div>
    </>
  );
};
