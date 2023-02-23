/* This example requires Tailwind CSS v2.0+ */
import React from 'react';
import { useEmployeeStore } from '../../../store/employee.store';
import { tabs, tabsHasPds } from '../../../../utils/constants/tabs';
import { FormWizard } from '../../modular/custom/FormWizard';
import { useTabStore } from '../../../store/tab.store';

export default function DarkNav() {
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const background = useTabStore((state) => state.background);
  const selectedTab = useTabStore((state) => state.selectedTab);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const user = {
    name: `${employee.profile.firstName} ${employee.profile.lastName}`,
    email: 'example@gscwd.com',
    imageUrl:
      'https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png',
  };

  return (
    <>
      <div className="fixed top-0 z-50 w-full">
        <div className={background}>
          <section className="min-w-full">
            <div className="flex w-full">
              {/** 2*/}
              <div className="col-span-1 flex w-full justify-center  py-[0.2rem]">
                <div className="flex items-center">
                  <div className="flex md:block">
                    <div className="flex items-baseline">
                      {/* <HiDocumentChartBar size={30} /> */}
                      <span className="shrink-0 select-none  font-medium uppercase  tracking-wide text-gray-700  drop-shadow-xl sm:text-sm md:text-4xl">
                        Personal Data Sheet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/**2 */}
            </div>
          </section>
          <nav className={`z-50 grid w-full justify-center pt-1 ${background}`}>
            {/* START OF TABS HERE */}

            <div className="justify-center overflow-x-auto">
              <FormWizard
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabsLength={hasPds ? tabsHasPds.length : tabs.length}
                tabs={hasPds ? tabsHasPds : tabs}
              />
            </div>

            {/*END OF TABS HERE */}
          </nav>
        </div>
      </div>
    </>
  );
}
