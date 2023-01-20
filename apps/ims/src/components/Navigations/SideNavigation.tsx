import { FunctionComponent, useContext } from 'react';
import { PageContentContext, Sidebar } from '@gscwd-apps/oneui';
import { useRouter } from 'next/router';
import {
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineDocument,
  HiOutlineCommandLine,
  HiOutlineCube,
} from 'react-icons/hi2';

// set paths for this app
const paths = ['/login', '/about', '/contacts', '/table', '/'];

export const SideNavigation: FunctionComponent = () => {
  // access context from aside to control its collapse state
  const {
    aside: { isCollapsed, setIsCollapsed },
  } = useContext(PageContentContext);

  // initialize router
  const router = useRouter();

  return (
    <Sidebar className="text-white">
      <Sidebar.Header className="p-5">
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <HiOutlineChevronRight
            className={`${
              isCollapsed ? 'rotate-180' : 'rotate-0'
            } transition-all`}
          />
        </button>
      </Sidebar.Header>

      <Sidebar.Content>
        <ul className="space-y-1 text-sm">
          <Sidebar.Item
            selected={router.pathname === paths[0] ? true : false}
            display="Dashboard"
            path={paths[0]}
            icon={<HiOutlineHome />}
          />

          <Sidebar.Item
            selected={router.pathname === paths[1] ? true : false}
            display="Schedule"
            path={paths[1]}
            icon={<HiOutlineCalendar />}
          />

          <Sidebar.Item
            selected={router.pathname === paths[2] ? true : false}
            display="Documents"
            path={paths[2]}
            icon={<HiOutlineDocument />}
          />

          <Sidebar.Item
            selected={router.pathname === paths[3] ? true : false}
            display="Terminal"
            path={paths[3]}
            icon={<HiOutlineCommandLine />}
          />

          <Sidebar.Item
            selected={router.pathname === paths[4] ? true : false}
            display="Packages"
            path={paths[4]}
            icon={<HiOutlineCube />}
          />
        </ul>
      </Sidebar.Content>
      {/* <Sidebar.Footer className="p-5">footer</Sidebar.Footer> */}
    </Sidebar>
  );
};
