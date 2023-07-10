import { Menu, Transition } from '@headlessui/react';
import { Fragment, FunctionComponent } from 'react';
import { useAppSelectionStore } from 'apps/portal/src/store/selection.store';
import { ApplicantWithScores } from 'apps/portal/src/types/selection.type';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const actionItems = ['PDS', 'PSB Remarks'];

type ActionDropdownProps = {
  applicant: ApplicantWithScores;
};

export const ActionDropdown: FunctionComponent<ActionDropdownProps> = ({
  applicant,
}) => {
  const { setSelectedApplicantDetails, setDropdownAction, setShowPdsAlert } =
    useAppSelectionStore((state) => ({
      setSelectedApplicantDetails: state.setSelectedApplicantDetails,
      setDropdownAction: state.setDropdownAction,
      setShowPdsAlert: state.setShowPdsAlert,
    }));

  const handleSelectAction = (item: string) => {
    // setDropdownAction(item);

    if (item === 'PDS') {
      // do this
      setSelectedApplicantDetails({
        applicantId: applicant.applicantId,
        applicantType: applicant.applicantType,
      });
      setShowPdsAlert(true);
      setDropdownAction('PDS');
    } else if (item === 'PSB Remarks') {
      // do that
      setDropdownAction('PSB');
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
                        onClick={() => handleSelectAction(item)}
                        target="_blank"
                        // href={`/employees/${employee.id}`}
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
