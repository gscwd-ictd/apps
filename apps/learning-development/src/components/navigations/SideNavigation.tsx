import { PageContentContext, Sidebar } from '@gscwd-apps/oneui';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { Paths } from '../../../utils/constants/route';

export const SideNavigation = () => {
  const {
    aside: { isCollapsed, setIsDarkMode },
  } = useContext(PageContentContext);

  const { pathname } = useRouter();

  useEffect(() => {
    setIsDarkMode(false);
  }, []);

  return (
    <Sidebar className="relative w-full" background="bg-slate-200">
      <Sidebar.Header>
        <div className="flex items-center justify-center w-full gap-2 py-4 text-white">
          <section className="">
            <div className="text-sky-600">
              {/* <i className="text-4xl bx bxs-book-open"></i> */}
              {/* <i className="text-5xl bx bxs-graduation"></i> */}
              <i className="text-5xl bx bxs-book-content"></i>
            </div>
          </section>

          <section
            className={`${
              isCollapsed ? 'hidden' : ''
            } flex flex-col text-center items-start select-none`}
          >
            <span className="text-5xl font-medium text-sky-600">HRMS</span>
            <span className="text-xs font-light text-sky-600">
              Learning & Development
            </span>
          </section>
        </div>
      </Sidebar.Header>

      <Sidebar.Content>
        <ul>
          <Sidebar.Header
            className={`py-2 ${isCollapsed ? 'hidden' : 'block'}`}
          >
            <span className="pl-4 text-xs font-medium text-gray-500 uppercase">
              Menu
            </span>
          </Sidebar.Header>
          <Sidebar.Item
            display="Dashboard"
            className="text-xs"
            selected={pathname === Paths[0] ? true : false}
            icon={
              <>
                <i className="text-xl bx bx-home"></i>
              </>
            }
            path={Paths[0]}
          />
        </ul>
      </Sidebar.Content>
      {/* <Sidebar.Footer>Footer</Sidebar.Footer> */}
    </Sidebar>
  );
};
