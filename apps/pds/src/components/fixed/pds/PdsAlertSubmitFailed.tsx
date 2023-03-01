import { HiExclamationCircle } from 'react-icons/hi2';

export const PdsAlertSubmitFailed = () => {
  return (
    <>
      <div className="w-full px-5">
        <div className="flex gap-2 place-items-center">
          <HiExclamationCircle
            className="text-red-500 animate-pulse"
            size={30}
          />
          <div className="text-3xl font-semibold text-indigo-800">Failed!</div>
        </div>
        <div className="mt-2 font-light bg-inherit text-md">
          There is a problem in submitting your Pds. Please contact support for
          further details.
        </div>
      </div>
    </>
  );
};
