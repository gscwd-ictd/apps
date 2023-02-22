import '../../styles/tailwind.css';
import '../../styles/custom.css';
import '../../styles/carousel.css';

import { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to portal!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}
