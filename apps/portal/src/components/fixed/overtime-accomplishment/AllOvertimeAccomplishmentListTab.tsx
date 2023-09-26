/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import { OvertimeAccomplishment } from 'libs/utils/src/lib/types/overtime.type';

type TabProps = {
  overtime: Array<OvertimeAccomplishment>;
  tab: number;
};

export const AllOvertimeAccomplishmentListTab = ({ overtime, tab }: TabProps) => {
  const {
    pendingOvertimeAccomplishmentModalIsOpen,
    completedOvertimeAccomplishmentModalIsOpen,

    setPendingOvertimeAccomplishmentModalIsOpen,
    setCompletedOvertimeAccomplishmentModalIsOpen,
    setOvertimeDetails,
  } = useOvertimeAccomplishmentStore((state) => ({
    pendingOvertimeAccomplishmentModalIsOpen: state.pendingOvertimeAccomplishmentModalIsOpen,
    completedOvertimeAccomplishmentModalIsOpen: state.completedOvertimeAccomplishmentModalIsOpen,
    setOvertimeDetails: state.setOvertimeDetails,
    setPendingOvertimeAccomplishmentModalIsOpen: state.setPendingOvertimeAccomplishmentModalIsOpen,
    setCompletedOvertimeAccomplishmentModalIsOpen: state.setCompletedOvertimeAccomplishmentModalIsOpen,
  }));

  const OnSelect = (overtime: OvertimeAccomplishment) => {
    setOvertimeDetails(overtime);
    if (tab === 1) {
      if (!pendingOvertimeAccomplishmentModalIsOpen) {
        setPendingOvertimeAccomplishmentModalIsOpen(true);
      }
    } else if (tab === 2) {
      if (!completedOvertimeAccomplishmentModalIsOpen) {
        setCompletedOvertimeAccomplishmentModalIsOpen(true);
      }
    }
  };

  return (
    <>
      {overtime && overtime.length > 0 ? (
        <ul className="mt-0">
          {overtime.map((overtime: OvertimeAccomplishment, index: number) => {
            return (
              <li
                key={index}
                onClick={() => OnSelect(overtime)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-lg text-gray-600">
                    {dayjs(overtime.plannedDate).format('MMMM DD, YYYY')}
                  </h1>
                  {/* <p className="text-sm text-gray-500">
                    Planned Date: {dayjs(overtime.plannedDate).format('MMMM DD, YYYY')}
                  </p> */}
                  <p className="text-sm text-gray-500">Purpose: {overtime.purpose}</p>
                  <p className="text-sm text-gray-500">Estimated Hours: {overtime.computedIvmsHours}</p>
                  <p className="text-sm text-indigo-500">Status: {overtime.status?.toUpperCase()}</p>
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
              ? 'pending overtime accomplishment list'
              : tab === 2
              ? 'completed overtime accomplishment list'
              : ''}{' '}
            at the moment
          </h1>
        </div>
      )}
    </>
  );
};
