import { defineAbility } from '@casl/ability';
import { isEmpty } from 'lodash';
import Cookies from 'universal-cookie';

const isSuperAdmin = false;
const isUser = true;

export default defineAbility((can) => {
  const cookies = new Cookies();
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
    { I: 'access', this: 'maintenance_schedules' },
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
