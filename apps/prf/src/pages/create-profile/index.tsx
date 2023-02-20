import { useEffect } from 'react';
import { AuthFooter } from '../../components/fixed/footer/AuthFooter';
import { ChooseAvatar } from '../../components/fixed/profile/ChooseAvatar';
import { NameInfo } from '../../components/fixed/profile/NameInfo';
import { HiArrowLeft } from 'react-icons/hi';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getEmployee, invalidateSession, withSession } from '../../utils/helpers/with-session';
import { verifyPendingUser } from '../../http-requests/user-requests';
import { getEmployeeProfile } from '../../http-requests/employee-requests';
import { EmployeeProfile } from '../../types/employee.type';
import { useProfileStore } from '../../store/create-profile.store';
import { PageTitle } from '../../components/modular/html/PageTitle';
import { OtherDetails } from '../../components/fixed/profile/OtherDetails';

export default function CreateProfile({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // access page state from store
  const currentPage = useProfileStore((state) => state.currentPage);

  // access set previous page from store
  const prevPage = useProfileStore((state) => state.setPrevPage);

  // access set pending user from store
  const setPendingUser = useProfileStore((state) => state.setPendingUser);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPendingUser(user), []);

  // handle behavior for back button
  const handleBack = () => (currentPage === 2 || currentPage === 3 ? prevPage() : null);

  return (
    <>
      <PageTitle title="Create Profile" />
      <div className="flex flex-col items-center justify-center overflow-y-auto pt-12">
        <main className="w-[40rem] px-10 py-5">
          <header>
            {currentPage > 1 && (
              <div className="mb-3">
                <button className="flex items-center gap-2 text-gray-600" onClick={handleBack}>
                  <HiArrowLeft /> Go back
                </button>
              </div>
            )}
            <h1 className="text-3xl font-semibold text-gray-600">Welcome! Let us create your profile.</h1>
            <p className="text-gray-500">Let others get to know you better!</p>
          </header>

          {currentPage === 1 && <ChooseAvatar />}
          {currentPage === 2 && <NameInfo />}
          {currentPage === 3 && <OtherDetails />}
        </main>
      </div>
      <AuthFooter />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
  const employee = getEmployee();

  // console.log(employee);

  return { props: {} };

  // try {
  //   // verify if pending user
  //   const user = await verifyPendingUser(employee.userId, context);

  //   // return pending user details
  //   return { props: { user: (({ iat, ...rest }) => rest)(user) } };
  // } catch (error) {
  //   try {
  //     // attempt to look for employee profile
  //     const profile: EmployeeProfile = await getEmployeeProfile(employee.userId, context);

  //     // redirect to employee dashboard
  //     return {
  //       redirect: {
  //         permanent: false,
  //         destination: `/${profile.firstName}.${profile.lastName}`,
  //       },
  //     };
  //   } catch (error) {
  //     // invalidate the session
  //     invalidateSession(context.res);

  //     // redirect to not found page
  //     return {
  //       redirect: {
  //         destination: '/signin',
  //         permanent: false,
  //       },
  //     };
  //   }
  // }
});
