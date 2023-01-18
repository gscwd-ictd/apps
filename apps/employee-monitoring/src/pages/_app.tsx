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
      </Head>

      <PageContent>
        <Aside>
          <SideNavigation />
        </Aside>

        <div className="flex flex-col w-full">
          <TopNavigation />

          <Main>
            <Component {...pageProps} />
          </Main>

          <Footer />
        </div>
      </PageContent>
    </>
  );
}

export default CustomApp;
