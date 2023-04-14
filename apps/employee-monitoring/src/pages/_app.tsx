import { AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/tailwind.css';
import '../../styles/custom.css';
import { Aside, Main, PageContent } from '@gscwd-apps/oneui';
import { SideNavigation } from '../components/navigations/SideNavigation';
import { TopNavigation } from '../components/navigations/TopNavigation';
import { Footer } from '../components/navigations/Footer';

import ability from '../context/casl/Ability';
import { AbilityContext } from '../context/casl/Can';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AbilityContext.Provider value={ability}>
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
      </AbilityContext.Provider>
    </>
  );
}

export default CustomApp;
