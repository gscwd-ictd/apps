import { usePassSlipStore } from '../../../store/passslip.store';
import dayjs from 'dayjs';
import {
  PassSlipContents,
  SelectedPassSlip,
} from '../../../../src/types/passslip.type';

type AllPassSlipListTabProps = {
  passslips: Array<PassSlipContents> | null;
  tab: number;
};

export const AllPassSlipListTab = ({
  passslips,
  tab,
}: AllPassSlipListTabProps) => {
  const modal = usePassSlipStore((state) => state.modal);

  const setSelectedPassSlip = usePassSlipStore(
    (state) => state.setSelectedPassSlip
  );

  const setModal = usePassSlipStore((state) => state.setModal);

  const setSelectedPassSlipId = usePassSlipStore(
    (state) => state.setSelectedPassSlipId
  );

  const setAction = usePassSlipStore((state) => state.setAction);

  const onSelect = (passslip) => {
    setSelectedPassSlip(passslip);
    setSelectedPassSlipId(passslip.id);
    if (tab === 1) {
      if (!modal.isOpen) {
        setAction('Cancel Pass Slip');
        setModal({ ...modal, page: 2, isOpen: true });
      }
    } else if (tab === 2) {
      if (!modal.isOpen) {
        setAction('View');
        setModal({ ...modal, page: 3, isOpen: true });
      }
    }
  };

  return (
    <>
      {passslips && passslips.length > 0 ? (
        <ul className="mt-4">
          {passslips.map((item: PassSlipContents, index: number) => {
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
                    Date: {dayjs(item.dateOfApplication).format('MMMM d, YYYY')}
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
              ? 'pending pass slip application list'
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
