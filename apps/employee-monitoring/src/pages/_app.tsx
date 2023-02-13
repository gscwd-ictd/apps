import { AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/tailwind.css';
import '../../styles/custom.css';
import { Aside, Main, PageContent } from '@gscwd-apps/oneui';
import { SideNavigation } from '../components/navigations/SideNavigation';
import { TopNavigation } from '../components/navigations/TopNavigation';

import { Footer } from '../components/navigations/Footer';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GSCWD Employee Monitoring</title>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </Head>

      <PageContent>
        <Aside>
          <SideNavigation />
        </Aside>

        <div className="flex flex-col w-full h-full">
          <TopNavigation />
          <Main>
            <div className="w-full h-full overflow-y-auto">
              <Component {...pageProps} />
              <Footer />
            </div>
          </Main>
        </div>
      </PageContent>
    </>
  );
}

export default CustomApp;
