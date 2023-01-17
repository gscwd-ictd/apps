import { AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/tailwind.css';
import '../../styles/custom.css';
import { Aside, Main, PageContent } from '@gscwd-apps/oneui';
import { SideNavigation } from '../components/fixed/navigations/SideNavigation';
import { TopBar } from '../components/fixed/navigations/TopBar';
import { BottomBar } from '../components/fixed/navigations/BottomBar';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GSCWD Employee Monitoring</title>
      </Head>

      <PageContent
        header={<TopBar />}
        footer={<BottomBar />}
        sidebar={
          <Aside>
            <SideNavigation />
          </Aside>
        }
        main={
          <Main>
            <Component {...pageProps} />
          </Main>
        }
      />
    </>
  );
}

export default CustomApp;
