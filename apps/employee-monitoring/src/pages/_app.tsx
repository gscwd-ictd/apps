import { AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/tailwind.css';
import '../../styles/custom.css';
import {
  Aside,
  Button,
  Main,
  AsideContext,
  PageContent,
  Sidebar,
} from '@gscwd-apps/oneui';
import { useContext } from 'react';
import { SideNavigation } from '../components/fixed/navigations/SideNavigation';
import { TopNavigation } from '../components/fixed/navigations/TopNavigation';

function CustomApp({ Component, pageProps }: AppProps) {
  const { isCollapsed, setIsCollapsed } = useContext(AsideContext);

  return (
    <>
      <Head>
        <title>GSCWD Employee Monitoring</title>
      </Head>

      <PageContent>
        <Aside>
          <SideNavigation />
        </Aside>

        <Main className="app">
          <TopNavigation />
          <Component {...pageProps} />
        </Main>
      </PageContent>
    </>
  );
}

export default CustomApp;
