/* eslint-disable @nx/enforce-module-boundaries */
import { Menu, Transition } from '@headlessui/react';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { HiAcademicCap, HiClipboardCheck, HiOutlineCube } from 'react-icons/hi';

type MenuDropdownProps = {
  right?: boolean;
  className?: string;
  labelColor?: string;
};

export const GeneralManagerMenuDropdown = ({
  className,
  labelColor = 'text-white',
  right = false,
}: MenuDropdownProps): JSX.Element => {
  const { pendingApprovalsCount, errorPendingApprovalsCount } = useApprovalStore((state) => ({
    pendingApprovalsCount: state.pendingApprovalsCount,
    errorPendingApprovalsCount: state.error.errorPendingApprovalsCount,
  }));

  const router = useRouter();

  return (
    <>
      <Menu as="div" className={`z-40 -mt-10 -ml-6 fixed lg:relative lg:-mt-0 lg:ml-0 inline-block text-left`}>
        <div>
          <Menu.Button
            className={`${className} h-10 w-10 rounded flex justify-center items-center bg-white outline-none transition-colors ease-in-out hover:bg-slate-200 hover:text-slate-500 `}
          >
            <HiOutlineCube className="w-6 h-6 text-indigo-500 " />
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
          {/* translate-x-full */}
          <Menu.Items
            className={`${
              right ? 'right-[2.5rem] translate-x-full' : 'right-10'
            } shadow-gray absolute mt-2 w-auto origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div>
              <Menu.Item>
                {({ active }) => (
                  <div className={`${active ? 'bg-slate-50' : null} cursor-pointer rounded-md p-4`}>
                    <div>
                      <h5 className="truncate font-semibold ">General Manager Actions</h5>
                    </div>
                  </div>
                )}
              </Menu.Item>
            </div>
            <div>
              <>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-slate-100' : 'text-gray-900'
                      } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                      onClick={() => router.push(`/${router.query.id}/appointing-authority-selection`)}
                    >
                      <div className="flex gap-2">
                        <HiClipboardCheck className="w-6 h-6 text-green-600" />
                        <span className="text-sm tracking-tight text-gray-700 text-left">
                          Appointing Authority Selection
                        </span>
                      </div>
                      {isEmpty(errorPendingApprovalsCount) &&
                      pendingApprovalsCount.pendingAppointingAuthoritySelection > 0 ? (
                        <span className="absolute w-3 h-3 right-4 z-40 bg-red-600 rounded-full select-none" />
                      ) : null}
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-slate-100' : 'text-gray-900'
                      } group flex w-80 items-center gap-2 px-3 py-3 text-sm`}
                      onClick={() => router.push(`/${router.query.id}/pdc-gm-approvals`)}
                    >
                      <div className="flex gap-2">
                        <HiAcademicCap className="w-6 h-6 text-red-600" />
                        <span className="text-sm tracking-tight text-gray-700 text-left">Training Approvals</span>
                      </div>
                      {/* {isEmpty(errorPendingApprovalsCount) && pendingApprovalsCount.pendingGmApprovalCount != 0 ? (
                        <span className="absolute w-3 h-3 right-4 z-40 bg-red-600 rounded-full select-none" />
                      ) : null} */}
                    </button>
                  )}
                </Menu.Item>
              </>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
