import '../../styles/globals.css';
import '../../styles/custom.css';
import ability from '../context/casl/Ability';

import type { AppProps } from 'next/app';
import { AbilityContext } from '../context/casl/Can';
import { PageContent } from '@gscwd-apps/oneui';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AbilityContext.Provider value={{ ability }}>
        <PageContent>
          <Component {...pageProps} />
        </PageContent>
      </AbilityContext.Provider>
    </>
  );
}

export default MyApp;
