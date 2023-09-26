/* eslint-disable @nx/enforce-module-boundaries */
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { OvertimeDetails } from 'libs/utils/src/lib/types/overtime.type';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type TabProps = {
  overtime: Array<OvertimeDetails>;
  tab: number;
};

export const AllOvertimeListTab = ({ overtime, tab }: TabProps) => {
  const {
    pendingOvertimeModalIsOpen,
    completedOvertimeModalIsOpen,

    setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen,
    setOvertimeDetails,
  } = useOvertimeStore((state) => ({
    pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
    completedOvertimeModalIsOpen: state.completedOvertimeModalIsOpen,
    setOvertimeDetails: state.setOvertimeDetails,
    setPendingOvertimeModalIsOpen: state.setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen: state.setCompletedOvertimeModalIsOpen,
  }));

  const OnSelect = (overtime: OvertimeDetails) => {
    setOvertimeDetails(overtime);
    if (tab === 1) {
      if (!pendingOvertimeModalIsOpen) {
        setPendingOvertimeModalIsOpen(true);
      }
    } else if (tab === 2) {
      if (!completedOvertimeModalIsOpen) {
        setCompletedOvertimeModalIsOpen(true);
      }
    }
  };

  return (
    <>
      {overtime && overtime.length > 0 ? (
        <ul className={'mt-4 lg:mt-0'}>
          {overtime.map((overtime: OvertimeDetails, index: number) => {
            return (
              <li
                key={index}
                onClick={() => OnSelect(overtime)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-lg text-gray-600">{DateFormatter(overtime.plannedDate)}</h1>
                  <p className="text-sm text-gray-500">Estimated Hours: {overtime.estimatedHours}</p>
                  <p className="text-sm text-gray-500">No. of Employees: {overtime.employees.length}</p>
                  <p className="text-sm text-indigo-500">Status: {overtime.status.toUpperCase()}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">
            No{' '}
            {tab === 1 ? 'pending overtime application list' : tab === 2 ? 'completed overtime application list' : ''}{' '}
            at the moment
          </h1>
        </div>
      )}
    </>
  );
};
