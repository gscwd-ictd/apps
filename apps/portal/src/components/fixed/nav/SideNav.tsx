/* eslint-disable @nx/enforce-module-boundaries */
import { useRouter } from 'next/router';
import {
  HiOutlineBell,
  HiOutlineHome,
  HiOutlineNewspaper,
} from 'react-icons/hi';
import { ProfileMenuDropdown } from './ProfileMenuDropdown';
import { SideNavLink } from './SideNavLink';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useEffect, useState } from 'react';

export type EmployeeLocalStorage = {
  employeeId: string;
  initials: string;
  name: string;
  email: string;
};

type EmployeeDetails = {
  navDetails: {
    fullName: string;
    initials: string;
    profile: string;
  };
};

export default function SideNav(navDetails: EmployeeDetails) {
  const router = useRouter();
  const { windowWidth } = UseWindowDimensions(); //get screen width and height

  return (
    <>
      <nav className="fixed z-30 flex justify-start lg:justify-center w-screen lg:w-24 h-auto">
        <ul className="z-30 flex flex-col items-center gap-5 text-gray-600 mt-14">
          <li className="mb-3 lg:mb-5 ml-10 lg:ml-0">
            <ProfileMenuDropdown
              right
              employeeDetails={navDetails.navDetails}
            />
          </li>

          {windowWidth > 1024 ? (
            <>
              <SideNavLink
                icon={<HiOutlineHome className="w-6 h-6" />}
                destination={`/${router.query.id}`}
              />

              <SideNavLink
                icon={<HiOutlineBell className="w-6 h-6" />}
                destination={`/${router.query.id}/inbox`}
              />

              <SideNavLink
                icon={<HiOutlineNewspaper className="w-6 h-6" />}
                destination={`/${router.query.id}/vacancies`}
              />
            </>
          ) : null}
        </ul>
        <div className="z-20 block lg:hidden fixed bg-white w-screen h-20 opacity-95"></div>
      </nav>
    </>
  );
}
