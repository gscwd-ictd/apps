/* eslint-disable @nx/enforce-module-boundaries */
import { Publication } from 'apps/job-portal/utils/types/data/publication-type';
import { useJobOpeningsStore } from '../../../store/job-openings.store';
import { usePublicationStore } from '../../../store/publication.store';
import * as Popover from '@radix-ui/react-popover';

type ActionDropDownProps = {
  publication: Publication;
};

const menuItems = ['Position Details', 'Apply'];

export const ActionDropDown = ({ publication }: ActionDropDownProps) => {
  const modal = useJobOpeningsStore((state) => state.modal);

  const setModal = useJobOpeningsStore((state) => state.setModal);

  const setActionSelection = useJobOpeningsStore(
    (state) => state.setActionSelection
  );

  const setPublication = usePublicationStore((state) => state.setPublication);

  const handleSelectAction = (item: string) => {
    setActionSelection(item);

    if (item === 'Apply') setModal({ ...modal, isOpen: true });
    setPublication(publication);
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
          {menuItems.map((item: string, idx: number) => {
            return (
              <div
                key={idx}
                className="z-50 flex w-full bg-white outline-none ring-0"
              >
                <button
                  onClick={() => handleSelectAction(item)}
                  className="flex items-center w-full py-3 pl-4 pr-2 text-gray-500 rounded-md active:bg-slate-50 active:text-gray-900 group"
                >
                  {item}
                </button>
              </div>
            );
          })}
        </Popover.Content>
        {/* menu items here */}
      </Popover.Root>
    </>
  );
};
