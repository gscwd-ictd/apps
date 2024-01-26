import { defineAbility } from '@casl/ability';
import { isEmpty } from 'lodash';

const isSuperAdmin = false;

export default defineAbility((can) => {
  //   const userAccessArr = JSON.parse(localStorage.getItem('userAccess'));
  const userAccessArr = [
    { I: 'access', this: 'Settings' },
    { I: 'access', this: 'Dashboard' },
    { I: 'access', this: 'Employee_schedules' },
    { I: 'access', this: 'Daily_time_record' },
    { I: 'access', this: 'Leave_ledger' },
    { I: 'access', this: 'Scheduling_sheets' },
    { I: 'access', this: 'Scheduling_sheet_station' },
    { I: 'access', this: 'Scheduling_sheet_field' },
    { I: 'access', this: 'Overtime' },
    { I: 'access', this: 'Overtime_applications' },
    { I: 'access', this: 'Overtime_immediate_supervisors' },
    { I: 'access', this: 'Leave_applications' },
    { I: 'access', this: 'Schedules' },
    { I: 'access', this: 'Schedule_office' },
    { I: 'access', this: 'Schedule_field' },
    { I: 'access', this: 'Schedule_station' },
    { I: 'access', this: 'Pass_slips' },
    { I: 'access', this: 'Events' },
    { I: 'access', this: 'Event_holidays' },
    { I: 'access', this: 'Event_work_suspensions' },
    { I: 'access', this: 'Leave_benefits' },
    { I: 'access', this: 'Leave_benefit_recurring' },
    { I: 'access', this: 'Leave_benefit_cumulative' },
    { I: 'access', this: 'Leave_benefit_special' },
    { I: 'access', this: 'Travel_orders' },
    { I: 'access', this: 'Custom_groups' },
    { I: 'access', this: 'Employees' },
    { I: 'access', this: 'Modules' },
    { I: 'access', this: 'Users' },
    { I: 'access', this: 'Officer_of_the_day' },
    { I: 'access', this: 'System_logs' },
    { I: 'access', this: 'Reports' },
  ];

  // cookies.get('isSuperUser')
  if (isSuperAdmin) {
    can('access', 'all');
  } else {
    if (!isEmpty(userAccessArr)) {
      userAccessArr.map((permission) => {
        can(permission.I, permission.this);
      });
    }
  }
});
