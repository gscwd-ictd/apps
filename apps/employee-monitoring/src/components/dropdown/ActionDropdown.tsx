import { Menu, Transition } from '@headlessui/react';
import { Fragment, FunctionComponent } from 'react';
import { createPortal } from 'react-dom';
import { useDtrStore } from '../../store/dtr.store';
import { EmployeeRowData } from '../../utils/types/table-row-types/monitoring/employee.type';

type ActionDropdownProps = {
  employee: EmployeeRowData;
};

const actionItems = ['Schedule', 'View Daily Time Record'];

export const ActionDropdown: FunctionComponent<ActionDropdownProps> = ({
  employee,
}) => {
  const { setDropdownAction, setSelectedEmployee } = useDtrStore((state) => ({
    setDropdownAction: state.setDropdownAction,
    setSelectedEmployee: state.setSelectedEmployee,
  }));

  const handleSelectAction = (item: string) => {
    setDropdownAction(item);
    setSelectedEmployee(employee);
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
                        href={
                          item === 'View Daily Time Record'
                            ? `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_FE_DOMAIN}/monitoring/daily-time-record/employee?id=${employee.id}`
                            : null
                        }
                        rel="noreferrer"
                        onClick={() => handleSelectAction(item)}
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
