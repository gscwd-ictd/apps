import { BasicInfoPanel } from '../panels/BasicInfoPanel';
import { EducationalBgPanel } from '../panels/EducationalBgPanel';
import EligibilityPanel from '../panels/EligibilityPanel';
import FamilyBgPanel from '../panels/FamilyBgPanel';
import LNDPanel from '../panels/LNDPanel';
import OtherInfoPanel from '../panels/OtherInfoPanel';
import OtherInfoIIPanel from '../panels/OtherInfoIIPanel';
import VolWorkPanel from '../panels/VolWorkPanel';
import WorkExpPanel from '../panels/WorkExpPanel';
import ReviewPanel from '../panels/ReviewPanel';
import SubmitPanel from '../panels/SubmitPanel';
import { RefErrorProvider } from '../../../context/RefErrorContext';
import DarkNav from '../navigation/DarkNav';
import { ErrorProvider } from '../../../context/ErrorContext';
import { useTabStore } from '../../../store/tab.store';
import { tabs, tabsHasPds } from '../../../../utils/constants/tabs';
import { useEffect, useState } from 'react';
import {
  NotificationController,
  useNotification,
} from '../../../../../../libs/oneui/src/components/Notification';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';

export const NavTab = (): JSX.Element => {
  // get selected tab from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const [allTabs, setAllTabs] = useState<any>([] as any);
  const { notifRef, notify } = useNotification();

  useEffect(() => {
    if (hasPds) setAllTabs(tabsHasPds);
    else setAllTabs(tabs);
  }, [hasPds]);

  // set notification controller

  return (
    <>
      <div tabIndex={-1}>
        {/* <SideNav action={logout} /> */}
        <DarkNav />
      </div>
      <div>
        {/* Main DIV */}

        <NotificationContext.Provider value={{ notify }}>
          <div className="mt-16">
            {allTabs.map((tab: any) => {
              const { tabIndex } = tab;
              return (
                <div key={tabIndex} className="flex p-0 space-x-1 rounded-sm ">
                  {tabIndex === 1 && selectedTab === tabIndex ? (
                    <>
                      {/* PERSONAL INFO */}
                      <ErrorProvider>
                        <BasicInfoPanel />
                      </ErrorProvider>
                    </>
                  ) : tabIndex === 2 && selectedTab === tabIndex ? (
                    <>
                      {/* FAMILY BACKGROUND */}
                      <FamilyBgPanel />
                    </>
                  ) : tabIndex === 3 && selectedTab === tabIndex ? (
                    <>
                      {/* EDUCATIONAL BACKGROUND */}
                      <EducationalBgPanel />
                    </>
                  ) : tabIndex === 4 && selectedTab === tabIndex ? (
                    <>
                      {/* ELIGIBILITY */}
                      <EligibilityPanel />
                    </>
                  ) : tabIndex === 5 && selectedTab === tabIndex ? (
                    <>
                      {/* WORK EXPERIENCE */}
                      <WorkExpPanel />
                    </>
                  ) : tabIndex === 6 && selectedTab === tabIndex ? (
                    <>
                      {/* WORK EXPERIENCE */}
                      <VolWorkPanel />
                    </>
                  ) : tabIndex === 7 && selectedTab === tabIndex ? (
                    <>
                      {/* L&D */}
                      <LNDPanel />
                    </>
                  ) : tabIndex === 8 && selectedTab === tabIndex ? (
                    <>
                      {/* OTHER INFO PART 1 */}
                      <OtherInfoPanel />
                    </>
                  ) : tabIndex === 9 && selectedTab === tabIndex ? (
                    <>
                      {/*OTHER INFO PART 2*/}
                      <RefErrorProvider>
                        <OtherInfoIIPanel />
                      </RefErrorProvider>
                    </>
                  ) : tabIndex === 10 && selectedTab === tabIndex ? (
                    <>
                      {/*WORK SHEET*/}
                      {/* <WorkSheetPanel /> */}
                      <ReviewPanel />
                    </>
                  ) : tabIndex === 11 && selectedTab === tabIndex ? (
                    <>
                      {/*REVIEW*/}
                      {/* <ReviewPanel /> */}
                      <SubmitPanel />
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
          <NotificationController
            ref={notifRef}
            position="top-right"
            autoClose={true}
            duration={1200}
          />
        </NotificationContext.Provider>
      </div>
    </>
  );
};
