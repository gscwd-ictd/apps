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
import { UseNameInitials } from '../../../utils/hooks/useNameInitials';
import { NavButtonDetails } from '../../../types/nav.type';
import { useRouter } from 'next/router';

type AppEndSummaryProps = {
  employee: any;
  publicationDetails: Publication;
  // applicants: Applicant[]
};

export default function AppEndSummary({ employee, publicationDetails }: AppEndSummaryProps) {
  const publication = useAppEndStore((state) => state.selectedPublication);
  // const selectedApplicants = useAppEndStore((state) => state.selectedApplicants);
  const [navDetails, setNavDetails] = useState<NavButtonDetails>();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Applicant Endorsement Summary</title>
      </Head>
      <SideNav employeeDetails={employee} />

      <MainContainer>
        <div className="w-full h-full px-20">
          <ContentHeader
            title="Applicant Endorsement Summary"
            subtitle=""
            backUrl={`/${router.query.id}`}
          ></ContentHeader>
          <ContentBody>
            <>
              <div className="w-full mt-14">
                <div className="text-xl font-semibold text-gray-800">{publication.positionTitle}</div>
                <div className="flex justify-between w-full font-normal text-gray-600 text-md">
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
  return { props: { publicationDetails } };
};
