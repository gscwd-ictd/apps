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
    <Sidebar
      className="relative w-full transition-all"
      background="bg-gray-800"
    >
      <Sidebar.Header>
        <div className="flex items-center justify-center w-full gap-0 py-4 text-white">
          <section className="">
            <div className="text-sky-300/40">
              <i className="text-5xl bx bxs-network-chart"></i>
            </div>
          </section>

          <section
            className={`${
              isCollapsed ? 'hidden' : ''
            } flex flex-col text-center items-center select-none`}
          >
            <span className="text-5xl font-medium text-sky-300">HRMS</span>
            <span className="text-xs font-light text-sky-300">
              Employee Monitoring
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
                <i className="text-xl bx bx-fingerprint"></i>
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
                <i className="text-xl bx bx-run"></i>
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
                <i className="text-xl bx bx-timer"></i>
              </>
            }
            path={Paths[5]}
          />

          {/**PASS SLIP */}
          <Sidebar.Item
            display="Pass Slips"
            className="text-xs"
            selected={pathname === Paths[6] ? true : false}
            icon={
              <>
                <i className="text-xl bx bxs-file-export"></i>
              </>
            }
            path={Paths[6]}
          />

          {/** Monitoring Trainings */}
          {/**! REMOVED TRAINING */}
          {/* <Sidebar.Item
            display="Trainings & Seminars"
            path={Paths[4]}
            selected={pathname === Paths[4] ? true : false}
            className="text-xs"
            icon={
              <>
                <i className="text-xl bx bx-chalkboard"></i>
              </>
            }
          /> */}

          {/** Monitoring Travel Order */}
          <Sidebar.Item
            display="Travel Orders"
            selected={pathname === Paths[3] ? true : false}
            path={Paths[3]}
            className="text-xs"
            icon={
              <>
                <i className="text-xl bx bxs-truck"></i>
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
            icon={<i className="text-xl bx bx-calendar-edit"></i>}
            path=""
            hasSubItem
            selected={
              pathname === Paths[15] ||
              pathname === Paths[16] ||
              pathname === Paths[17]
            }
            subItems={
              <>
                <Sidebar.Item
                  display="Office"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[15] ? true : false}
                  icon={
                    <>
                      <i className="text-xl bx bxs-buildings"></i>
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
                      <i className="text-xl bx bxs-hard-hat"></i>
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
                      <i className="text-xl bx bxs-factory"></i>
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
            icon={<i className="text-xl bx bx-run"></i>}
            selected={
              pathname === Paths[8] ||
              pathname === Paths[9] ||
              pathname === Paths[10]
            }
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
            selected={pathname === Paths[11] || pathname === Paths[12]}
            icon={
              <>
                <i className="text-xl bx bxs-calendar-event"></i>
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

                {/** REMOVED */}
                {/* <Sidebar.Item
                  display="Training & Seminar Types"
                  className={`${isCollapsed ? 'text-xs' : 'text-xs pl-5'}`}
                  selected={pathname === Paths[12] ? true : false}
                  icon={
                    <>
                      <MyLightBulbIcon />
                    </>
                  }
                  path={Paths[12]}
                /> */}
              </>
            }
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
