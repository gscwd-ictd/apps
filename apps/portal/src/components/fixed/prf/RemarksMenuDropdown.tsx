import { Menu, Transition } from '@headlessui/react';
import { Fragment, useContext } from 'react';
import { PrfContext } from '../../../context/contexts';

type RemarksMenuProps = {
  index: number;
};

const menuItems = ['Fill in vacant position', 'Option 2', 'Option 3'];

export const RemarksMenuDropdown = ({ index }: RemarksMenuProps): JSX.Element => {
  // get current state of selected positions
  const { selectedPositions, setSelectedPositions } = useContext(PrfContext);

  const handleSelectDefaultRemarks = (index: number, defaultRemarks: string) => {
    // create a copy of selected positions
    const updatedSelectedPositions = [...selectedPositions];

    // set the state to the selected remarks
    updatedSelectedPositions[index].remarks = defaultRemarks;

    // update the selected positions state
    setSelectedPositions(updatedSelectedPositions);
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="mr-1 h-full whitespace-nowrap border-2 border-slate-100 bg-slate-100 py-2 px-5 text-gray-700 transition-colors ease-in-out hover:bg-slate-200 active:bg-slate-300">
            <p>Select default</p>
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
            className={`shadow-gray absolute z-[100] mb-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            {menuItems.map((item: string, idx: number) => {
              return (
                <div key={idx}>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleSelectDefaultRemarks(index, item)}
                        className={`${
                          active ? 'bg-slate-50 text-gray-900' : 'text-gray-500'
                        } group flex w-full items-center rounded-md py-3 pl-4 pr-2`}
                      >
                        {item}
                      </button>
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
