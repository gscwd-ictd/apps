import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../utils/hoc/fetcher';
import { useEmployeeStore } from '../../../store/employee.store';
import { AllLeavesListTab } from './AllLeavesListTab';
import { useLeaveStore } from '../../../../src/store/leave.store';

type LeavesTabWindowProps = {
  employeeId: string;
};

export const LeavesTabWindow = ({
  employeeId,
}: LeavesTabWindowProps): JSX.Element => {
  const pendingLeave = [
    {
      id: '23232',
      office: 'Information Communication & Technology',
      firstName: 'Ricardo',
      middleName: 'Raval',
      lastName: 'Narvaiza',
      dateOfFiling: '1-22-2023',
      position: 'Clerk Processor C',
      salary: 'P 999,000.00',
      typeOfLeave: 'Vacation Leave',
      detailsOfLeave: {
        withinThePhilippines: true,
        abroad: false,
        location: 'General Santos City',
        inHospital: false,
        outPatient: false,
        illness: '',
        specialLeaveWomenIllness: '',
        sick: '',
        masterDegree: false,
        bar: false,
        monetization: false,
        terminal: false,
        other: '',
      },
      numberOfWorkingDays: '1, 2, 3',
      commutation: 'Not Requested',
    },
  ];

  const fulfilledLeave = [
    {
      id: '1234',
      office: 'Information Communication & Technology',
      firstName: 'Ricardo',
      middleName: 'Raval',
      lastName: 'Narvaiza',
      dateOfFiling: '1-10-2023',
      position: 'Clerk Processor C',
      salary: 'P 999,000.00',
      typeOfLeave: 'Vacation Leave',
      detailsOfLeave: {
        withinThePhilippines: true,
        abroad: false,
        location: 'General Santos City',
        inHospital: false,
        outPatient: false,
        illness: '',
        specialLeaveWomenIllness: '',
        sick: '',
        masterDegree: false,
        bar: false,
        monetization: false,
        terminal: false,
        other: 'Renew motor vehicle',
      },
      numberOfWorkingDays: '1, 2',
      commutation: 'Not Requested',
    },
    {
      id: '66767',
      office: 'Information Communication & Technology',
      firstName: 'Ricardo',
      middleName: 'Raval',
      lastName: 'Narvaiza',
      dateOfFiling: '1-26-2023',
      position: 'Clerk Processor C',
      salary: 'P 999,000.00',
      typeOfLeave: 'Vacation Leave',
      detailsOfLeave: {
        withinThePhilippines: false,
        abroad: true,
        location: 'USA',
        inHospital: false,
        outPatient: false,
        illness: '',
        specialLeaveWomenIllness: '',
        sick: '',
        masterDegree: false,
        bar: false,
        monetization: false,
        terminal: false,
        other: '',
      },
      numberOfWorkingDays: '1, 2',
      commutation: 'Not Requested',
    },
  ];

  const pendingLeaveList = useLeaveStore((state) => state.pendingLeaveList);

  const fulfilledLeaveList = useLeaveStore((state) => state.fulfilledLeaveList);

  const setPendingLeaveList = useLeaveStore(
    (state) => state.setPendingLeaveList
  );

  const setFulfilledLeaveList = useLeaveStore(
    (state) => state.setFulfilledLeaveList
  );

  const tab = useLeaveStore((state) => state.tab);

  useEffect(() => {
    setPendingLeaveList(pendingLeave);
    setFulfilledLeaveList(fulfilledLeave);
  }, []);

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && <AllLeavesListTab leaves={pendingLeaveList} tab={tab} />}
        {tab === 2 && (
          <AllLeavesListTab leaves={fulfilledLeaveList} tab={tab} />
        )}
      </div>
    </>
  );
};
