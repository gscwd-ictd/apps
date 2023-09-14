/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import {
  EmployeeOvertimeDetail,
  OvertimeAccomplishmentDetails,
  useOvertimeAccomplishmentStore,
} from 'apps/portal/src/store/overtime-accomplishment.store';

type TabProps = {
  overtime: Array<OvertimeAccomplishmentDetails>;
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

  const OnSelect = (overtime: OvertimeAccomplishmentDetails) => {
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
          {overtime.map((overtime: OvertimeAccomplishmentDetails, index: number) => {
            return (
              <li
                key={index}
                onClick={() => OnSelect(overtime)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-lg text-gray-600">Overtime - {overtime.status?.toUpperCase()}</h1>

                  <p className="text-sm text-gray-500">Estimated Hours: {overtime.estimatedHours}</p>
                  <p className="text-sm text-gray-500">
                    Employees:{' '}
                    {overtime.employees.map((employee: EmployeeOvertimeDetail, index: number) => {
                      return (
                        <label key={index}>
                          {index == 0 ? null : ', '}
                          {employee.fullName}
                        </label>
                      );
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    Planned Date: {dayjs(overtime.plannedDate).format('MMMM DD, YYYY')}
                  </p>
                  <p className="text-sm text-indigo-500">Purpose: {overtime.purpose}</p>
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
