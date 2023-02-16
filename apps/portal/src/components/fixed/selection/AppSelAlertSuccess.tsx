import { HiCheckCircle } from "react-icons/hi";

export const AppSelAlertSuccess = () => {
  return (
    <>
      <div className="w-full px-5">
        <div className="flex gap-2 place-items-center">
          <HiCheckCircle className="text-green-500 animate-pulse" size={30} />
          <div className="text-3xl font-semibold text-indigo-800">Success</div>
        </div>
        <div className="bg-inherit text-md font-light mt-2">
          Your actions have been submitted successfully. Thank you!
        </div>
      </div>
    </>
  );
};
