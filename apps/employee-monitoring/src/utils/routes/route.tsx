// import cookies
import Cookies from 'universal-cookie';

import React, { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from 'next/types';
import { getUserLoginDetails, withCookieSession } from '../helper/session';

type AuthmiddlewareProps = {
  children: React.ReactNode | React.ReactNode[];
};

// set cookies
const cookies = new Cookies();

const Authmiddleware = ({ children }: AuthmiddlewareProps) => {
  // initialize
  const router = useRouter();

  // if (
  //   typeof window !== 'undefined' &&
  //   (localStorage.getItem('userId') === null ||
  //     localStorage.getItem('userId') === 'undefined' ||
  //     typeof cookies.get('isSuperUser') === 'undefined')
  // ) {
  //   console.log('BAWAL KA');
  //   // localStorage.clear();
  //   // router.push(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN_FE}/login`);
  // } else
  return <>{children}</>;
};

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const employee = getUserLoginDetails();

    try {
      console.log('employee', employee);
    } catch {
      console.log('catch');
      return {
        props: { employee, test: {} },
      };
    }
  }
);

export default Authmiddleware;
