import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getPublication } from '../../../utils/hoc/publication';
import { AllApplicantsListSummary } from '../../../components/fixed/endorsement/AllApplicantsListSummary';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { useAppEndStore } from '../../../store/endorsement.store';
import { Publication } from '../../../types/publication.type';
import { useEffect, useState } from 'react';
import { UseNameInitials } from '../../../../src/utils/hooks/useNameInitials';
import { NavButtonDetails } from '../../../../../portal/src/types/nav.type';

type AppEndSummaryProps = {
  employee: any;
  publicationDetails: Publication;
  // applicants: Applicant[]
};

export default function AppEndSummary({
  employee,
  publicationDetails,
}: AppEndSummaryProps) {
  const publication = useAppEndStore((state) => state.selectedPublication);
  // const selectedApplicants = useAppEndStore((state) => state.selectedApplicants);
  const [navDetails, setNavDetails] = useState<NavButtonDetails>();

  return (
    <>
      <Head>
        <title>Applicant Endorsement Summary</title>
      </Head>
      <SideNav
        navDetails={{
          fullName: '',
          initials: '',
          profile: '',
        }}
      />

      <MainContainer>
        <div className="w-full h-full px-20">
          <ContentHeader
            title="Applicant Endorsement Summary"
            subtitle=""
          ></ContentHeader>
          <ContentBody>
            <>
              <div className="mt-14 w-full">
                <div className="text-xl font-semibold text-gray-800">
                  {publication.positionTitle}
                </div>
                <div className="flex w-full justify-between text-md font-normal text-gray-600">
                  <div>
                    <div>{publication.itemNumber}</div>

                    <div>{publication.placeOfAssignment}</div>
                  </div>

                  <div>
                    <div>Positions needed: {publication.numberOfPositions}</div>
                    {/* <div>Number of applicants selected for interview: {applicantList.length}</div> */}
                  </div>
                </div>

                <AllApplicantsListSummary />
              </div>
            </>
          </ContentBody>
        </div>
      </MainContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const publicationDetails = await getPublication(context.query.vpp_id); //get employeeId using context
  // console.log(context);
  return { props: { publicationDetails } };
};
