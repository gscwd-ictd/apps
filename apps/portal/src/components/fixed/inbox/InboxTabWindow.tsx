import { AllInboxListTab } from './AllInboxListTab';
import { useInboxStore } from 'apps/portal/src/store/inbox.store';

export const InboxTabWindow = (): JSX.Element => {
  const { tab } = useInboxStore((state) => ({
    tab: state.tab,
  }));

  return (
    <>
      <div className={`w-full bg-inherit rounded px-5 h-[30rem] overflow-y-auto`}>
        <AllInboxListTab tab={tab} />
      </div>
    </>
  );
};
