import { PageContentContext, Sidebar } from '@gscwd-apps/oneui';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import {
  MyCalendarClockIcon,
  MyCalendarHeartIcon,
  MyCalendarPlusIcon,
  MyCalendarRangeIcon,
  MyCalendarX2,
} from '../icons/MyLucideIcons';
import { Paths } from '../../utils/constants/route';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import Link from 'next/link';

export const SideNavigation = () => {
  const {
    aside: { isCollapsed },
  } = useContext(PageContentContext);

  const { pathname } = useRouter();

  return (
    <Sidebar className="relative w-full transition-all" background="bg-[#2a3042]">
      <Sidebar.Header>
        <Link href={`${process.env.NEXT_PUBLIC_HRMS_DOMAIN_FE}/module-dashboard`}>
          <div className="flex items-center justify-center w-full gap-0 py-4 text-white">
            <section className="">
              <div className="text-cyan-800">
                <i className="text-4xl bx bxs-analyse"></i>
              </div>
            </section>

            <section className={`${isCollapsed ? 'hidden' : ''} flex flex-col text-center items-center select-none`}>
              <span className="font-sans text-4xl font-medium text-cyan-400">HRMS</span>
              <span className="text-xs font-medium text-cyan-400">Employee Monitoring</span>
            </section>
          </div>
        </Link>
      </Sidebar.Header>

      <Sidebar.Content>
        <ul>
          <Can I="access" this={'Employees'}>
            <Sidebar.Header className={`py-2 ${isCollapsed ? 'hidden' : 'block'}`}>
              <span className="pl-4 text-xs font-medium text-gray-500 uppercase">Menu</span>
            </Sidebar.Header>
          </Can>

          {/* DASHBOARD */}
          <Sidebar.Item
            display="Dashboard"
            className="text-sm"
            selected={pathname === Paths[0] ? true : false}
            icon={
              <>
                <i className="text-xl bx bx-home"></i>
              </>
            }
            path={Paths[0]}
          />

          {/**Employees */}
          <Can I="access" this="Employees">
            <Sidebar.Item
              display="Employees"
              className="text-sm"
              selected={pathname === Paths[1] ? true : false}
              icon={
                <>
                  <i className="text-xl bx bxs-user-account"></i>
                </>
              }
              path={Paths[1]}
            />
          </Can>

          {/**Reports */}
          <Can I="access" this="Reports">
            <Sidebar.Item
              display="Reports"
              className="text-sm"
              selected={pathname === Paths[29] ? true : false}
              icon={
                <>
                  <i className="text-xl bx bxs-report"></i>
                </>
              }
              path={Paths[29]}
            />
          </Can>

          {/**Monitoring Header */}
          <Can I="access" this={['Scheduling_sheets', 'Leave_applications', 'Overtime', 'Pass_slips', 'Travel_orders']}>
            <Sidebar.Header className={`py-2`}>
              <span className="pl-4 text-xs font-medium text-gray-500 uppercase">
                {isCollapsed ? <hr className="border border-slate-600" /> : 'Monitoring'}
              </span>
            </Sidebar.Header>
          </Can>

          {/**Monitoring Scheduling Sheet */}
          <Can I="access" this="Scheduling_sheets">
            <Sidebar.Item
              display="Scheduling Sheets"
              className="text-sm"
              icon={<i className="text-xl bx bxs-spreadsheet"></i>}
              path=""
              hasSubItem
              selected={pathname === Paths[19] || pathname === Paths[20]}
              subItems={
                <>
                  {/* OFFICE */}
                  <Can I="access" this="Scheduling_sheet_office">
                    <Sidebar.Item
                      display="Office"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[21] ? true : false}
                      icon={
                        <>
                          <i className="text-xl bx bxs-buildings"></i>
                        </>
                      }
                      path={Paths[21]}
                    />
                  </Can>

                  {/* FIELD */}
                  <Can I="access" this="Scheduling_sheet_field">
                    <Sidebar.Item
                      display="Field"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[19] ? true : false}
                      icon={
                        <>
                          <i className="text-xl bx bxs-hard-hat"></i>
                        </>
                      }
                      path={Paths[19]}
                    />
                  </Can>

                  {/* STATION */}
                  <Can I="access" this="Scheduling_sheet_station">
                    <Sidebar.Item
                      display="Station"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[20] ? true : false}
                      icon={
                        <>
                          <i className="text-xl bx bxs-factory"></i>
                        </>
                      }
                      path={Paths[20]}
                    />
                  </Can>
                </>
              }
            />
          </Can>

          {/**LEAVE APPLICATIONS */}
          <Can I="access" this="Leave">
            <Sidebar.Item
              display="Leave Applications"
              className="text-sm"
              icon={<i className="text-xl bx bx-run"></i>}
              path=""
              hasSubItem
              selected={pathname === Paths[2] || pathname === Paths[23]}
              subItems={
                <>
                  {/* APPLICATIONS */}
                  <Can I="access" this="Leave_applications">
                    <Sidebar.Item
                      display="Applications"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[2] ? true : false}
                      icon={<i className="text-xl bx bxs-file-plus"></i>}
                      path={Paths[2]}
                    />
                  </Can>

                  {/* CANCELLATIONS */}
                  <Can I="access" this="Leave_cancellations">
                    <Sidebar.Item
                      display="Cancellations"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[23] ? true : false}
                      icon={<i className="text-xl bx bxs-calendar-x"></i>}
                      path={Paths[23]}
                    />
                  </Can>
                </>
              }
            />
          </Can>

          {/**OVERTIME */}
          <Can I="access" this="Overtime">
            <Sidebar.Item
              display="Overtime"
              className="text-sm"
              icon={<i className="text-xl bx bx-timer"></i>}
              path=""
              hasSubItem
              selected={pathname === Paths[13] || pathname === Paths[14]}
              subItems={
                <>
                  {/* APPLICATIONS */}
                  <Can I="access" this="Overtime_applications">
                    <Sidebar.Item
                      display="Applications"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[13] ? true : false}
                      icon={
                        <>
                          <i className="text-xl bx bxs-file-plus"></i>
                        </>
                      }
                      path={Paths[13]}
                    />
                  </Can>

                  {/* IMMEDIATE SUPERVISORS */}
                  <Can I="access" this="Overtime_immediate_supervisors">
                    <Sidebar.Item
                      display="Immediate Supervisors"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[14] ? true : false}
                      icon={
                        <>
                          <i className="text-xl bx bxs-user-plus"></i>
                        </>
                      }
                      path={Paths[14]}
                    />
                  </Can>
                </>
              }
            />
          </Can>

          {/**PASS SLIPS */}
          <Can I="access" this="Pass_slips">
            <Sidebar.Item
              display="Pass Slips"
              className="text-sm"
              selected={pathname === Paths[6] ? true : false}
              icon={
                <>
                  <i className="text-xl bx bxs-file-export"></i>
                </>
              }
              path={Paths[6]}
            />
          </Can>

          {/** TRAVEL ORDER */}
          <Can I="access" this="Travel_orders">
            <Sidebar.Item
              display="Travel Orders"
              selected={pathname === Paths[3] ? true : false}
              path={Paths[3]}
              className="text-sm"
              icon={
                <>
                  <i className="text-xl bx bxs-truck"></i>
                </>
              }
            />
          </Can>

          {/**Maintenance Header */}
          <Can I="access" this={['Schedules', 'Leave_benefits', 'Events']}>
            <Sidebar.Header className={`py-2`}>
              <span className="pl-4 text-xs font-medium text-gray-500 uppercase">
                {isCollapsed ? <hr className="border border-slate-600" /> : 'Maintenance'}
              </span>
            </Sidebar.Header>
          </Can>

          {/**Maintenance Schedules */}
          <Can I="access" this="Schedules">
            <Sidebar.Item
              display="Schedules"
              className="text-sm"
              icon={<i className="text-xl bx bx-calendar-edit"></i>}
              path=""
              hasSubItem
              selected={pathname === Paths[16] || pathname === Paths[17] || pathname === Paths[18]}
              subItems={
                <>
                  {/* OFFICE */}
                  <Can I="access" this="Schedule_office">
                    <Sidebar.Item
                      display="Office"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[16] ? true : false}
                      icon={
                        <>
                          <i className="text-xl bx bxs-buildings"></i>
                        </>
                      }
                      path={Paths[16]}
                    />
                  </Can>

                  {/* FIELD */}
                  <Can I="access" this="Schedule_field">
                    <Sidebar.Item
                      display="Field"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[17] ? true : false}
                      icon={
                        <>
                          <i className="text-xl bx bxs-hard-hat"></i>
                        </>
                      }
                      path={Paths[17]}
                    />
                  </Can>

                  {/* STATION */}
                  <Can I="access" this="Schedule_station">
                    <Sidebar.Item
                      display="Station"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[18] ? true : false}
                      icon={
                        <>
                          <i className="text-xl bx bxs-factory"></i>
                        </>
                      }
                      path={Paths[18]}
                    />
                  </Can>
                </>
              }
            />
          </Can>

          {/**Maintenance LEAVE BENEFITS */}
          <Can I="access" this={'Leave_benefits'}>
            <Sidebar.Item
              display="Leave Benefits"
              className="text-sm"
              hasSubItem
              icon={<i className="text-xl bx bx-run"></i>}
              selected={pathname === Paths[8] || pathname === Paths[9] || pathname === Paths[10]}
              subItems={
                <>
                  {/* RECURRING */}
                  <Can I="access" this="Leave_benefit_recurring">
                    <Sidebar.Item
                      display="Recurring"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[8] ? true : false}
                      icon={
                        <>
                          <MyCalendarClockIcon />
                        </>
                      }
                      path={Paths[8]}
                    />
                  </Can>

                  {/* CUMULATIVE */}
                  <Can I="access" this="Leave_benefit_cumulative">
                    <Sidebar.Item
                      display="Cumulative"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[9] ? true : false}
                      icon={
                        <>
                          <MyCalendarPlusIcon />
                        </>
                      }
                      path={Paths[9]}
                    />
                  </Can>

                  {/* SPECIAL */}
                  <Can I="access" this="Leave_benefit_special">
                    <Sidebar.Item
                      display="Special"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[10] ? true : false}
                      icon={
                        <>
                          <MyCalendarHeartIcon />
                        </>
                      }
                      path={Paths[10]}
                    />
                  </Can>
                </>
              }
              path=""
            />
          </Can>

          {/** Maintenance Events */}
          <Can I="access" this={'Events'}>
            <Sidebar.Item
              display="Events"
              path=""
              className="text-sm"
              hasSubItem
              selected={pathname === Paths[11] || pathname === Paths[12]}
              icon={
                <>
                  <i className="text-xl bx bxs-calendar-event"></i>
                </>
              }
              subItems={
                <>
                  {/* HOLIDAYS */}
                  <Can I="access" this="Event_holidays">
                    <Sidebar.Item
                      display="Holidays"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[11] ? true : false}
                      icon={
                        <>
                          <MyCalendarRangeIcon />
                        </>
                      }
                      path={Paths[11]}
                    />
                  </Can>

                  {/* WORK SUSPENSIONS */}
                  <Can I="access" this="Event_work_suspensions">
                    <Sidebar.Item
                      display="Work Suspensions"
                      className={`${isCollapsed ? 'text-sm' : 'text-sm pl-5'}`}
                      selected={pathname === Paths[12] ? true : false}
                      icon={
                        <>
                          <MyCalendarX2 />
                        </>
                      }
                      path={Paths[12]}
                    />
                  </Can>
                </>
              }
            />
          </Can>

          {/**Settings Header */}
          <Can
            I="access"
            this={['Custom_groups', 'Modules', 'Users', 'Officer_of_the_day', 'System_logs', 'Announcements']}
          >
            <Sidebar.Header className={`py-2`}>
              <span className="pl-4 text-xs font-medium text-gray-500 uppercase">
                {isCollapsed ? <hr className="border border-slate-600" /> : 'Settings'}
              </span>
            </Sidebar.Header>
          </Can>

          {/**Settings CUSTOM GROUPS */}
          <Can I="access" this="Custom_groups">
            <Sidebar.Item
              display="Custom Groups"
              className="text-sm"
              selected={pathname === Paths[22] ? true : false}
              icon={
                <>
                  <i className="text-xl bx bx-group"></i>
                </>
              }
              path={Paths[22]}
            />
          </Can>

          {/**Settings MODULES */}
          <Can I="access" this="Modules">
            <Sidebar.Item
              display="Modules"
              className="text-sm"
              selected={pathname === Paths[24] ? true : false}
              icon={
                <>
                  <i className="text-xl bx bx-package"></i>
                </>
              }
              path={Paths[24]}
            />
          </Can>

          {/**Settings USERS */}
          <Can I="access" this="Users">
            <Sidebar.Item
              display="Users"
              className="text-sm"
              selected={pathname === Paths[25] ? true : false}
              icon={
                <>
                  <i className="text-xl bx bxs-user-account"></i>
                </>
              }
              path={Paths[25]}
            />
          </Can>

          {/**Settings OFFICER OF THE DAY */}
          <Can I="access" this="Officer_of_the_day">
            <Sidebar.Item
              display="Officer of the Day"
              className="text-sm"
              selected={pathname === Paths[26] ? true : false}
              icon={
                <>
                  <i className="text-xl bx bxs-user-badge"></i>
                </>
              }
              path={Paths[26]}
            />
          </Can>

          {/**Settings SYSTEM LOGS */}
          <Can I="access" this="System_logs">
            <Sidebar.Item
              display="System Logs"
              className="text-sm"
              selected={pathname === Paths[27] ? true : false}
              icon={
                <>
                  <i className="text-xl bx bx-detail"></i>
                </>
              }
              path={Paths[27]}
            />
          </Can>

          {/**Settings ANNOUNCEMENTS */}
          <Can I="access" this="Announcements">
            <Sidebar.Item
              display="Announcements"
              className="text-sm"
              selected={pathname === Paths[28] ? true : false}
              icon={
                <>
                  <i className="text-xl bx bxs-megaphone"></i>
                </>
              }
              path={Paths[28]}
            />
          </Can>
        </ul>
      </Sidebar.Content>
    </Sidebar>
  );
};
