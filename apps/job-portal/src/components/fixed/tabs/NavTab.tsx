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
import { FormWizard } from '../../modular/custom/FormWizard';
import { RefErrorProvider } from '../../../context/RefErrorContext';
import { useRouter } from 'next/router';
import DarkNav from '../navigation/DarkNav';
import { ErrorProvider } from '../../../context/ErrorContext';
import { useTabStore } from '../../../store/tab.store';
import { tabs } from '../../../../utils/constants/tabs';
import TopNavigation from '../../page-header/TopNavigation';
import { HiArrowSmLeft } from 'react-icons/hi';
import { useContext, useState } from 'react';
import { usePublicationStore } from '../../../store/publication.store';
import { Alert, Button, PageContentContext } from '@gscwd-apps/oneui';

export const NavTab = (): JSX.Element => {
  // get selected tab from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);
  const publication = usePublicationStore((state) => state.publication);
  const router = useRouter(); // initialize router
  const [cancelAlertIsOpen, setCancelAlertIsOpen] = useState<boolean>(false);

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  return (
    <>
      <div className="fixed top-0 z-50 w-full" tabIndex={-1}>
        <TopNavigation />
        <button
          className="flex items-center gap-2 mb-5 text-gray-500 transition-colors ease-in-out hover:text-gray-700"
          onClick={() => setCancelAlertIsOpen(true)}
        >
          <HiArrowSmLeft className="w-5 h-5" />
          <span className="font-medium">Go back</span>
        </button>
        <header className="fixed top-0 z-50 flex justify-center w-full -mt-3">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="w-full subpixel-antialiased font-medium tracking-widest text-white uppercase select-none shrink-0 drop-shadow-lg sm:text-sm md:text-4xl">
              Personal Data Sheet
            </h1>
          </div>
        </header>
      </div>
      <Alert open={cancelAlertIsOpen} setOpen={setCancelAlertIsOpen}>
        <Alert.Description>
          <div className="flex justify-center w-full h-full">
            Any unsaved changes you have made will be discarded. Do you want to proceed?
          </div>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <Button onClick={() => setCancelAlertIsOpen(false)} className="w-[6rem]">
              No
            </Button>

            <Button
              onClick={() => {
                router.push(`${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${publication.vppId}/checklist`);
                setCancelAlertIsOpen(false);
                setSelectedTab(1);
              }}
              className="w-[6rem]"
            >
              Yes
            </Button>
          </div>
        </Alert.Footer>
      </Alert>
      {/* <div className="fixed top-0 z-50" tabIndex={-1}>
        <SideNav action={logout} />
        <DarkNav action={logout} />
      </div> */}
      <div>
        {/* Main DIV */}

        <nav className="fixed top-0 z-40 grid justify-center w-full bg-slate-100">
          {/* START OF TABS HERE */}

          {!isMobile && (
            <div className="justify-center mt-20 overflow-x-auto">
              <FormWizard
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabsLength={tabs.length}
                tabs={tabs}
              />
            </div>
          )}

          {/*END OF TABS HERE */}
        </nav>

        <div className="sm:mt-0 lg:mt-24">
          {tabs.map((tab) => {
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
                ) : (
                  // : tabIndex === 12 && selectedTab === tabIndex ?
                  //   (
                  //     <>
                  //       {/*SUBMIT */}
                  //       <SubmitPanel />
                  //     </>
                  //   )
                  <></>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
