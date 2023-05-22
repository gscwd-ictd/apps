import { useRouter } from 'next/router';
import {
  HiOutlineBell,
  HiOutlineChat,
  HiOutlineHome,
  HiOutlineNewspaper,
  HiOutlinePresentationChartLine,
} from 'react-icons/hi';
import { ProfileMenuDropdown } from './ProfileMenuDropdown';
import { SideNavLink } from './SideNavLink';

export type EmployeeLocalStorage = {
  employeeId: string;
  initials: string;
  name: string;
  email: string;
};

export const SideNav = (): JSX.Element => {
  const router = useRouter();

  return (
    <>
      <nav className="fixed z-20 flex justify-center w-24 h-full">
        <ul className="flex flex-col items-center gap-5 text-gray-600 mt-14">
          <li className="mb-5">
            <ProfileMenuDropdown right />
          </li>

          <SideNavLink
            icon={<HiOutlineHome className="w-6 h-6" />}
            destination={`/${router.query.id}`}
          />

          {/* <SideNavLink icon={<HiOutlinePresentationChartLine className="w-6 h-6" />} destination={`/${router.query.id}/prf`} /> */}

          {/* <SideNavLink icon={<HiOutlineChartPie className="w-6 h-6" />} destination="/prf" /> */}

          {/* <SideNavLink icon={<HiOutlineClipboardList className="w-6 h-6" />} destination="/prf" /> */}

          <SideNavLink
            icon={<HiOutlineBell className="w-6 h-6" />}
            destination={`/${router.query.id}/inbox`}
          />

          {/* <SideNavLink icon={<HiOutlineChat className="w-6 h-6" />} destination="/prf" /> */}

          <SideNavLink
            icon={<HiOutlineNewspaper className="w-6 h-6" />}
            destination={`/${router.query.id}/vacancies`}
          />
        </ul>
      </nav>
    </>
  );
};
