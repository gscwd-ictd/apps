/* This example requires Tailwind CSS v2.0+ */
import React, { useContext } from 'react';
import { useEmployeeStore } from '../../../store/employee.store';
import { tabs, tabsHasPds } from '../../../../utils/constants/tabs';
import { FormWizard } from '../../modular/custom/FormWizard';
import { useTabStore } from '../../../store/tab.store';
import Image from 'next/image';
import gscwdlogo from '../../../../public/assets/img/gscwdlogo.png';
import { PageContentContext } from '@gscwd-apps/oneui';

export default function DarkNav() {
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const background = useTabStore((state) => state.background);
  const selectedTab = useTabStore((state) => state.selectedTab);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  const user = {
    name: `${employee.profile.firstName} ${employee.profile.lastName}`,
    email: 'example@gscwd.com',
    imageUrl: 'https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png',
  };

  return (
    <>
      <div className="fixed top-0 z-50 w-full">
        <div className={background}>
          <section className="min-w-full">
            <div className="flex w-full ">
              {/** 2*/}
              <div className="col-span-1 flex w-full justify-center  py-[0.2rem]">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    {/** IMAGE */}
                    <div className="flex ">
                      <div className="flex-shrink-0">
                        <Image
                          src={gscwdlogo}
                          priority
                          width={48}
                          height={48}
                          alt="General Santos City Water District"
                        />
                      </div>
                      <div className="hidden md:block"></div>
                    </div>
                    <div className="flex items-baseline">
                      {/* <HiDocumentChartBar size={30} /> */}
                      <span className="font-medium tracking-wide text-gray-700 uppercase select-none shrink-0 drop-shadow-xl sm:text-sm md:text-4xl">
                        Personal Data Sheet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/**2 */}
            </div>
          </section>
          {!isMobile ? (
            <nav className={`z-50 grid w-full justify-center pt-1  ${background}`}>
              {/* START OF TABS HERE */}

              <div className="justify-center overflow-x-auto  mx-5 ">
                <FormWizard
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  tabsLength={hasPds ? tabsHasPds.length : tabs.length}
                  tabs={hasPds ? tabsHasPds : tabs}
                />
              </div>

              {/*END OF TABS HERE */}
            </nav>
          ) : null}
        </div>
      </div>
    </>
  );
}
