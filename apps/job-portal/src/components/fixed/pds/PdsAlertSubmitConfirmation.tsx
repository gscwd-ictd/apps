import { HiExclamationCircle } from 'react-icons/hi';
import { useApplicantStore } from '../../../store/applicant.store';

export const PdsAlertSubmitConfirmation = () => {
  const isExistingApplicant = useApplicantStore(
    (state) => state.isExistingApplicant
  );
  return (
    <>
      <div className="flex-row items-center w-full h-auto p-5">
        <div className="w-full text-lg font-normal text-left text-slate-700 ">
          <div className="flex gap-2 place-items-center">
            <HiExclamationCircle size={30} className="text-yellow-400" />
            <div className="text-3xl font-semibold text-gray-700">Action</div>
          </div>
          <div className="flex gap-2 font-light text-left text-md">
            <div>
              Are you sure you want to{' '}
              {isExistingApplicant ? 'update' : 'submit'} your Personal Data
              Sheet? This action cannot be undone.
            </div>
          </div>
        </div>
        <div className="w-full mt-5 text-lg font-light text-left text-slate-700 ">
          Do you want to proceed?
        </div>
      </div>
    </>
  );
};
