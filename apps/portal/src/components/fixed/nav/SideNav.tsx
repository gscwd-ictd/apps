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

export type EmployeeLocalStorage = {
  employeeId: string;
  initials: string;
  name: string;
  email: string;
};

export const SideNav = (): JSX.Element => {
  const router = useRouter();
  const { windowWidth } = UseWindowDimensions(); //get screen width and height
  return (
    <>
      <nav className="fixed z-20 flex justify-center w-24 h-full">
        <ul className="flex flex-col items-center gap-5 text-gray-600 mt-14">
          <li className="mb-5">
            <ProfileMenuDropdown right />
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
      </nav>
    </>
  );
};
