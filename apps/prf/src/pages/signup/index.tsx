import { useEffect, useState } from 'react';
import { Button } from '../../components/modular/forms/buttons/Button';
import { TextField } from '../../components/modular/forms/TextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Checkbox } from '../../components/modular/forms/Checkbox';
import { Notice } from '../../components/modular/alerts/Notice';
import { AuthFooter } from '../../components/fixed/footer/AuthFooter';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { userSignin, userSignup, verifySignupToken } from '../../http-requests/user-requests';
import { EmployeeSignupDetails } from '../../types/employee.type';
import { PageTitle } from '../../components/modular/html/PageTitle';

type RegistrationFormInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = yup.object().shape({
  // specify validation rules for email
  email: yup.string().email('this field must be a valid email').required(),

  // specify validation rules for password
  password: yup.string().min(8).max(20).required(),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'passwords must match to confirm')
    .required('please confirm your password'),
});

export default function Signup({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    userId,
    email,
    userRole,
    details: { companyId, firstName, middleName, lastName, nameExt },
  } = data as EmployeeSignupDetails;

  const [isLoading, setIsLoading] = useState(false);

  const [agree, setAgree] = useState(false);

  // set state for controlling the displaying of error status
  const [isError, setIsError] = useState({ status: false, message: '', animate: false });

  // initialize router
  const router = useRouter();

  // initialize react hook form
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormInput>({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    // set default value for email input
    setValue('email', email);

    // set focus on password input on initial load
    setFocus('password');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginError = (message: string) => {
    // set loading state to false
    setIsLoading(false);

    // set the error state
    setIsError({ status: true, message, animate: true });
  };

  const handleRegister: SubmitHandler<RegistrationFormInput> = async ({ password }: RegistrationFormInput) => {
    if (!agree) {
      // set error state to true
      setIsError({ status: true, message: 'You need to agree to the Terms & Conditions to proceed.', animate: true });
    } else {
      // set error state to false
      setIsError({ status: false, message: '', animate: false });

      // set loading state to true
      setIsLoading(true);

      // attempt to signup the user
      await userSignup(
        userId,
        email,
        password,
        userRole,
        companyId,
        firstName,
        middleName,
        lastName,
        nameExt,
        async (res) => {
          // attempt to sign in the user if sign up is successful
          const { error } = await userSignin(email, password, (res) => handleLoginError(res));

          // reload the page
          if (!error) router.reload();
        }
      );
    }
  };

  return (
    <>
      <PageTitle title="Sign up" />
      <div className="flex flex-col items-center justify-center overflow-y-auto pt-16">
        <main className="w-[28rem] p-10">
          <header className="mb-8">
            <h1 className="text-2xl font-medium text-gray-700">Sign up</h1>
            <p className="text-sm text-gray-500 inline">Already have an account? You may sign in </p>{' '}
            <p className="text-sm text-indigo-500 cursor-pointer inline" onClick={() => router.push('/signin')}>
              here.
            </p>
          </header>

          {isError.status && (
            <section className="mb-5" onAnimationEnd={() => setIsError({ ...isError, animate: false })}>
              <Notice type="error" message={isError.message} animate={isError.animate} />
            </section>
          )}

          <form className="flex flex-col gap-3 pb-5" onSubmit={handleSubmit(handleRegister)}>
            <TextField
              controller={{ ...register('email') }}
              type="text"
              isDisabled
              isError={errors.email && errors.email.message ? true : false}
              errorMessage={errors.email?.message}
            />
            <TextField
              controller={{ ...register('password') }}
              type="password"
              placeholder="Password"
              isError={errors.password && errors.password.message ? true : false}
              errorMessage={errors.password?.message}
            />
            <TextField
              controller={{ ...register('confirmPassword') }}
              type="password"
              placeholder="Confirm password"
              isError={errors.confirmPassword && errors.confirmPassword.message ? true : false}
              errorMessage={errors.confirmPassword?.message}
            />

            <section className={`${errors.password ? 'mt-5' : 'mt-3'} flex items-end justify-between`}>
              <Checkbox
                onChange={() => setAgree(!agree)}
                checkboxId="user-terms"
                label={
                  <p className="text-xs inline">
                    I agree on the
                    <Link href="/signin">
                      <a className="text-indigo-700"> Terms of Service </a>
                    </Link>
                    and
                    <Link href="/signin">
                      <a className="text-indigo-700"> Privacy Policy</a>
                    </Link>
                  </p>
                }
              />
            </section>

            <div className="mt-10">
              <Button
                type="submit"
                isLoading={isLoading}
                btnLabel={isLoading ? 'Processing' : 'Sign up'}
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
  // make sure that there is no logged in user
  if (context.req.headers.cookie === undefined) {
    try {
      // verify email from jwt
      const data = await verifySignupToken(context.query.token as string);

      // return the data from jwt
      return { props: { data } };
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        return {
          redirect: {
            permanent: false,
            destination: '/404',
          },
        };
      }

      return {
        redirect: {
          permanent: false,
          destination: '/403',
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: `/create-profile`,
      },
    };
  }
};
