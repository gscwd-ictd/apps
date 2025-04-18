import { HiMail } from 'react-icons/hi';
import { TabHeader } from '../tab/TabHeader';
import { useInboxStore } from 'apps/portal/src/store/inbox.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { PsbMessageContent } from 'apps/portal/src/types/inbox.type';
import { useEffect, useState } from 'react';
import { NomineeStatus } from 'libs/utils/src/lib/enums/training.enum';
// eslint-disable-next-line @nx/enforce-module-boundaries

type TabsProps = {
  tab: number;
};

export const InboxTabs = ({ tab }: TabsProps) => {
  const { setTab, psbMessages, overtimeMessages, trainingMessages, patchResponseApply, putResponseApply } =
    useInboxStore((state) => ({
      setTab: state.setTab,
      psbMessages: state.message.psbMessages,
      overtimeMessages: state.message.overtimeMessages,
      trainingMessages: state.message.trainingMessages,
      patchResponseApply: state.response.patchResponseApply,
      putResponseApply: state.response.putResponseApply,
    }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [currentPendingPsbCount, setcurrentPendingPsbCount] = useState<number>(0);
  const [currentPendingTrainingCount, setcurrentPendingTrainingCount] = useState<number>(0);

  useEffect(() => {
    let pendingTraining = [];
    pendingTraining = trainingMessages.filter((e) => e.nomineeStatus === NomineeStatus.PENDING);
    setcurrentPendingTrainingCount(pendingTraining.length);
  }, [putResponseApply, trainingMessages]);

  //count any pending psb inbox action
  useEffect(() => {
    let pendingPsb = [];
    pendingPsb = psbMessages.filter((e) => !e.details.acknowledgedSchedule && !e.details.declinedSchedule);
    setcurrentPendingPsbCount(pendingPsb.length);
  }, [patchResponseApply, psbMessages]);

  return (
    <>
      <div className={`lg:h-auto lg:pt-0 lg:pb-10 h-full py-4 w-full px-5 overflow-y-auto`}>
        <ul className="flex flex-col md:flex-row lg:flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            onClick={() => {
              setTab(1);
            }}
            title="Pass Slip"
            icon={<HiMail size={26} />}
            subtitle="Notifications"
            notificationCount={0}
            className="bg-indigo-500"
          />

          <TabHeader
            tab={tab}
            tabIndex={2}
            onClick={() => {
              setTab(2);
            }}
            title="Leaves"
            icon={<HiMail size={26} />}
            subtitle="Notifications"
            notificationCount={0}
            className="bg-indigo-500"
          />

          <TabHeader
            tab={tab}
            tabIndex={3}
            onClick={() => {
              setTab(3);
            }}
            title="Overtime"
            icon={<HiMail size={26} />}
            subtitle="Notifications"
            notificationCount={overtimeMessages ? overtimeMessages.length : 0}
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={4}
            onClick={() => {
              setTab(4);
            }}
            title="Training"
            icon={<HiMail size={26} />}
            subtitle="Notifications"
            notificationCount={currentPendingTrainingCount}
            className="bg-indigo-500"
          />
          {Boolean(employeeDetails.employmentDetails.isHRMPSB) === true ? (
            <TabHeader
              tab={tab}
              tabIndex={5}
              onClick={() => {
                setTab(5);
              }}
              title="Personnel Selection Board"
              icon={<HiMail size={26} />}
              subtitle="Notifications"
              notificationCount={currentPendingPsbCount}
              className="bg-indigo-500"
            />
          ) : null}
        </ul>
      </div>
    </>
  );
};
