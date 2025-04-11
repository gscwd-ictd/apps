import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next/types';
import { getUserLoginDetails, withCookieSession } from '../helper/session';

type AuthmiddlewareProps = {
  children: React.ReactNode | React.ReactNode[];
};

const Authmiddleware = ({ children }: AuthmiddlewareProps) => {
  // initialize
  return <>{children}</>;
};

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employee = getUserLoginDetails();

  try {
    console.log('employee', employee);
  } catch {
    console.log('catch');
    return {
      props: { employee, test: {} },
    };
  }
});

export default Authmiddleware;
