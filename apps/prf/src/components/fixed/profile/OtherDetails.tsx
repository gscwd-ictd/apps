import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createEmployee } from '../../../http-requests/employee-requests';
import { useProfileStore } from '../../../store';
import { Button } from '../../modular/forms/buttons/Button';
import { TextField } from '../../modular/forms/TextField';

type OtherDetailsInput = {
  sex: string;
  birthDate: Date;
  mobile: string;
  email: string;
};

export const OtherDetails: FunctionComponent = () => {
  const { pendingUser, setPendingUser } = useProfileStore();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtherDetailsInput>();

  const handleSave: SubmitHandler<OtherDetailsInput> = async () => {
    await createEmployee(pendingUser);

    router.reload();
  };

  return (
    <>
      <section className="mt-12 flex justify-center">
        <div className="mt-5">
          <form className="space-y-3" onSubmit={handleSubmit(handleSave)}>
            <select
              onChange={(e) => setPendingUser({ ...pendingUser, sex: e.target.value })}
              className="w-full border border-gray-200 rounded focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <TextField
              type="date"
              controller={{
                ...register('birthDate'),
                onChange: async (e) => setPendingUser({ ...pendingUser, birthDate: e.target.value }),
              }}
            />

            <TextField
              controller={{
                ...register('mobile'),
                onChange: async (e) => setPendingUser({ ...pendingUser, mobile: e.target.value }),
              }}
              type="text"
              placeholder="Mobile number"
            />

            <TextField
              controller={{
                ...register('email'),
                onChange: async (e) => setPendingUser({ ...pendingUser, email: e.target.value }),
              }}
              type="text"
              placeholder="Email address"
            />

            <div className="flex justify-end">
              <div className="w-20 mt-2">
                <Button btnLabel="Register" fluid strong />
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
