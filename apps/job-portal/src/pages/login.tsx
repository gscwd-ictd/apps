import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import Head from 'next/head';
import LoadingIndicator from '../components/fixed/loader/LoadingIndicator';
import { RealTimeSyncSvg } from '../components/fixed/svg/RealtimeSync';
import { postData } from 'apps/job-portal/utils/hoc/axios';

interface Error {
  status: boolean;
  message: string | null;
  animate: boolean;
}

type LoginFormInput = {
  email: string;
  password: string;
  rememberCredentials?: boolean;
  invalidCredentials?: boolean;
};

// yup validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email Address is not provided')
    .label('Email Address'),
  password: yup.string().required('Password is not provided').label('Password'),
});

export default function Login(): JSX.Element {
  // initialize an Error state
  const [error, setError] = useState<Error>({
    status: false,
    message: null,
    animate: false,
  });

  // initialize router
  const router = useRouter();

  // set loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // initialize the react hook form
  const {
    register,
    handleSubmit,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: yupResolver(schema),
  });

  /**
   * this effect is to make sure that the app assumes that the page is loaded
   * for the first time
   */
  useEffect(() => {
    // reset page url in case a user tampers with the url params
    router.replace('/login', undefined, { shallow: true });

    // remove employee object from the local storage
    // localStorage.removeItem('employee')

    // set focus on email textfield
    setFocus('email');
  }, []);

  /**
   *  this effect is intended for handling the timeout error
   *  this will only run if employee microservice cannot be accessed
   */
  useEffect(() => {
    // get the values from the login form
    const { email, password } = getValues();

    // check if router query param is equal to timeout and email or password is not empty
    if (router.query.error === 'timeout' && (email || password)) {
      // display timeout error
      setError({
        status: true,
        message: 'Your connection with the server has timed out',
        animate: true,
      });

      // set loading spinner to false
      setIsLoading(false);
    }
  }, [router.query.error]); // check for changes in the error query param from the url

  /***
   * handle error events
   * @param message a message that describes what the error is all about
   */
  const handleLoginError = (message: string) => {
    // set loading state to false
    setIsLoading(false);

    // set the error state
    setError({ status: true, message, animate: true });

    return;
  };

  /**
   * a form submit handler for the login event
   * @param credentials the data that the user inputted (email and password)
   */
  const login: SubmitHandler<LoginFormInput> = async (
    credentials: LoginFormInput
  ) => {
    try {
      // check if there is a query error in the url and remove the query param
      if (router.query.error)
        router.replace('/login', undefined, { shallow: true });

      // set the loading state to true
      setIsLoading(true);

      // extract input form data
      const { email, password } = credentials;

      // call the login end point to post user credentials object
      // const result = await axios.post(`${process.env.PORTAL_URL}/api/auth/login`, {
      //   email,
      //   password,
      //   clientId: process.env.CLIENT_ID,
      //   secret: process.env.CLIENT_SECRET,
      // })

      const { error, result } = await postData(
        'http://192.168.137.249:4002/user/signin',
        { email, password }
      );

      // check if the result return an error, go to dashboard otherwise
      result && router.push(`/dashboard/${result._id}`);
    } catch (error) {
      setIsLoading(false);
      setError({
        status: true,
        message: 'Cannot connect to server.',
        animate: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>PDS Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="flex-col justify-center grid-cols-3 gap-4 pt-24 overflow-x-visible sm:flex lg:grid ">
          <div className="col-span-2">
            <div className="flex flex-col items-center">
              <h1 className="px-5 py-2 text-5xl font-medium text-indigo-700 bg-transparent border-indigo-500 border-dashed select-none -mt-9">
                Personal Data Sheet
              </h1>
              <RealTimeSyncSvg height={400} width={400} />
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex flex-col items-center min-w-max ">
              <main className="rounded-lg border border-slate-100 bg-white  p-5 sm:mx-[3%] lg:w-[30rem]">
                <div>
                  <h2 className="text-2xl font-medium select-none text-slate-700">
                    Sign in
                  </h2>
                  <h2 className="mb-8 text-xs font-normal select-none text-slate-500">
                    {' '}
                    Welcome back! Please enter your credentials below.
                  </h2>
                </div>

                {error.status && (
                  <section className="mb-3">
                    <div
                      onAnimationEnd={() =>
                        setError({ ...error, animate: false })
                      }
                      className={`${
                        error.animate ? 'animate-shake' : null
                      } flex items-center gap-1 border-l-4 border-rose-300 bg-red-100 p-3`}
                    >
                      <p className="text-xs text-rose-700">{error.message}</p>
                    </div>
                  </section>
                )}

                <form
                  onSubmit={handleSubmit(login)}
                  id="login"
                  className="max-w-md"
                >
                  <div className="flex flex-col justify-center">
                    {/* Email Address Input */}
                    <div>
                      <input
                        placeholder="Email Address"
                        {...register('email')}
                        className={`w-full rounded-md border ${
                          errors.email
                            ? 'border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-rose-200 '
                            : 'border-slate-200  bg-white focus:border-indigo-500 focus:ring-0 '
                        } px-2 py-1 placeholder:text-sm `}
                        type="email"
                        autoFocus
                      />
                      {errors.email && (
                        <span role="alert" className="text-xs text-red-500">
                          {errors.email.message}
                        </span>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="mt-3">
                      <input
                        placeholder="Password"
                        {...register('password')}
                        className={`w-full rounded-md border ${
                          errors.password
                            ? 'border-rose-500 bg-rose-50 focus:border-rose-600 focus:ring-rose-200'
                            : 'border-slate-200 bg-white focus:border-indigo-500 focus:ring-0'
                        } px-2 py-1 placeholder:text-sm `}
                        type="password"
                      />
                      {errors.password && (
                        <span role="alert" className="text-xs text-red-500">
                          {errors.password.message}
                        </span>
                      )}
                    </div>

                    {errors.invalidCredentials && (
                      <span role="alert" className="text-xs text-red-500">
                        {errors.invalidCredentials.message}
                      </span>
                    )}

                    {/*Remember me and Forgot Password*/}
                    <div className="flex items-center justify-between mt-5">
                      <div>
                        <input
                          id="checkboxRemember"
                          type="checkbox"
                          {...register('rememberCredentials')}
                          className="rounded-sm cursor-pointer checked:bg-indigo-500 checked:hover:bg-indigo-600 focus:ring-transparent focus:checked:bg-indigo-600"
                        />
                        <label
                          htmlFor="checkboxRemember"
                          className="ml-2 text-xs font-normal cursor-pointer text-slate-600"
                        >
                          Remember me
                        </label>
                      </div>

                      {/* Forgot Password */}
                      <div>
                        <a
                          href=""
                          className="text-sm font-medium text-indigo-600 hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    {/*End of Remember me and Forgot Password*/}

                    {/* Login Button */}
                    <div>
                      <button
                        disabled={isLoading}
                        className={`${
                          isLoading
                            ? `cursor-progress bg-indigo-400`
                            : `cursor-pointer bg-indigo-500 transition-colors hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 focus:outline-none focus:ring focus:ring-indigo-300 active:bg-indigo-700`
                        } mt-10 w-full rounded-md px-5  py-2 text-white shadow-lg shadow-indigo-200 `}
                        type="submit"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <p className="text-sm font-medium uppercase">
                            {isLoading ? 'Processing' : 'Login'}
                          </p>
                          {isLoading && <LoadingIndicator size={5} />}
                        </span>
                      </button>
                    </div>

                    {/* Etc */}
                    <div className="block mt-10 text-xs text-center text-slate-400">
                      Copyright © 2022. All rights reserved.
                    </div>
                    <div className="block text-xs text-center text-slate-400">
                      General Santos City Water District
                    </div>
                  </div>
                </form>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
