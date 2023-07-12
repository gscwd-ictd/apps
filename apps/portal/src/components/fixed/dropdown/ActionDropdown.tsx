// import { Menu, Transition } from '@headlessui/react';
import { FunctionComponent } from 'react';
import { useAppSelectionStore } from 'apps/portal/src/store/selection.store';
import { ApplicantWithScores } from 'apps/portal/src/types/selection.type';
import * as Popover from '@radix-ui/react-popover';

const actionItems = ['PDS', 'PSB Remarks'];

type ActionDropdownProps = {
  applicant: ApplicantWithScores;
};

export const ActionDropdown: FunctionComponent<ActionDropdownProps> = ({
  applicant,
}) => {
  const {
    selectedPublication,
    setSelectedApplicantDetails,
    setDropdownAction,
    setShowPdsAlert,
    setShowPsbDetailsAlert,
  } = useAppSelectionStore((state) => ({
    setSelectedApplicantDetails: state.setSelectedApplicantDetails,
    setDropdownAction: state.setDropdownAction,
    setShowPdsAlert: state.setShowPdsAlert,
    setShowPsbDetailsAlert: state.setShowPsbDetailsAlert,
    selectedPublication: state.selectedPublication,
  }));

  const handleSelectAction = (e: any, item: string) => {
    // setDropdownAction(item);
    // e.preventDefault();

    setSelectedApplicantDetails({
      applicantId: applicant.applicantId,
      applicantType: applicant.applicantType,
      postingApplicantId: applicant.postingApplicantId,
      applicantName: applicant.applicantName,
      applicantAvgScore: applicant.average,
      positionTitle: selectedPublication.positionTitle,
      rank: applicant.rank,
    });
    if (item === 'PDS') {
      // do this

      setShowPdsAlert(true);
      setDropdownAction('PDS');
    } else if (item === 'PSB Remarks') {
      // do that
      // postingApplicantId
      setShowPsbDetailsAlert(true);
      setDropdownAction('PSB');
    }
  };

  return (
    <>
      <Popover.Root>
        <Popover.Trigger
          className="h-full select-none border border-gray-400 whitespace-nowrap rounded bg-slate-500 px-3 py-[0.2rem] transition-colors ease-in-out hover:bg-slate-400 active:bg-slate-600"
          asChild
        >
          <span className="text-white">...</span>
        </Popover.Trigger>

        <Popover.Content
          className="PopoverContent"
          sideOffset={5}
          // style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          {actionItems.map((item: string, idx: number) => {
            return (
              <div key={idx} className="w-full z-50 bg-white flex">
                <a
                  rel="noreferrer"
                  onClick={(e) => handleSelectAction(e, item)}
                  target="_blank"
                  // href={`/employees/${employee.id}`}
                  className={`hover:bg-slate-600 hover:text-white group text-sm flex w-full items-center py-3 px-4 z-50`}
                >
                  {item}
                </a>
              </div>
            );
          })}
        </Popover.Content>
      </Popover.Root>
    </>
  );
};
