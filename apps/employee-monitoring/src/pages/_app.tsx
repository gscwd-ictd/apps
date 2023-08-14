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
import { Navigate } from '../components/router/navigate';

type AppOwnProps = {
  userDetails: UserProfile;
};

type AuthmiddlewareState = {
  userProfile: UserProfile;
};

export const AuthmiddlewareContext = createContext({} as AuthmiddlewareState);

export default function CustomApp({
  Component,
  pageProps,
  userDetails,
}: AppProps & AppOwnProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>(null);

  useEffect(() => {
    if (!isEmpty(userDetails) && isEmpty(userProfile)) {
      setUserProfile(userDetails);
    }
  }, [userDetails, userProfile]);

  return (
    <>
      <AuthmiddlewareContext.Provider
        value={{ userProfile: userDetails ?? userProfile }}
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
  const userDetails = await getCookieFromServer(
    context.ctx?.req?.headers?.cookie
  );

  return { userDetails };
};
