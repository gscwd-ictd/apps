import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/tailwind.css';
import '../styles/custom.css';
import { PageContent } from '@gscwd-apps/oneui';
import TopNavigation from '../components/page-header/TopNavigation';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to job-portal!</title>
      </Head>
      <main className="app">
        <PageContent>
          <TopNavigation />
          <Component {...pageProps} />
        </PageContent>
      </main>
    </>
  );
}

export default CustomApp;
