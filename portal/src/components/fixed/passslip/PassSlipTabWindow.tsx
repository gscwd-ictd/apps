import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../utils/hoc/fetcher';
import { useEmployeeStore } from '../../../store/employee.store';
import { AllPassSlipListTab } from './AllPassSlipListTab';
import { usePassSlipStore } from '../../../../src/store/passslip.store';

type PassSlipTabWindowProps = {
  employeeId: string;
};

export const PassSlipTabWindow = ({
  employeeId,
}: PassSlipTabWindowProps): JSX.Element => {
  // const pendingUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/${employeeId}/pending`;
  // const fulfilledUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/${employeeId}/selected`;
  // const { data: pendingPublications } = useSWR(pendingUrl, fetchWithSession);

  // const { data: fulfilledPublications } = useSWR(
  //   fulfilledUrl,
  //   fetchWithSession
  // );

  const pendingPassSlips = [
    {
      id: '5',
      date: '1/20/2023',
      natureOfBusiness: 'Personal Business',
      estimatedHours: 1,
      purpose: 'Find myself',
      modeOfTransportation: null,
    },
  ];

  const fulfilledPassSlips = [
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
    {
      id: '332',
      date: '1/16/2023',
      natureOfBusiness: 'Official Business',
      estimatedHours: 3,
      purpose: 'Find my Nissan Almera',
      modeOfTransportation: 'Office Vehicle',
    },
    {
      id: '266',
      date: '1/16/2023',
      natureOfBusiness: 'Official Business',
      estimatedHours: 3,
      purpose: 'Find my Nissan Almera',
      modeOfTransportation: 'Office Vehicle',
    },
  ];

  const pendingPassSlipList = usePassSlipStore(
    (state) => state.pendingPassSlipList
  );

  const fulfilledPassSlipList = usePassSlipStore(
    (state) => state.fulfilledPassSlipList
  );

  const setPendingPassSlipList = usePassSlipStore(
    (state) => state.setPendingPassSlipList
  );

  const setFulfilledPassSlipList = usePassSlipStore(
    (state) => state.setFulfilledPassSlipList
  );

  const tab = usePassSlipStore((state) => state.tab);

  useEffect(() => {
    setPendingPassSlipList(pendingPassSlips);
    setFulfilledPassSlipList(fulfilledPassSlips);
  },[])

  return (
    <>
      <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
        {tab === 1 && (
          <AllPassSlipListTab passslips={pendingPassSlipList} tab={tab} />
        )}
        {tab === 2 && (
          <AllPassSlipListTab passslips={fulfilledPassSlipList} tab={tab} />
        )}
      </div>
    </>
  );
};
