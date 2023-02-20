import { useRouter } from 'next/router';
import { JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormStateReturn,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Notice } from '../../components/modular/alerts/Notice';
import { Checkbox } from '../../components/modular/forms/Checkbox';
// import { TextField } from '../../components/modular/forms/TextField';
import { AuthFooter } from '../../components/fixed/footer/AuthFooter';
import Link from 'next/link';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { invalidateSession } from '../../utils/helpers/with-session';
import { userSignin } from '../../http-requests/user-requests';
import { getEmployeeProfile, getEmployeeDetailsFromHr } from '../../http-requests/employee-requests';
import { EmployeeDetails, EmployeeProfile } from '../../types/employee.type';
import { PageTitle } from '../../components/modular/html/PageTitle';
import { Button } from '../../components/modular/forms/buttons/Button';
import { TextField } from '../../components/modular/inputs/TextField';
//import { TextField } from '@ericsison-dev/my-ui';

type LoginFormInput = {
  email: string;
  password: string;
};

const validationSchema = yup.object().shape({
  // specify validation rules for email
  email: yup.string().email('this field must be a valid email').required(),

  // specify validation rules for password
  password: yup.string().min(8).max(20).required(),
});

export default function Signin() {
  // set state for remember me checkbox
  const [rememberMe, setRememberMe] = useState(true);

  // set state for controlling the displaying of error status
  const [isError, setIsError] = useState({ status: false, message: '', animate: false });

  // set state for handling backend request loading status
  const [isLoading, setIsLoading] = useState(false);

  // initialize router
  const router = useRouter();

  // initialize react hook form
  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    control,
    formState: { errors },
  } = useForm<LoginFormInput>({ resolver: yupResolver(validationSchema) });

  /**
   *  this effect is to make sure that the app assumes that the page is loaded
   *  for the first time
   */
  useEffect(() => {
    // reset page url in case a user tampers with the url params
    router.replace('/signin', undefined, { shallow: true });

    // set focus on email textfield
    setFocus('email');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   *  this effect is intended for handling the timeout error passed by the dashboard page
   *  this will only run if employee microservice cannot be accessed
   */
  useEffect(() => {
    // get the values from the login form
    const { email, password } = getValues();

    // check if error query param is equal to timeout and email/password is not empty
    if (router.query.error === 'timeout' && (email || password)) {
      // display timeout error
      setIsError({ status: true, message: 'Your connection with the server has timed out.', animate: true });

      // set loading spinner to false
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.error]); // check for changes in the error query param from the url

  /**
   *  handle error events
   *
   * @param message a message that describes what the error is all about
   */
  const handleLoginError = (message: string) => {
    // set loading state to false
    setIsLoading(false);

    // set the error state
    setIsError({ status: true, message, animate: true });
  };

  const handleSignIn: SubmitHandler<LoginFormInput> = async ({ email, password }: LoginFormInput) => {
    // set the loading state to true
    setIsLoading(true);

    // call the login end point to post user credentials object
    const { error } = await userSignin(email, password, (res) => handleLoginError(res));

    // @arn021853
    // @agnes110777

    // reload the page is there is no error
    if (!error) router.reload();
  };

  return (
    <>
      <PageTitle title="Sign in" />
      <div className="flex flex-col items-center justify-center overflow-y-auto pt-16">
        <main className="w-[28rem] p-10">
          <header className="mb-8">
            <h1 className="text-2xl font-medium text-gray-700">Sign in</h1>
            <p className="text-sm text-gray-500">Welcome back! Please enter your credentials below.</p>
          </header>

          {isError.status && (
            <section className="mb-5" onAnimationEnd={() => setIsError({ ...isError, animate: false })}>
              <Notice type="error" message={isError.message} animate={isError.animate} />
            </section>
          )}

          <form className="flex flex-col" onSubmit={handleSubmit(handleSignIn)}>
            <section className={`${errors.email ? 'space-y-5' : 'space-y-3'}`}>
              <div>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { name, onChange, ref } }) => (
                    <TextField
                      ref={ref}
                      onChange={onChange}
                      name={name}
                      type={'text'}
                      placeholder="Email Address"
                      className="w-full"
                      variant={errors.email && errors.email.message ? 'error' : 'primary'}
                      helper={errors.email?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { name, onChange, ref } }) => (
                    <TextField
                      ref={ref}
                      onChange={onChange}
                      name={name}
                      type={'password'}
                      placeholder="Password"
                      className="w-full"
                      variant={errors.password && errors.password.message ? 'error' : 'primary'}
                      helper={errors.password?.message}
                    />
                  )}
                />
              </div>

              {/* <TextField
                controller={{ ...register('email', { required: true }) }}
                type="text"
                placeholder="Email Address"
                isError={errors.email && errors.email.message ? true : false}
                errorMessage={errors.email?.message}
              />

              <TextField
                controller={{ ...register('password', { required: true }) }}
                type="password"
                placeholder="Password"
                isError={errors.password && errors.password.message ? true : false}
                errorMessage={errors.password?.message}
              /> */}
            </section>

            <section className={`${errors.password ? 'mt-5' : 'mt-3'} flex items-end justify-between`}>
              <Checkbox label="Remember me" checkboxId={'remember-me'} />
              <Link href="/forgot-password">
                <p className="text-indigo-700 text-sm cursor-pointer">Forgot password?</p>
              </Link>
            </section>

            <div className="mt-10">
              <Button
                type="submit"
                isLoading={isLoading}
                btnLabel={isLoading ? 'Processing' : 'Sign in'}
                shadow={isLoading ? false : true}
                strong
                fluid
              />
            </div>
          </form>
        </main>
      </div>
      <AuthFooter />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const cookies = context.req.headers.cookie?.split(';');

  const session = cookies?.find((cookie) => (cookie.includes('ssid') ? cookie : null));

  // check if there is a session cookie
  if (session) {
    try {
      // get employee details from hr
      const details: EmployeeDetails = await getEmployeeDetailsFromHr(context);
      // get employee profile
      const profile: EmployeeProfile = await getEmployeeProfile(details.userId, context);
      // if employee profile exists in the database, redirect to dashboard
      return {
        redirect: {
          destination: `/${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}`,
          permanent: false,
        },
      };
    } catch (error: any) {
      // if employee profile is not found in the database
      if (error.response.data.message === 'Cannot find employee profile') {
        return {
          redirect: {
            destination: '/create-profile',
            permanent: false,
          },
        };
      } else {
        // invalidate session if it generated ssid
        invalidateSession(context.res);
        // redirect to not found page
        return {
          redirect: {
            destination: '/signin',
            permanent: false,
          },
        };
      }
    }
  }

  return { props: {} };
};
