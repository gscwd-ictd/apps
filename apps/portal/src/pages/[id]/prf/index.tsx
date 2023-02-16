import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import {
  MainContainer,
  ContentHeader,
  ContentBody,
} from '../../../components/modular/custom/containers/_index';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { Button } from '../../../components/modular/common/forms/Button';
import { useRouter } from 'next/router';
import { Footers } from '../../../components/fixed/footer/Footer';
import { FormModal } from '../../../components/modular/common/overlays/FormModal';
import { useContext, useState } from 'react';
import { PrfModalController } from '../../../components/fixed/prf/PrfModalController';
import { getEmployeeData } from '../../../utils/hoc/employee';
import { EmployeeContext, PrfContext } from '../../../context/contexts';
import { Employee } from '../../../utils/types/data';
import { UserRole } from '../../../utils/enums/userRoles';
import { postData } from '../../../utils/hoc/axios';
import Head from 'next/head';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { PrfItem } from '../../../components/fixed/prf/PrfItem';
import Link from 'next/link';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import { Position } from '../../../types/position.type';
import { Prf } from '../../../types/prf.type';

export default function PositionRequest() {
  // { employee }: InferGetServerSidePropsType<typeof getServerSideProps>
  // set state for all positions for this office/department/division

  // employee from employee context
  // const { employee } = useContext(EmployeeContext);

  const [allPositions, setAllPositions] = useState<Array<Position>>([]);

  // set state for positions that are selected
  const [selectedPositions, setSelectedPositions] = useState<Array<Position>>(
    []
  );

  // set state for filtered positions
  const [filteredPositions, setFilteredPositions] = useState<Array<Position>>(
    []
  );

  // set state for prf details
  const [prfDetails, setPrfDetails] = useState({
    dateNeeded: '',
    isExamRequired: false,
  });

  // set state for the searched position title
  const [searchValue, setSearchValue] = useState('');

  // set sate for handling error
  const [error, setError] = useState({ isError: false, errorMessage: '' });

  // set state for handling modal page
  const [modal, setModal] = useState({
    isOpen: false,
    page: 1,
    title: '',
    subtitle: '',
  });

  // set state for controlling tab page
  const [tab, setTab] = useState(1);

  // initialize router
  const router = useRouter();

  // set modal main modal action (confirm)
  const modalAction = async () => {
    if (modal.page === 1) {
      // check if there are no selected positions
      selectedPositions.length === 0
        ? // set error if no selected positions
          setError({
            isError: true,
            errorMessage: 'Select at least 1 position to proceed',
          })
        : // otherwise, check if date needed is blank
        prfDetails.dateNeeded === ''
        ? // set error if date needed is blank
          setError({
            isError: true,
            errorMessage: 'Please specify the date needed',
          })
        : // otherwise, go to next page
          !error.isError && setModal({ ...modal, page: modal.page + 1 });
    } else if (modal.page === 2) {
      // create an empty array
      const requestedPositions: any = [];

      // loop through selected positions
      selectedPositions.forEach((position: any) => {
        // remove unnecessary fields
        requestedPositions.push(
          (({
            designation,
            designationId,
            sequenceNo,
            itemNumber,
            positionTitle,
            state,
            ...rest
          }) => rest)(position)
        );
      });

      const prfData = {
        // set to draft by default
        status: 'pending',

        // set date requested to date today
        dateRequested: dayjs().format('YYYY-MM-DD'),

        // set to currently logged in manager
        employeeId: employee.employmentDetails.employeeId,

        // set date needed value from the state
        dateNeeded: dayjs(prfDetails.dateNeeded).format('YYYY-MM-DD'),

        // set withExam value from the state
        withExam: prfDetails.isExamRequired,

        // set prf positions
        prfPositions: requestedPositions,
      };

      // save prf in the database
      const { error, result } = await postData(
        `${process.env.NEXT_PUBLIC_HRIS_URL}/prf`,
        prfData
      );

      console.log(result);

      // go to prf summary page
      error
        ? console.log(error)
        : router.push(
            `/${router.query.id}/prf/${result.prf.prfDetails._id}?render_type=view`
          );
    }
  };

  // set modal cancel action
  const cancelPrfModal = () =>
    modal.page !== 1
      ? setModal({ ...modal, page: modal.page - 1 })
      : closePrfModal();

  const openPrfModal = () => {
    // open the prf modal
    setModal({ ...modal, page: 1, isOpen: true });

    // set all states to their default values upon opening the modal
    setStateDefaultValues();
  };

  const closePrfModal = () => {
    // close the prf modal
    setModal({ ...modal, isOpen: false });
  };

  const setStateDefaultValues = () => {
    // remove all selected positions
    setSelectedPositions([]);

    // set prf details value to default
    setPrfDetails({ dateNeeded: '', isExamRequired: false });

    // set default error value
    setError({ isError: false, errorMessage: '' });

    // set default value for search
    setSearchValue('');
  };

  return (
    // <EmployeeContext.Provider value={employee}>
    <EmployeeProvider employeeData={employee}>
      <Head>
        <title>Position Request</title>
      </Head>

      <SideNav />

      <PrfContext.Provider
        value={{
          allPositions,
          setAllPositions,
          selectedPositions,
          setSelectedPositions,
          filteredPositions,
          setFilteredPositions,
          searchValue,
          setSearchValue,
          prfDetails,
          setPrfDetails,
          error,
          setError,
        }}
      >
        <FormModal
          isOpen={modal.isOpen}
          title="Position Request"
          subtitle="Request for additional personnel"
          actionLabel={modal.page === 2 ? 'Confirm' : 'Proceed'}
          isStatic
          modalSize="xxxxxxxl"
          withCancelBtn
          cancelLabel={modal.page === 1 ? 'Cancel' : 'Go Back'}
          disableActionBtn={selectedPositions.length === 0 ? true : false}
          setIsOpen={() => setModal({ ...modal })}
          onAction={modalAction}
          onCancel={cancelPrfModal}
          onClose={closePrfModal}
          children={<PrfModalController page={modal.page} action="create" />}
        />
      </PrfContext.Provider>

      <MainContainer>
        <div className="w-full h-full px-32">
          <ContentHeader
            title="Position Request"
            subtitle="Request for new personnel"
          >
            <Button btnLabel="Create Request" shadow onClick={openPrfModal} />
          </ContentHeader>
          <ContentBody>
            <>
              <ul className="flex gap-3 text-gray-500 border-b">
                <li
                  className={`border-b-[3px] ${
                    tab === 1 ? 'border-b-indigo-400' : 'border-b-transparent'
                  } mr-3 cursor-pointer rounded-t pt-1 hover:bg-indigo-50`}
                  onClick={() => setTab(1)}
                >
                  <span className="text-sm font-medium tracking-tight transition-colors ease-in-out select-none hover:text-indigo-700">
                    Pending
                  </span>
                </li>

                <li
                  className={`border-b-[3px] ${
                    tab === 2 ? 'border-b-indigo-400' : 'border-b-transparent'
                  } cursor-pointer rounded-t pt-1 hover:bg-indigo-50`}
                  onClick={() => setTab(2)}
                >
                  <span className="text-sm font-medium tracking-tight transition-colors ease-in-out select-none hover:text-indigo-700">
                    For Approval
                  </span>
                </li>
              </ul>

              <div className="mt-14">
                {tab === 1 && <PendingTab />}
                {tab === 2 && <RequestsTab />}
              </div>
            </>
          </ContentBody>
        </div>
      </MainContainer>

      {/* <Footer /> */}
    </EmployeeProvider>
    // </EmployeeContext.Provider>
  );
}

