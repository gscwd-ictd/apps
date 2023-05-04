import { Aside, Main, PageContent } from '@gscwd-apps/oneui';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Footer } from '../components/navigations/Footer';
import { SideNavigation } from '../components/navigations/SideNavigation';
import { TopNavigation } from '../components/navigations/TopNavigation';
import { AbilityContext } from '../context/casl/Can';
import ability from '../context/casl/Ability';
import '../styles/tailwind.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AbilityContext.Provider value={ability}>
        <Head>
          <title>GSCWD Learning & Development</title>
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
