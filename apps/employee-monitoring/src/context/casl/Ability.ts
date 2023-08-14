import { defineAbility } from '@casl/ability';
import { isEmpty } from 'lodash';

const isSuperAdmin = false;

export default defineAbility((can) => {
  //   const userAccessArr = JSON.parse(localStorage.getItem('userAccess'));
  const userAccessArr = [
    { I: 'access', this: 'Duties_responsibilities' },
    { I: 'access', this: 'Committees' },
    { I: 'access', this: 'Qualification_standards' },
    { I: 'access', this: 'Salary_grade' },
    { I: 'access', this: 'Employee_registration' },
    { I: 'access', this: 'Competency_models' },
    { I: 'access', this: 'Results_of_hiring' },
    { I: 'access', this: 'Prf_list' },
    { I: 'access', this: 'Occupations' },
    { I: 'access', this: 'Competency' },
    { I: 'access', this: 'Organization_structure' },
    { I: 'access', this: 'Settings' },
    { I: 'access', this: 'Personnel_selection' },
    { I: 'access', this: 'Dashboard' },
    { I: 'access', this: 'Employee_schedules' },
    { I: 'access', this: 'Daily_time_record' },
    { I: 'access', this: 'Leave_ledger' },
    { I: 'access', this: 'Scheduling_sheets' },
    { I: 'access', this: 'Scheduling_sheet_station' },
    { I: 'access', this: 'Scheduling_sheet_field' },
    { I: 'access', this: 'Overtime' },
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
    { I: 'access', this: 'Custom Groups' },
    { I: 'access', this: 'Employees' },
    { I: 'access', this: 'Modules' },
    { I: 'access', this: 'Users' },
    { I: 'access', this: 'Officer of the Day' },
    { I: 'access', this: 'System Logs' },
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
