import { FunctionComponent, useEffect } from 'react';
import { Button } from '../../modular/forms/buttons/Button';
import { TextField } from '../../modular/forms/TextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createEmployee } from '../../../http-requests/employee-requests';
import Router from 'next/router';
import { useProfileStore } from '../../../store/create-profile.store';

type NameInfoFormInput = {
  firstName: string;
  middleName: string;
  lastName: string;
  nameExt: string;
};

const validationSchema = yup.object().shape({
  // specify validation rules for first name
  firstName: yup.string().required('please enter your first name'),

  // specify validation rules for middle name
  middleName: yup.string().required('please enter your middle name'),

  // specify validation rules for last name
  lastName: yup.string().required('please enter your last name'),
});

export const NameInfo: FunctionComponent = () => {
  const { pendingUser, setPendingUser, setNextPage } = useProfileStore();

  // initialize react hook form
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<NameInfoFormInput>({ resolver: yupResolver(validationSchema) });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setFocus('firstName'), []);

  const save: SubmitHandler<NameInfoFormInput> = async ({
    firstName,
    middleName,
    lastName,
    nameExt,
  }: NameInfoFormInput) => {
    // update pending user
    setPendingUser({ ...pendingUser, firstName, middleName, lastName, nameExt });

    setNextPage();

    // console.log(pendingUser);
    //await createEmployee(pendingUser);

    // reload the page
    // Router.reload();
  };

  return (
    <>
      <section className="mt-12 flex justify-center">
        <div className="mt-5 flex gap-5">
          <form
            className={`${errors.firstName || errors.middleName || errors.lastName ? 'space-y-5' : 'space-y-3'}`}
            onSubmit={handleSubmit(save)}
          >
            <TextField
              controller={{
                ...register('firstName'),
                onChange: async (e) => setPendingUser({ ...pendingUser, firstName: e.target.value }),
              }}
              defaultValue={pendingUser.firstName}
              type="text"
              placeholder="First name"
              isError={errors.firstName && errors.firstName.message ? true : false}
              errorMessage={errors.firstName?.message}
            />

            <TextField
              controller={{
                ...register('middleName'),
                onChange: async (e) => setPendingUser({ ...pendingUser, middleName: e.target.value }),
              }}
              defaultValue={pendingUser.middleName}
              type="text"
              placeholder="Middle name"
              isError={errors.middleName && errors.middleName.message ? true : false}
              errorMessage={errors.middleName?.message}
            />

            <TextField
              controller={{
                ...register('lastName'),
                onChange: async (e) => setPendingUser({ ...pendingUser, lastName: e.target.value }),
              }}
              defaultValue={pendingUser.lastName}
              type="text"
              placeholder="Last name"
              isError={errors.lastName && errors.lastName.message ? true : false}
              errorMessage={errors.lastName?.message}
            />

            <TextField
              controller={{
                ...register('nameExt'),
                onChange: async (e) => setPendingUser({ ...pendingUser, nameExt: e.target.value }),
              }}
              defaultValue={pendingUser.nameExt}
              type="text"
              placeholder="Name extension"
            />

            <div className="flex justify-end">
              <div className="w-20 mt-2">
                <Button btnLabel="Next" fluid />
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
