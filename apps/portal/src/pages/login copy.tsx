import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import axios from 'axios';
import Head from 'next/head';
import * as yup from 'yup';
import { HttpRequest } from '../utils/helpers/http-requests';
import { LoginFooter } from '../components/fixed/footer/LoginFooter';
import { Alert } from '../components/modular/common/alerts/Alert';
import { Button } from '../components/modular/common/forms/Button';
import { Checkbox } from '../components/modular/common/forms/Checkbox';
import { TextField } from '../components/modular/common/forms/TextField';
import { getPortalSsid, invalidateSession } from '../utils/helpers/session';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import Image from 'next/image';

type LoginFormInput = {
  email: string;
  password: string;
};

const validationSchema = yup.object().shape({
  // specify validation rules for email
  email: yup
    .string()
    .email('This field must be a valid email')
    .required('Email address is not provided')
    .label('Email Address'),

  // specify validation rules for password
  password: yup.string().required('Password is not provided').label('Password'),
});

export default function Login() {
  // set state for remember me checkbox
  const [rememberMe, setRememberMe] = useState(true);

  // set state for controlling the displaying of error status
  const [error, setError] = useState({
    status: false,
    message: '',
    animate: false,
  });

  // set state for handling backend request loading status
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, seIsShowPassword] = useState(false);

  // initialize router
  const router = useRouter();

  // initialize react hook form
  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    formState: { errors },
  } = useForm<LoginFormInput>({ resolver: yupResolver(validationSchema) });

  /**
   *  this effect is to make sure that the app assumes that the page is loaded
   *  for the first time
   */
  useEffect(() => {
    // reset page url in case a user tampers with the url params
    router.replace('/login', undefined, { shallow: true });

    // set focus on email textfield
    setFocus('email');
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
      setError({
        status: true,
        message: 'Your connection with the server has timed out.',
        animate: true,
      });

      // set loading spinner to false
      setIsLoading(false);
    }
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
    setError({ status: true, message, animate: true });
  };

  const login: SubmitHandler<LoginFormInput> = async ({ email, password }: LoginFormInput) => {
    // check if there is a query error in the url and remove the query param
    if (router.query.error) router.replace('/login', undefined, { shallow: true });

    // set the loading state to true
    setIsLoading(true);

    // create credentials object, appending the clientId and clientSecret along with email and password
    const credentials = { email, password };

    // call the login end point to post user credentials object
    const { error, result } = await HttpRequest.post(
      `${process.env.NEXT_PUBLIC_PORTAL_URL}/users/web/signin`,
      credentials
    );

    // check if result returned an error, go to dashboard otherwise
    error ? handleLoginError(result) : router.reload();
  };

  const [heartCount, setHeartCount] = useState(0);

  return (
    <>
      <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full overflow-hidden pointer-events-none opacity-10">
        <Image src={'/gwdlogo.png'} priority className="w-full md:w-2/4 " alt={''} width={'500'} height={'500'} />
      </div>
      <Head>
        <title>Employee Portal Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center pt-16 overflow-y-auto drop-shadow-xl">
        <main className="w-full md:w-[45rem] py-5 flex justify-center">
          <div className="hidden md:block w-[25%] bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-300 to-slate-600 rounded-tl-xl rounded-bl-xl ">
            <div className="px-0 mt-0 flex flex-row text-2xl font-medium h-full tracking-wider text-left text-white uppercase place-items-center ">
              <div className="w-80 p-3">
                <label>Employee Portal</label>
              </div>
              <div
                className="bg-contain bg-right w-80 "
                style={{ backgroundImage: `url('/ethnic.jpg')`, width: '100%', height: '100%' }}
              ></div>
            </div>
          </div>
          <div className="w-[95%] md:w-[75%] px-6 md:px-10 pb-4 bg-white rounded-tr-xl rounded-br-xl opacity-80">
            <header className="mb-8">
              <h1 className="mt-10 text-2xl font-medium text-gray-700">Sign in</h1>
              <p className="text-sm text-gray-500">Welcome back! Please enter your credentials below.</p>
            </header>

            {error.status && (
              <section className="mb-5" onAnimationEnd={() => setError({ ...error, animate: false })}>
                <Alert type="error" message={error.message} animate={error.animate} />
              </section>
            )}

            <form className="flex flex-col" onSubmit={handleSubmit(login)}>
              <section className={`${errors.email ? 'space-y-5' : 'space-y-3'}`}>
                <TextField
                  controller={{ ...register('email', { required: true }) }}
                  type="email"
                  defaultValue=""
                  placeholder="Email Address"
                  isError={errors.email && errors.email.message ? true : false}
                  errorMessage={errors.email?.message}
                />

                <div className="relative">
                  <TextField
                    controller={{ ...register('password', { required: true }) }}
                    type={`${isShowPassword ? 'text' : 'password'}`}
                    defaultValue=""
                    placeholder="Password"
                    isError={errors.password && errors.password.message ? true : false}
                    errorMessage={errors.password?.message}
                  />
                  {isShowPassword ? (
                    <HiEyeOff
                      className="absolute -mt-9 right-0 pr-2 fill-indigo-500 h-8 w-8 hover:fill-indigo-600 cursor-pointer opacity-70"
                      onClick={() => seIsShowPassword(!isShowPassword)}
                    ></HiEyeOff>
                  ) : (
                    <HiEye
                      className="absolute -mt-9 right-0 pr-2 fill-indigo-500 h-8 w-8 hover:fill-indigo-600 cursor-pointer opacity-70"
                      onClick={() => seIsShowPassword(!isShowPassword)}
                    ></HiEye>
                  )}
                </div>
              </section>

              <section className={`${errors.password ? 'mt-5' : 'mt-3'} flex items-end justify-between`}>
                <Checkbox label="Remember me" isChecked={rememberMe} setIsChecked={setRememberMe} />
                {/* <a href="#" className="text-sm text-indigo-700">
                  Forgot password?
                </a> */}
              </section>

              <section className="mt-10">
                <Button
                  type="submit"
                  btnLabel="Sign in"
                  isLoading={isLoading}
                  loadingLabel="Processing"
                  shadow
                  strong
                  fluid
                />
              </section>
            </form>
            <LoginFooter />
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  // check if session cookie is defined
  if (context.req.headers.cookie !== undefined) {
    // assign context cookie to cookie
    const cookie = context.req.headers.cookie;

    // assign the splitted cookie to cookies array
    const cookiesArray = cookie.split(';') as string[];

    // target ssid_portal cookie
    const portalSsid = getPortalSsid(cookiesArray);

    // used if else instead of trycatch
    if (portalSsid.length > 0) {
      const userDetails = await axios.get(`${process.env.NEXT_PUBLIC_PORTAL_URL}/users`, {
        withCredentials: true,

        // pass the generated ssid

        headers: { Cookie: portalSsid },
        // headers: { Cookie: `${context.req.headers.cookie}` },
      });

      const { user } = userDetails.data;

      // redirect to the dashboard page
      return {
        redirect: {
          destination: `/${user._id}`,
          permanent: false,
        },
      };
    } else {
      // invalidate session if it generated ssid

      invalidateSession(context.res);

      // redirect to not found page
      return {
        // notFound: true,
        props: {},
      };
    }
  } else
    return {
      props: {},
    };
};
