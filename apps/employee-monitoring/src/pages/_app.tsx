import { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/tailwind.css';
import '../../styles/custom.css';
import { Aside, Main, PageContent } from '@gscwd-apps/oneui';
import { SideNavigation } from '../components/navigations/SideNavigation';
import { TopNavigation } from '../components/navigations/TopNavigation';
import { Footer } from '../components/navigations/Footer';
import Authmiddleware from '../components/pages/authmiddleware';

import { getCookieFromServer, UserProfile } from '../utils/helper/session';
import { createContext, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

type AppOwnProps = {
  userDetails: UserProfile;
};

type AuthmiddlewareState = {
  userProfile: UserProfile;
};

export const AuthmiddlewareContext = createContext({} as AuthmiddlewareState);

const mockData = {
  _id: '123',
  fullName: 'User Test',
  isSuperUser: true,
  photoUrl: '/user-photo.jpg',
  email: 'user@gscwd.com',
  userAccess: [
    { I: 'access', this: 'Settings' },
    { I: 'access', this: 'Dashboard' },
    { I: 'access', this: 'Employee_schedules' },
    { I: 'access', this: 'Employee_schedules_view' },
    { I: 'access', this: 'Daily_time_record' },
    { I: 'access', this: 'Daily_time_record_view' },
    { I: 'access', this: 'Leave_ledger' },
    { I: 'access', this: 'Scheduling_sheets' },
    { I: 'access', this: 'Scheduling_sheet_office' },
    { I: 'access', this: 'Scheduling_sheet_station' },
    { I: 'access', this: 'Scheduling_sheet_field' },
    { I: 'access', this: 'Overtime' },
    { I: 'access', this: 'Overtime_applications' },
    { I: 'access', this: 'Overtime_immediate_supervisors' },
    { I: 'access', this: 'Leave' },
    { I: 'access', this: 'Leave_applications' },
    { I: 'access', this: 'Leave_cancellations' },
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
    { I: 'access', this: 'Announcements' },
  ],
  userId: '123',
};

export default function CustomApp({ Component, pageProps, userDetails }: AppProps & AppOwnProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>(null);

  // useEffect(() => {
  //   if (!isEmpty(userDetails) && isEmpty(userProfile)) {
  //     setUserProfile(userDetails);
  //   }
  // }, [userDetails, userProfile]);

  useEffect(() => {
    setUserProfile(mockData);
  }, [mockData]);

  return (
    <>
      <AuthmiddlewareContext.Provider
        // value={{ userProfile: userDetails ?? userProfile }}
        value={{ userProfile: mockData }}
      >
        <Authmiddleware>
          <Head>
            <title>GSCWD Employee Monitoring</title>
          </Head>

          <PageContent>
            <Aside>
              <SideNavigation />
            </Aside>

            <TopNavigation />
            <Main>
              <Component {...pageProps} />
              <Footer />
            </Main>
          </PageContent>
        </Authmiddleware>
      </AuthmiddlewareContext.Provider>
    </>
  );
}

CustomApp.getInitialProps = async (context: AppContext) => {
  const userDetails = await getCookieFromServer(context.ctx?.req?.headers?.cookie);

  return { userDetails };
};
