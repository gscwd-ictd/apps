// import cookies
import React, { useContext } from 'react';
import { AbilityContext } from './CaslContext';
import { AnyMongoAbility, defineAbility, PureAbility } from '@casl/ability';
import { isEmpty } from 'lodash';
import { AuthmiddlewareContext } from '../../pages/_app';
import { Navigate } from '../../components/router/navigate';

type CaslProviderProps = {
  children: React.ReactNode | React.ReactNode[];
};

type AppAbility = PureAbility<Actions> & AnyMongoAbility;
type Actions = 'access';

export default function Index({ children }: CaslProviderProps) {
  const { userProfile } = useContext(AuthmiddlewareContext);

  const ability = defineAbility<AppAbility>((can) => {
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
          <Navigate to={`${process.env.NEXT_PUBLIC_HRMS_DOMAIN_FE}/module-dashboard`} />
        )}
      </AbilityContext.Provider>
    </>
  );
}
