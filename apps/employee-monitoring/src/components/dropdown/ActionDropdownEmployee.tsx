/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import { useDtrStore } from '../../store/dtr.store';
import { EmployeeRowData } from '../../utils/types/table-row-types/monitoring/employee.type';
import { useRouter } from 'next/router';
import { EmployeeDtrWithSummary } from 'libs/utils/src/lib/types/dtr.type';
import * as Popover from '@radix-ui/react-popover';
import * as Separator from '@radix-ui/react-separator';

type ActionDropdownProps = {
  employee: EmployeeRowData;
};

const actionItems = ['View Daily Time Record', 'View Leave Ledger'];

export const ActionDropdownEmployee: FunctionComponent<ActionDropdownProps> = ({ employee }) => {
  const router = useRouter();

  const { setDropdownAction, setSelectedEmployee } = useDtrStore((state) => ({
    setDropdownAction: state.setDropdownAction,
    setSelectedEmployee: state.setSelectedEmployee,
  }));

  const { setEmployeeDtr, setSelectedMonth, setSelectedYear } = useDtrStore((state) => ({
    setEmployeeDtr: state.setEmployeeDtr,
    setSelectedMonth: state.setSelectedMonth,
    setSelectedYear: state.setSelectedYear,
  }));

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
      <Popover.Root>
        <Popover.Trigger
          className="h-full  select-none border border-gray-200 whitespace-nowrap rounded bg-slate-500 px-3 py-[0.2rem] transition-colors ease-in-out hover:bg-slate-400 active:bg-slate-600"
          asChild
          tabIndex={-1}
        >
          <span className="text-white">...</span>
        </Popover.Trigger>

        <Popover.Content
          className="shadow-2xl PopoverContent"
          sideOffset={5}
          collisionPadding={20}
          avoidCollisions
          // style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          {actionItems.map((item: string, idx: number) => {
            return (
              <div key={idx} className="z-50 flex w-full bg-white outline-none ring-0">
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
                  className={`active:bg-cyan-600 focus:bg-slate-300 hover:bg-slate-600 hover:text-white group text-xs flex w-full items-center py-3 px-4 z-50`}
                >
                  {item}
                </a>
              </div>
            );
          })}
        </Popover.Content>
        {/* menu items here */}
      </Popover.Root>
    </>
  );
};