const PendingTab = (): JSX.Element => {
  // initialize router
  const router = useRouter();

  // query prf data of the currently logged in employee
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_HRIS_URL}/prf/${router.query.id}?status=pending`,
    fetchWithToken
  );

  return (
    <div>
      {data && data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-y-10">
            {data.map((prf: Prf, index: number) => {
              return <PrfItem prf={prf} key={index} />;
            })}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center pt-20">
            <h1 className="text-4xl text-gray-300">
              No pending requests at the moment
            </h1>
          </div>
        </>
      )}
    </div>
  );
};

const RequestsTab = (): JSX.Element => {
  // initialize router
  const router = useRouter();

  // query prf data of the currently logged in employee
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_HRIS_URL}/prf-trail/employee/${router.query.id}`,
    fetchWithToken
  );

  data && console.log(router.query.id);

  return (
    <div>
      {data &&
        data.map((something: any, index: number) => {
          return (
            <div key={index}>
              <button
                onClick={() =>
                  router.push(
                    `/${router.query.id}/prf/${something.prfDetailsId}?render_type=approval`
                  )
                }
              >
                {something.prfNo}
              </button>
            </div>
          );
        })}
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
//   try {
//     // get the data of the logged in employee from the backend
//     const employee = (await getEmployeeData(context)) as Employee;

//     // check if user role is rank_and_file
//     if (employee.userRole === UserRole.RANK_AND_FILE) {
//       // if true, the employee is not allowed to access this page
//       return {
//         redirect: {
//           permanent: false,
//           destination: '/403',
//         },
//       };
//     }

//     // return employee as props to prf page
//     return { props: { employee } };
//   } catch (error) {
//     return { notFound: true };
//   }
// });
