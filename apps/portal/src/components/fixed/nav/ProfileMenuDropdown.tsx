import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
// import { postData } from '../../../../utils/hoc/axios';
// import { deleteCookie } from 'cookies-next'
import {
  HiOutlineCheck,
  HiOutlineClipboardCheck,
  HiOutlineCog,
  HiOutlineDocumentDuplicate,
  HiOutlineLogout,
} from 'react-icons/hi';
import axios from 'axios';

type MenuDropdownProps = {
  right?: boolean;
  className?: string;
  labelColor?: string;
};

type EmployeeDetails = {
  fullName: string;
  initials: string;
  profile: string;
};

export const ProfileMenuDropdown = ({
  className,
  labelColor = 'text-white',
  right = false,
}: MenuDropdownProps): JSX.Element => {
  // set value for employee details
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails>(
    {} as EmployeeDetails
  );

  // intialize royter
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== undefined) {
      try {
        setEmployeeDetails(JSON.parse(localStorage.getItem('employee') || ''));
      } catch (error) {
        // router.reload();
        handleLogout();
      }
    }
  }, []);

  // method call to handle logout action
  const handleLogout = async () => {
    // perform http request to invalidate session from the server
    // const signout = await postData(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users/web/signout`, null);
    await axios.post(
      `${process.env.NEXT_PUBLIC_PORTAL_URL}/users/web/signout`,
      null,
      { withCredentials: true }
    );
    localStorage.clear();
    // deleteCookie

    // remove employee object from local storage
    localStorage.removeItem('employee');

    // reload the page to redirect back to login
    router.reload();
  };
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className={`${className} h-10 w-10 rounded bg-indigo-500 outline-none transition-colors ease-in-out hover:bg-indigo-600 `}
          >
            <p className={`text-sm font-bold ${labelColor}`}>
              {employeeDetails.initials}
            </p>
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
              right ? 'right-[2.5rem] translate-x-full' : 'right-0'
            } shadow-gray absolute mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            <div>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`${
                      active ? 'bg-slate-50' : null
                    } cursor-pointer rounded-md p-5`}
                  >
                    <div>
                      <h5 className="truncate font-semibold">
                        {employeeDetails.fullName}
                      </h5>
                      <p className="truncate text-xs text-gray-500">
                        {employeeDetails.profile}
                      </p>
                    </div>
                  </div>
                )}
              </Menu.Item>
            </div>
            <div>
              <Menu.Item>
                <button
                  className={`group flex w-full items-center gap-3 bg-emerald-50 px-3 py-3 text-sm`}
                >
                  <HiOutlineCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium tracking-tight text-emerald-600">
                    Terms & Conditions
                  </span>
                </button>
              </Menu.Item>

              {/* <Menu.Item>
                {({ active }) => (
                  <button className={`${active ? 'bg-slate-100' : 'text-gray-900'} group flex w-full items-center gap-3 px-3 py-3 text-sm`}>
                    <HiOutlineClipboardCheck className="h-5 w-5 text-gray-600" />
                    <span className="text-sm tracking-tight text-gray-700">Daily Tasks</span>
                  </button>
                )}
              </Menu.Item> */}

              {/* <Menu.Item>
                {({ active }) => (
                  <button className={`${active ? 'bg-slate-100' : 'text-gray-900'} group flex w-full items-center gap-3 px-3 py-3 text-sm`}>
                    <HiOutlineDocumentDuplicate className="h-5 w-5 text-gray-600" />
                    <span className="ftext-sm tracking-tight text-gray-700">Personal Data</span>
                  </button>
                )}
              </Menu.Item> */}

              {/* <Menu.Item>
                {({ active }) => (
                  <button className={`${active ? 'bg-slate-100' : 'text-gray-900'} group flex w-full items-center gap-3 px-3 py-3 text-sm`}>
                    <HiOutlineCog className="h-5 w-5 text-gray-600" />
                    <span className="text-sm tracking-tight text-gray-700">Account Settings</span>
                  </button>
                )}
              </Menu.Item> */}
            </div>
            <div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-slate-100' : 'text-gray-900'
                    } group flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm`}
                    onClick={handleLogout}
                  >
                    <HiOutlineLogout className="h-5 w-5 text-rose-600" />
                    <div className="flex w-full items-end justify-between">
                      <span className="text-sm tracking-tight text-rose-500">
                        Logout
                      </span>
                      <p className="font-mono text-xs tracking-tighter text-gray-400">
                        v1.0.0
                      </p>
                    </div>
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
