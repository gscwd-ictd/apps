import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDtrStore } from '../../store/dtr.store';

const actionItems = ['Schedule', 'View Daily Time Record'];

export const ActionDropdown = () => {
  const { dropdownAction, setDropdownAction } = useDtrStore((state) => ({
    dropdownAction: state.dropdownAction,
    setDropdownAction: state.setDropdownAction,
  }));

  const handleSelectAction = (item: string) => {
    setDropdownAction(item);

    if (item === 'Employees') {
      //  setPublication(publication);
      //   localStorage.setItem('publication', JSON.stringify(publication))
      //  setModal({ ...modal, isOpen: true });
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className="h-full whitespace-nowrap rounded-md border-2 border-slate-100 bg-slate-300 px-3 py-[0.2rem] text-gray-700 transition-colors ease-in-out hover:bg-slate-200 active:bg-slate-300"
            // className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
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
            className={`shadow-gray absolute right-0 z-50 mb-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            {actionItems.map((item: string, idx: number) => {
              return (
                <div key={idx}>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleSelectAction(item)}
                        className={`${
                          active ? 'bg-slate-50 text-white' : 'text-gray-500'
                        } hover:bg-slate-600 group flex w-full items-center rounded py-3 px-4`}
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
