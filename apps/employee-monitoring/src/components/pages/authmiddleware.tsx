// import cookies
import React, { useContext } from 'react';
import { AbilityContext } from '../../context/casl/Can';
import { defineAbility } from '@casl/ability';
import { isEmpty } from 'lodash';
import { AuthmiddlewareContext } from '../../pages/_app';
import { Navigate } from '../router/navigate';

type AuthmiddlewareProps = {
  children: React.ReactNode | React.ReactNode[];
};

export default function Index({ children }: AuthmiddlewareProps) {
  const { userProfile } = useContext(AuthmiddlewareContext);

  const ability = defineAbility((can) => {
    const userAccessArr = userProfile?.userAccess?.map((access) => {
      return access;
    });

    if (userProfile && userProfile.isSuperUser === true && isEmpty(userAccessArr)) {
      can('access', 'all');
    } else {
      if (!isEmpty(userAccessArr)) {
        userAccessArr.map((permission) => {
          can(permission.I, permission.this);
        });
      }
    }
  });

  return (
    <>
      <AbilityContext.Provider value={ability}>
        {!isEmpty(userProfile) ? (
          <>{children}</>
        ) : (
          <Navigate to={`${process.env.NEXT_PUBLIC_HRIS_DOMAIN_FE}/module-dashboard`} />
        )}
      </AbilityContext.Provider>
    </>
  );
}
