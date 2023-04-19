import { usePassSlipStore } from '../../../store/passslip.store';
import dayjs from 'dayjs';
import { PassSlip } from '../../../../../../libs/utils/src/lib/types/pass-slip.type';

type AllPassSlipListTabProps = {
  passslips: Array<PassSlip> | null;
  tab: number;
};

export const AllPassSlipListTab = ({
  passslips,
  tab,
}: AllPassSlipListTabProps) => {
  //zustand initialization to access pass slip store
  const {
    pendingPassSlipModalIsOpen,
    completedPassSlipModalIsOpen,
    getPassSlip,
    setPendingPassSlipModalIsOpen,
    setCompletedPassSlipModalIsOpen,
  } = usePassSlipStore((state) => ({
    pendingPassSlipModalIsOpen: state.pendingPassSlipModalIsOpen,
    completedPassSlipModalIsOpen: state.completedPassSlipModalIsOpen,
    getPassSlip: state.getPassSlip,
    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setCompletedPassSlipModalIsOpen: state.setCompletedPassSlipModalIsOpen,
  }));

  const onSelect = (passslip) => {
    getPassSlip(passslip);
    //PENDING PASS SLIPS
    if (tab === 1) {
      if (!pendingPassSlipModalIsOpen) {
        setPendingPassSlipModalIsOpen(true);
      }
      //COMPLETED PASS SLIPS
    } else if (tab === 2) {
      if (!completedPassSlipModalIsOpen) {
        setCompletedPassSlipModalIsOpen(true);
      }
    }
  };

  return (
    <>
      {passslips && passslips.length > 0 ? (
        <ul className="mt-4">
          {passslips.map((item: PassSlip, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(item)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-xl text-gray-600">
                    {item.natureOfBusiness}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Date:{' '}
                    {dayjs(item.dateOfApplication).format('MMMM DD, YYYY')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Estimated Hours: {item.estimateHours}
                  </p>
                  <p className="text-xs text-gray-500">
                    Purpose: {item.purposeDestination}
                  </p>

                  <p className="text-xs text-indigo-500">
                    Status: {item.status}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">
            No{' '}
            {tab === 1
              ? 'ongoing pass slip application list'
              : tab === 2
              ? 'completed pass slip application list'
              : ''}{' '}
            at the moment
          </h1>
        </div>
      )}
    </>
  );
};
