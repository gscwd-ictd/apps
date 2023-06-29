import { HiCheckCircle } from 'react-icons/hi';

export const AppEndAlertSuccess = () => {
  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-2">
          <HiCheckCircle className="text-green-500 animate-pulse" size={30} />
          <span className="text-2xl">Success</span>
        </div>
        <hr />
        <div className="px-5 text-lg font-light bg-inherit">
          The list of selected applicants have been successfully submitted.
          Thank you.
        </div>
      </div>
    </>
  );
};
