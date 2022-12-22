import '../../styles/tailwind.css';
import '../../styles/custom.css';

import { AppProps } from 'next/app';
import PageHeader from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <PageHeader>
        <title>Welcome!</title>
      </PageHeader>

      <Component {...pageProps} />
    </>
  );
}
