import Head from 'next/head';
import { FunctionComponent } from 'react';

type PageTitleProps = {
  title: string;
};

export const PageTitle: FunctionComponent<PageTitleProps> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};
