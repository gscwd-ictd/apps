import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SpinnerCircularFixed } from 'spinners-react';
import { useApplicantStore, ApplicantFormData } from '../../../store/applicant.store';
import { usePageStore } from '../../../store/page.store';
import schema from '../../../schema/ApplicantEmail';
import { StyledButton } from '../../modular/buttons/StyledButton';
import { useRouter } from 'next/router';
import { postData } from '../../../../utils/hoc/axios';
import { usePublicationStore } from '../../../store/publication.store';
import { FloatingLabelInputRF } from '../../modular/inputs/FloatingLabelInputRF';
import { isEmpty } from 'lodash';
import axios from 'axios';
import { CardContainer } from '../../modular/cards/CardContainer';
import { HiInformationCircle } from 'react-icons/hi2';
import { useState } from 'react';

export const ApplicantEmail = () => {
  const router = useRouter();

  const [isVerifyError, setIsVerifyError] = useState<boolean>(false);

  const applicant = useApplicantStore((state) => state.applicant);
  const isLoading = usePageStore((state) => state.isLoading);
  const setApplicant = useApplicantStore((state) => state.setApplicant);
  const setIsLoading = usePageStore((state) => state.setIsLoading);
  const setPage = usePageStore((state) => state.setPage);
  const publication = usePublicationStore((state) => state.publication);

  const onSubmit = async () => {
    localStorage.removeItem('applicant');
    setIsLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      // console.log(error);
    }

    const { result, error } = await postData(
      `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/${publication.vppId}`,
      {
        email: applicant.email,
      }
    );

    if (!error && !isEmpty(result.token)) {
      // setIsLoading(true);
      localStorage.setItem('applicant', JSON.stringify(result.details));

      // redirect page if email is found
      await router.push(`${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/create-session/?token=${result.token}`);
      setIsLoading(false);
    } else if (isEmpty(result)) {
      // change page to page 2 if email is not existing
      setTimeout(() => {
        setPage(2);
        setIsLoading(false);
      }, 1000);
    } else if (error === true) {
      setIsVerifyError(error);

      // if vpp id is not found
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicantFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return (
    <>
      {isVerifyError ? (
        <CardContainer className="rounded-xl p-3 mx-4" bgColor={'bg-red-100'} title={''} remarks={''} subtitle={''}>
          <div className="flex gap-2">
            <section>
              <HiInformationCircle size={30} className="text-slate-600" />
            </section>
            <section className="text-xs sm:text-xs md:text-md lg:text-sm">Verification Error</section>
          </div>
        </CardContainer>
      ) : null}

      <form id="applicantEmail" className="w-full px-12 mt-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-start w-full mb-10 text-2xl font-semibold">Applicant Information</div>

        <div className="w-full mb-5">
          <FloatingLabelInputRF
            type="text"
            id="email"
            placeholder="Email"
            controller={{
              ...register('email', {
                value: applicant.email,
                onChange: (e) =>
                  setApplicant({
                    ...applicant,
                    email: e.target.value,
                  }),
              }),
            }}
            isError={errors.email ? true : false}
            errorMessage={errors.email?.message}
            className="placeholder:text-sm placeholder:text-gray-600"
          />
        </div>
        <div className="w-full mb-5">
          <FloatingLabelInputRF
            id="confirmEmail"
            placeholder="Confirm Email Address"
            type="text"
            controller={{
              ...register('confirmEmail', {
                value: applicant.confirmEmail,
                onChange: (e) =>
                  setApplicant({
                    ...applicant,
                    confirmEmail: e.target.value,
                  }),
              }),
            }}
            isError={errors.confirmEmail ? true : false}
            errorMessage={errors.confirmEmail?.message}
            name="emailAddress"
            className="placeholder:text-sm placeholder:text-gray-600"
          />
        </div>
        <div className="flex justify-start w-full mb-2 text-xs font-light">
          The provided email address will be used for your Personal data sheet.
        </div>
        <div className="mb-16 flex min-w-[8rem]">
          <StyledButton
            type="submit"
            capital
            strong
            fluid
            form="applicantEmail"
            variant="success"
            disabled={isLoading ? true : false}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <SpinnerCircularFixed color="blue" size={20} />
                <div>Processing...</div>
              </div>
            ) : (
              'Submit'
            )}
          </StyledButton>
        </div>
      </form>
    </>
  );
};
