import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/tailwind.css';
import '../styles/custom.css';
import TopNavigation from '../components/page-header/TopNavigation';
import { PageContent } from '../components/fixed/page/PageContent';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to job-portal!</title>
      </Head>
      <main className="flex flex-col min-h-screen">
        <PageContent>
          <TopNavigation />
          <Component {...pageProps} />
        </PageContent>
      </main>
    </>
  );
}

export default CustomApp;
