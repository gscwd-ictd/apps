import { PageContentContext, Sidebar } from '@gscwd-apps/oneui';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import {
  MyCalendarClockIcon,
  MyCalendarHeartIcon,
  MyCalendarPlusIcon,
  MyCalendarRangeIcon,
  MyLightBulbIcon,
} from '../icons/MyLucideIcons';
import { Paths } from '../../utils/constants/route';

export const SideNavigation = () => {
  const {
    aside: { isCollapsed },
  } = useContext(PageContentContext);

  const { pathname } = useRouter();

  return (
    <Sidebar className="relative w-full">
      <Sidebar.Header>
        <div className="z-50 flex items-center justify-center w-full gap-2 py-5 text-white">
          <section className="">
            <div className="text-sky-200/90">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="skyblue"
                className="w-full h-full"
              >
                <path
                  fillRule="evenodd"
                  d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.823 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75zM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373zm7.49-8.931a.75.75 0 01-.175 1.046 19.326 19.326 0 00-3.398 3.098.75.75 0 01-1.097.04L8.5 8.561l-2.22 2.22A.75.75 0 115.22 9.72l2.75-2.75a.75.75 0 011.06 0l1.664 1.663a20.786 20.786 0 013.122-2.74.75.75 0 011.046.176z"
                  clipRule="evenodd"
                />
              </svg> */}
              <i className="text-4xl bx bxs-network-chart"></i>
            </div>
          </section>

          <section className={isCollapsed ? 'hidden' : ''}>
            <span className="text-5xl font-medium text-sky-300">HRMS</span>
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
                <i className="text-2xl bx bx-home"></i>
              </>
            }
            path={Paths[0]}
          />

          {/**Monitoring Header */}
          <Sidebar.Header className={`py-2`}>
            <span className="pl-4 text-xs font-medium text-gray-500 uppercase">
              {isCollapsed ? (
                <hr className="border border-slate-600" />
              ) : (
                'Monitoring'
              )}
            </span>
          </Sidebar.Header>

          {/**DTR */}
          <Sidebar.Item
            display=" Daily Time Record"
            className="text-xs"
            selected={pathname === Paths[1] ? true : false}
            icon={
              <>
                <i className="text-2xl bx bx-fingerprint"></i>
              </>
            }
            path={Paths[1]}
          />

          {/**LEAVE BENEFITS */}
          <Sidebar.Item
            display="Leave Applications"
            className="text-xs"
            selected={pathname === Paths[2] ? true : false}
            icon={
              <>
                <i className="text-2xl bx bx-run"></i>
              </>
            }
            path={Paths[2]}
          />

          {/**OVERTIME */}
          <Sidebar.Item
            display="Overtime"
            className="text-xs"
            selected={pathname === Paths[5] ? true : false}
            icon={
              <>
                <i className="text-2xl bx bx-timer"></i>
              </>
            }
            path={Paths[5]}
          />

          {/**PASS SLIP */}
          <Sidebar.Item
            display="Pass Slip"
            className="text-xs"
            selected={pathname === Paths[6] ? true : false}
            icon={
              <>
                <i className="text-2xl bx bxs-file-export"></i>
              </>
            }
            path={Paths[6]}
          />

          {/** Monitoring Trainings */}
          <Sidebar.Item
            display="Trainings & Seminars"
            path={Paths[4]}
            selected={pathname === Paths[4] ? true : false}
            className="text-xs"
            icon={
              <>
                <i className="text-2xl bx bx-chalkboard"></i>
              </>
            }
          />

          {/** Monitoring Travel Order */}
          <Sidebar.Item
            display="Travel Orders"
            selected={pathname === Paths[3] ? true : false}
            path={Paths[3]}
            className="text-xs"
            icon={
              <>
                <i className="text-2xl bx bxs-truck"></i>
              </>
            }
          />

          {/**Maintenance Header */}
          <Sidebar.Header className={`py-2`}>
            <span className="pl-4 text-xs font-medium text-gray-500 uppercase">
              {isCollapsed ? (
                <hr className="border border-slate-600" />
              ) : (
                'Maintenance'
              )}
            </span>
          </Sidebar.Header>

          {/**Maintenance Schedules */}
          <Sidebar.Item
            display="Schedules"
            className="text-xs"
            icon={<i className="text-2xl bx bx-calendar-edit"></i>}
            path=""
            hasSubItem
            subItems={
              <>
                <Sidebar.Item
                  display="Office"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[15] ? true : false}
                  icon={
                    <>
                      <i className="text-2xl bx bxs-buildings"></i>
                    </>
                  }
                  path={Paths[15]}
                />
                <Sidebar.Item
                  display="Field"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[16] ? true : false}
                  icon={
                    <>
                      <i className="text-2xl bx bxs-hard-hat"></i>
                    </>
                  }
                  path={Paths[16]}
                />
                <Sidebar.Item
                  display="Station"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[17] ? true : false}
                  icon={
                    <>
                      <i className="text-2xl bx bxs-factory"></i>
                    </>
                  }
                  path={Paths[17]}
                />
              </>
            }
          />

          {/**Maintenance LEAVE CREDITS */}

          <Sidebar.Item
            display="Leave Benefits"
            className="text-xs"
            hasSubItem
            icon={<i className="text-2xl bx bx-run"></i>}
            subItems={
              <>
                <Sidebar.Item
                  display="Recurring"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[8] ? true : false}
                  icon={
                    <>
                      <MyCalendarClockIcon />
                    </>
                  }
                  path={Paths[8]}
                />
                <Sidebar.Item
                  display="Cumulative"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[9] ? true : false}
                  icon={
                    <>
                      <MyCalendarPlusIcon />
                    </>
                  }
                  path={Paths[9]}
                />
                <Sidebar.Item
                  display="Special"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[10] ? true : false}
                  icon={
                    <>
                      <MyCalendarHeartIcon />
                    </>
                  }
                  path={Paths[10]}
                />
              </>
            }
            path=""
          />

          {/** Maintenance Events */}
          <Sidebar.Item
            display="Events"
            path=""
            className="text-xs"
            hasSubItem
            icon={
              <>
                <i className="text-2xl bx bxs-calendar-event"></i>
              </>
            }
            subItems={
              <>
                <Sidebar.Item
                  display="Holidays"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[11] ? true : false}
                  icon={
                    <>
                      <MyCalendarRangeIcon />
                    </>
                  }
                  path={Paths[11]}
                />
                <Sidebar.Item
                  display="Training & Seminars"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[12] ? true : false}
                  icon={
                    <>
                      <MyLightBulbIcon />
                    </>
                  }
                  path={Paths[12]}
                />
              </>
            }
          />

          {/** Maintenance OVERTIME */}
          <Sidebar.Item
            display="Overtime"
            className="text-xs"
            icon={
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              </>
            }
            path={Paths[13]}
          />

          {/** Maintenance PASS SLIP */}
          <Sidebar.Item
            display="Pass Slip"
            className="text-xs"
            icon={
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              </>
            }
            path={Paths[14]}
          />

          {/**Settings Header */}
          <Sidebar.Header className={`py-2`}>
            <span className="pl-4 text-xs font-medium text-gray-500 uppercase">
              {isCollapsed ? (
                <hr className="border border-slate-600" />
              ) : (
                'Settings'
              )}
            </span>
          </Sidebar.Header>
        </ul>
      </Sidebar.Content>
      {/* <Sidebar.Footer>Footer</Sidebar.Footer> */}
    </Sidebar>
  );
};
