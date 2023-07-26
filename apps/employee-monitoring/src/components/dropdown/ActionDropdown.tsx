/* eslint-disable @nx/enforce-module-boundaries */
import { Menu, Transition } from '@headlessui/react';
import { Fragment, FunctionComponent } from 'react';
import { useDtrStore } from '../../store/dtr.store';
import { EmployeeRowData } from '../../utils/types/table-row-types/monitoring/employee.type';
import { useRouter } from 'next/router';
import { EmployeeDtrWithSummary } from 'libs/utils/src/lib/types/dtr.type';

type ActionDropdownProps = {
  employee: EmployeeRowData;
};

const actionItems = ['View Daily Time Record', 'View Leave Ledger'];

export const ActionDropdown: FunctionComponent<ActionDropdownProps> = ({
  employee,
}) => {
  const router = useRouter();

  const { setDropdownAction, setSelectedEmployee } = useDtrStore((state) => ({
    setDropdownAction: state.setDropdownAction,
    setSelectedEmployee: state.setSelectedEmployee,
  }));

  const { setEmployeeDtr, setSelectedMonth, setSelectedYear } = useDtrStore(
    (state) => ({
      setEmployeeDtr: state.setEmployeeDtr,
      setSelectedMonth: state.setSelectedMonth,
      setSelectedYear: state.setSelectedYear,
    })
  );

  const handleSelectAction = (item: string) => {
    setDropdownAction(item);
    setSelectedEmployee(employee);
    if (item === 'View Daily Time Record') {
      setEmployeeDtr({ dtrDays: [], summary: {} as EmployeeDtrWithSummary });
      setSelectedMonth('--');
      setSelectedYear('--');
      router.push(`/employees/${employee.id}/daily-time-record`);
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="h-full whitespace-nowrap rounded-md border-2 border-slate-100 bg-slate-300 px-3 py-[0.2rem] text-gray-700 transition-colors ease-in-out hover:bg-slate-200 active:bg-slate-300">
            <span>...</span>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            as="div"
            className={`shadow-gray absolute right-0 z-50 mb-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            {actionItems.map((item: string, idx: number) => {
              return (
                <div key={idx}>
                  <Menu.Item as="section">
                    {({ active }) => (
                      <a
                        rel="noreferrer"
                        // onClick={() => handleSelectAction(item)}
                        target="_blank"
                        href={`/employees/${employee.id}/${
                          item === 'View Daily Time Record'
                            ? 'daily-time-record'
                            : item === 'View Leave Ledger'
                            ? 'leave-ledger'
                            : ''
                        }`}
                        className={`${
                          active ? 'bg-slate-50 text-white' : 'text-gray-500'
                        } hover:bg-slate-600 group flex w-full items-center rounded py-3 px-4`}
                      >
                        {item}
                      </a>
                    )}
                  </Menu.Item>
                </div>
              );
            })}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
