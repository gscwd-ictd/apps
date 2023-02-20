import { AuthFooter } from '../../components/fixed/footer/AuthFooter';
import { Button } from '../../components/modular/forms/buttons/Button';
import { TextField } from '../../components/modular/forms/TextField';
import { HiArrowLeft } from 'react-icons/hi';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { BsShieldLockFill } from 'react-icons/bs';
import { PageTitle } from '../../components/modular/html/PageTitle';

type ForgotPasswordFormInput = {
  email: string;
};

const validationSchema = yup.object().shape({
  // specify validation rules for email
  email: yup.string().email('this field must be a valid email').required(),
});

export default function ForgotPassword() {
  // initialize react hook form
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ForgotPasswordFormInput>({ resolver: yupResolver(validationSchema) });

  const router = useRouter();

  useEffect(() => setFocus('email'));

  const forgotPassword = () => {};

  return (
    <>
      <PageTitle title="Forgot Password" />
      <div className="flex flex-col items-center justify-center overflow-y-auto pt-16">
        <main className="w-[28rem] p-10">
          <header className="mb-8">
            <div className="flex justify-center mb-7">
              <div className="h-16 w-16 rounded-full bg-indigo-100 bg-opacity-70 flex items-center justify-center">
                <BsShieldLockFill className="h-8 w-8 text-indigo-500" />
              </div>
            </div>
            <h1 className="text-2xl font-medium text-gray-700">Forgot password?</h1>
            <p className="text-sm text-gray-500">Do not worry, we will send you reset instructions.</p>
          </header>

          <section>
            <form onSubmit={handleSubmit(forgotPassword)}>
              <div>
                <TextField
                  controller={{ ...register('email') }}
                  type="text"
                  placeholder="Enter your email address"
                  isError={errors.email && errors.email.message ? true : false}
                  errorMessage={errors.email?.message}
                />
              </div>

              <div className="mt-5">
                <Button btnLabel="Reset password" strong shadow fluid />
              </div>
            </form>

            <div
              className="flex items-center gap-2 text-sm text-gray-500 mt-10 justify-center cursor-pointer hover:text-gray-700 transition-transform hover:scale-105"
              onClick={() => router.push('/signin')}
            >
              <HiArrowLeft />
              <p>Back to sign in</p>
            </div>
          </section>
        </main>
      </div>
      <AuthFooter />
    </>
  );
}
