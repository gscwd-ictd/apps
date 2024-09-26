/* eslint-disable @nx/enforce-module-boundaries */
import { Publication } from 'apps/job-portal/utils/types/data/publication-type';
import { useJobOpeningsStore } from '../../../store/job-openings.store';
import { usePublicationStore } from '../../../store/publication.store';
import * as Popover from '@radix-ui/react-popover';
import { HiDotsVertical } from 'react-icons/hi';

type ActionDropDownProps = {
  publication: Publication;
};

const menuItems = ['Position Details', 'Apply'];

export const VerticalActionDropDown = ({ publication }: ActionDropDownProps) => {
  const modal = useJobOpeningsStore((state) => state.modal);

  const setModal = useJobOpeningsStore((state) => state.setModal);

  const setActionSelection = useJobOpeningsStore((state) => state.setActionSelection);

  const setPublication = usePublicationStore((state) => state.setPublication);

  const handleSelectAction = (item: string) => {
    setActionSelection(item);

    if (item === 'Apply') setModal({ ...modal, isOpen: true });
    setPublication(publication);
  };

  return (
    <>
      <Popover.Root>
        <Popover.Trigger className="h-full  select-none whitespace-nowrap rounded hover:cursor-pointer active:cursor-pointer active:outline-none  transition-colors text-black hover:text-gray-700 ease-in-out ">
          <HiDotsVertical className="w-4 h-full" />
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
              <div key={idx} className="z-50 flex w-full bg-white outline-none ring-0">
                <button
                  onClick={() => handleSelectAction(item)}
                  className="flex text-sm items-center w-full py-2 px-4  text-gray-500 rounded active:bg-slate-50 active:text-gray-900 group"
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
