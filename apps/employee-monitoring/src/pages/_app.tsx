import { AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/tailwind.css';
import '../../styles/custom.css';
import {
  Aside,
  AsideContext,
  Button,
  Main,
  PageContent,
  Sidebar,
} from '@gscwd-apps/oneui';
import { useContext } from 'react';
import { SideNavigation } from '../components/fixed/navigations/SideNavigation';

function CustomApp({ Component, pageProps }: AppProps) {
  const { collapsed, setCollapsed } = useContext(AsideContext);

  return (
    <>
      <Head>
        <title>Welcome to employee-monitoring!</title>
      </Head>

      <PageContent>
        <Aside>
          <SideNavigation />
        </Aside>

        <Main className="app">
          <Component {...pageProps} />
        </Main>
      </PageContent>
    </>
  );
}

export default CustomApp;
