import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../utils/hoc/fetcher';
import { useEmployeeStore } from '../../../store/employee.store';
import { useApprovalStore } from '../../../../src/store/approvals.store';
import { AllApprovalsTab } from './AllApprovalsTab';

type ApprovalTabWindowProps = {
  employeeId: string;
};

export const ApprovalsTabWindow = ({
  employeeId,
}: ApprovalTabWindowProps): JSX.Element => {
  // const pendingUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/${employeeId}/pending`;
  // const fulfilledUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/${employeeId}/selected`;
  // const { data: pendingPublications } = useSWR(pendingUrl, fetchWithSession);

  // const { data: fulfilledPublications } = useSWR(
  //   fulfilledUrl,
  //   fetchWithSession
  // );

  const pendingPassSlipsApprovals = [
    {
      id: '5',
      date: '1/20/2023',
      natureOfBusiness: 'Personal Business',
      estimatedHours: 1,
      purpose: 'Finding Nemo',
      modeOfTransportation: null,
    },
  ];

  const approvedPassSlipsApprovals = [
    {
      id: '1',
      date: '1/15/2023',
      natureOfBusiness: 'Personal Business',
      estimatedHours: 1,
      purpose: 'Find my Nissan Almera',
      modeOfTransportation: null,
    },
    {
      id: '2',
      date: '1/16/2023',
      natureOfBusiness: 'Official Business',
      estimatedHours: 3,
      purpose:
        'Fighting and hostilities over the weekend killed and injured civilians, while critical facilities, including several hospitals, were damaged on both sides of the frontline.On Saturday evening, dozens of civilians were reportedly killed or injured during an attack on a hospital in Novoaidar in the part of the Luhansk region currently under military control of the Russian Federation.Earlier during the same day, another health facility was reportedly hit in areas under Russian control in the Kherson region.On Sunday, attacks were reported in Kherson city and other parts of the region that are under Ukrainian control. Health workers were reportedly injured when the Kherson Clinical Hospital was hit. Other civilians were killed or injured and civilian infrastructure, including homes and a school, were damaged.',
      modeOfTransportation: 'Office Vehicle',
    },
    {
      id: '42',
      date: '1/16/2023',
      natureOfBusiness: 'Official Business',
      estimatedHours: 3,
      purpose: 'Find my Nissan Almera',
      modeOfTransportation: 'Office Vehicle',
    },
  ];

  const diapprovedPassSlipsApprovals = [
    {
      id: '12',
      date: '1/15/2023',
      natureOfBusiness: 'Personal Business',
      estimatedHours: 1,
      purpose: 'Find my Nissan Almera',
      modeOfTransportation: null,
    },
    {
      id: '3323',
      date: '1/16/2023',
      natureOfBusiness: 'Official Business',
      estimatedHours: 3,
      purpose:
        'Fighting and hostilities over the weekend killed and injured civilians, while critical facilities, including several hospitals, were damaged on both sides of the frontline.On Saturday evening, dozens of civilians were reportedly killed or injured during an attack on a hospital in Novoaidar in the part of the Luhansk region currently under military control of the Russian Federation.Earlier during the same day, another health facility was reportedly hit in areas under Russian control in the Kherson region.On Sunday, attacks were reported in Kherson city and other parts of the region that are under Ukrainian control. Health workers were reportedly injured when the Kherson Clinical Hospital was hit. Other civilians were killed or injured and civilian infrastructure, including homes and a school, were damaged.',
      modeOfTransportation: 'Office Vehicle',
    },
  ];

  const pendingLeaveApprovals = [
    {
      id: '12323',
      office: 'ICTD',
      firstName: 'Ricardo',
      middleName: 'Raval',
      lastName: 'Narvaiza',
      dateOfFiling: '1/20/2023',
      position: 'Clerk Processor C',
      salary: '9999.00',
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
      numberOfWorkingDays: '3 - January 21, 22, 23, 2023',
      commutation: 'Requested',
    },
  ];

  const approvedLeaveApprovals = [
    {
      id: '123233434',
      office: 'ICTD',
      firstName: 'Ricardosss',
      middleName: 'Raval',
      lastName: 'Narvaiza',
      dateOfFiling: '1/20/2023',
      position: 'Clerk Processor C',
      salary: '9999.00',
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
      numberOfWorkingDays: '1',
      commutation: 'Requested',
    },
  ];

  const disapprovedLeaveApprovals = [
    {
      id: '65543',
      office: 'ICTD',
      firstName: 'Ricardoww',
      middleName: 'Raval',
      lastName: 'Narvaiza',
      dateOfFiling: '1/20/2023',
      position: 'Clerk Processor C',
      salary: '9999.00',
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
      numberOfWorkingDays: '1',
      commutation: 'Requested',
    },
    {
      id: '6552243',
      office: 'ICTD',
      firstName: 'Ricardoww',
      middleName: 'Raval',
      lastName: 'Narvaiza',
      dateOfFiling: '1/20/2023',
      position: 'Clerk Processor C',
      salary: '9999.00',
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
      numberOfWorkingDays: '1',
      commutation: 'Requested',
    },
  ];

  //get initial values from store
  const pendingPassSlipList = useApprovalStore(
    (state) => state.pendingPassSlipList
  );

  const approvedPassSlipList = useApprovalStore(
    (state) => state.approvedPassSlipList
  );

  const disapprovedPassSlipList = useApprovalStore(
    (state) => state.disapprovedPassSlipList
  );

  const pendingLeaveList = useApprovalStore((state) => state.pendingLeaveList);

  const approvedLeaveList = useApprovalStore(
    (state) => state.approvedLeaveList
  );

  const disapprovedLeaveList = useApprovalStore(
    (state) => state.disapprovedLeaveList
  );

  const setPendingPassSlipList = useApprovalStore(
    (state) => state.setPendingPassSlipList
  );
  const setApprovedPassSlipList = useApprovalStore(
    (state) => state.setApprovedPassSlipList
  );
  const setDisapprovedPassSlipList = useApprovalStore(
    (state) => state.setDisapprovedPassSlipList
  );
  const setPendingLeaveList = useApprovalStore(
    (state) => state.setPendingLeaveList
  );
  const setApprovedLeaveList = useApprovalStore(
    (state) => state.setApprovedLeaveList
  );
  const setDisapprovedLeaveList = useApprovalStore(
    (state) => state.setDisapprovedLeaveList
  );

  const tab = useApprovalStore((state) => state.tab);

  const selectedApprovalType = useApprovalStore(
    (state) => state.selectedApprovalType
  );
  const setSelectedApprovalType = useApprovalStore(
    (state) => state.setSelectedApprovalType
  );

  useEffect(() => {
    // setPendingPassSlipList(pendingPassSlipsApprovals);
    // setApprovedPassSlipList(approvedPassSlipsApprovals);
    // setDisapprovedPassSlipList(diapprovedPassSlipsApprovals);

    setPendingLeaveList(pendingLeaveApprovals);
    setApprovedLeaveList(approvedLeaveApprovals);
    setDisapprovedLeaveList(disapprovedLeaveApprovals);
  }, []);

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && selectedApprovalType === 1 && (
          <AllApprovalsTab
            passslips={pendingPassSlipList}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 2 && selectedApprovalType === 1 && (
          <AllApprovalsTab passslips={[]} tab={tab} leaves={pendingLeaveList} />
        )}
        {tab === 3 && selectedApprovalType === 2 && (
          <AllApprovalsTab
            passslips={approvedPassSlipList}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 4 && selectedApprovalType === 2 && (
          <AllApprovalsTab
            passslips={[]}
            tab={tab}
            leaves={approvedLeaveList}
          />
        )}
        {tab === 5 && selectedApprovalType === 3 && (
          <AllApprovalsTab
            passslips={disapprovedPassSlipList}
            tab={tab}
            leaves={[]}
          />
        )}
        {tab === 6 && selectedApprovalType === 3 && (
          <AllApprovalsTab
            passslips={[]}
            tab={tab}
            leaves={disapprovedLeaveList}
          />
        )}
      </div>
    </>
  );
};
