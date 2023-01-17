import { AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/tailwind.css';
import '../../styles/custom.css';
import { Aside, Main, PageContent } from '@gscwd-apps/oneui';
import { SideNavigation } from '../components/fixed/navigations/SideNavigation';
import { TopNavigation } from '../components/fixed/navigations/TopNavigation';

function CustomApp({ Component, pageProps }: AppProps) {
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
