import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SpinnerCircularFixed } from 'spinners-react';
import {
  useApplicantStore,
  ApplicantFormData,
} from '../../../store/applicant.store';
import { usePageStore } from '../../../store/page.store';
import schema from '../../../schema/Applicant';
import { StyledButton } from '../../modular/buttons/StyledButton';
import { useRouter } from 'next/router';
import { FloatingLabelInputRF } from '../../modular/inputs/FloatingLabelInputRF';
import { usePublicationStore } from '../../../store/publication.store';
import axios from 'axios';

export const ApplicantForm = () => {
  const router = useRouter();
  const applicant = useApplicantStore((state) => state.applicant);
  const isLoading = usePageStore((state) => state.isLoading);
  const setApplicant = useApplicantStore((state) => state.setApplicant);
  const setIsLoading = usePageStore((state) => state.setIsLoading);
  const publication = usePublicationStore((state) => state.publication);

  async function onSubmit(applicant: ApplicantFormData) {
    // const { checkbox, ...rest } = applicant

    setIsLoading(true);
    localStorage.setItem('applicant', JSON.stringify(applicant));
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/auth/logout`,
        {},
        { withCredentials: true }
      );

      await router.push(
        `${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${publication.vppId}/checklist`
      );
    } catch (error) {
      //
    }

    return setIsLoading(false);
  }

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
      <form
        id="applicantInfo"
        className="w-full px-12 mt-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-start w-full mb-10 text-2xl font-semibold">
          Applicant Information
        </div>

        <div className="w-full mb-5">
          <FloatingLabelInputRF
            id="firstName"
            type="text"
            controller={{
              ...register('firstName', {
                value: applicant.firstName,
                onChange: (e) =>
                  setApplicant({
                    ...applicant,
                    firstName: e.target.value,
                  }),
              }),
            }}
            isError={errors.firstName ? true : false}
            errorMessage={errors.firstName?.message}
            name="firstName"
            placeholder="First Name"
            className="placeholder:text-sm placeholder:text-gray-600"
          />
        </div>

        <div className="w-full mb-5">
          <FloatingLabelInputRF
            id="middleName"
            type="text"
            controller={{
              ...register('middleName', {
                value: applicant.middleName,
                onChange: (e) =>
                  setApplicant({
                    ...applicant,
                    middleName: e.target.value,
                  }),
              }),
            }}
            isError={errors.middleName ? true : false}
            errorMessage={errors.middleName?.message}
            name="middleName"
            placeholder="Middle Name"
            className="placeholder:text-sm placeholder:text-gray-600"
          />
        </div>

        <div className="w-full mb-5 ">
          <FloatingLabelInputRF
            id="lastName"
            type="text"
            placeholder="Last Name"
            controller={{
              ...register('lastName', {
                value: applicant.lastName,
                onChange: (e) =>
                  setApplicant({
                    ...applicant,
                    lastName: e.target.value,
                  }),
              }),
            }}
            isError={errors.lastName ? true : false}
            errorMessage={errors.lastName?.message}
            name="lastName"
            className="placeholder:text-sm placeholder:text-gray-600"
          />
        </div>

        <div className="w-full mb-5">
          <FloatingLabelInputRF
            id="nameExtension"
            placeholder="Name Extension / Suffix"
            type="text"
            controller={{
              ...register('nameExtension', {
                value: applicant.nameExtension,
                onChange: (e) =>
                  setApplicant({
                    ...applicant,
                    nameExtension: e.target.value,
                  }),
              }),
            }}
            isError={errors.nameExtension ? true : false}
            errorMessage={errors.nameExtension?.message}
            name="nameExtension"
            className="placeholder:text-sm placeholder:text-gray-600"
          />
        </div>

        <div className="w-full mb-5">
          <FloatingLabelInputRF
            id="email"
            placeholder="Email"
            type="text"
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
            muted={true}
            name="emailAddress"
            className="placeholder:text-sm placeholder:text-gray-600"
          />
        </div>

        <div className="flex items-center w-full gap-2 mb-5 text-xs text-gray-500">
          <input
            type="Checkbox"
            id="agree"
            className="rounded hover:cursor-pointer active:bg-slate-200"
            {...register('checkbox', {
              value: applicant.checkbox,
              onChange: () =>
                setApplicant({ ...applicant, checkbox: !applicant.checkbox }),
            })}
          />
          <label htmlFor="agree" className="hover:cursor-pointer">
            By ticking, you are confirming that you have read, understood and
            agree to GSCWD Terms and Conditions.
          </label>
        </div>

        <div className="mb-16 flex min-w-[8rem]">
          <StyledButton
            type="submit"
            capital
            strong
            fluid
            form="applicantInfo"
            variant="success"
            isDisabled={isLoading ? true : applicant.checkbox ? false : true}
            disabled={isLoading ? true : applicant.checkbox ? false : true}
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
