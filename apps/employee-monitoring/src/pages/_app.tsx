import { AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/tailwind.css';
import '../../styles/custom.css';
import { Aside, Main, PageContent } from '@gscwd-apps/oneui';
import { SideNavigation } from '../components/navigations/SideNavigation';
import { TopNavigation } from '../components/navigations/TopNavigation';
import { BreadCrumbs } from '../components/navigations/BreadCrumbs';
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

        <div className="flex flex-col w-full h-full">
          <TopNavigation />
          <Main>
            <div className="w-full h-[93%] overflow-y-auto">
              <Component {...pageProps} />
            </div>
            <Footer />
          </Main>
        </div>
      </PageContent>
    </>
  );
}

export default CustomApp;
