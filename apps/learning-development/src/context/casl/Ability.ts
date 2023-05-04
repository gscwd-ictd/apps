import { defineAbility } from '@casl/ability';
import { isEmpty } from 'lodash';

const isSuperAdmin = false;

export default defineAbility((can) => {
  //   const userAccessArr = JSON.parse(localStorage.getItem('userAccess'));
  const userAccessArr = [{ I: 'access', this: 'Dashboard' }];

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
