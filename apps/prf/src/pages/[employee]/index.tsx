import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '../../components/modular/forms/buttons/Button';
import { PageTitle } from '../../components/modular/html/PageTitle';
import { getEmployeeProfile } from '../../http-requests/employee-requests';
import { getEmployee, withSession } from '../../utils/helpers/with-session';
import axios from 'axios';
import { useEmployeeStore } from '../../store/employee.store';

export default function User({ profile, employee }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const setEmployee = useEmployeeStore((state) => state.setEmployee);

  const setProfile = useEmployeeStore((state) => state.setProfile);

  const router = useRouter();

  useEffect(() => {
    setEmployee(employee);
    setProfile(profile);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    router.replace(`/${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}`, undefined, {
      shallow: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageTitle title={`${profile.firstName} ${profile.lastName}`} />
      Welcome!
      <Button
        btnLabel="Sign out"
        onClick={() => {
          axios.post(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users/web/signout`, null, { withCredentials: true });
          router.reload();
        }}
      />
      <div>
        <Button btnLabel="Go to PRF" onClick={() => router.push('/prf')} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
  const employee = getEmployee() as any;

  if (employee.profile) {
    try {
      // check if logged in employee has profile
      //const profile = await getEmployeeProfile(employee.userId, context);

      // return employee
      return { props: { profile: employee.profile, employee: employee.employmentDetails } };
    } catch (error) {
      console.log(error);
      // if logged in employee has no profile, redirect to /create-profile
      return {
        redirect: {
          destination: '/create-profile',
          permanent: false,
        },
      };
    }
  }

  return {
    redirect: {
      destination: '/signin',
      permanent: false,
    },
  };
});
