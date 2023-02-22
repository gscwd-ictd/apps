import { HiCheckCircle } from "react-icons/hi";

export const PdsAlertSubmitSuccess = () => {
    return (
        <>
            <div className="w-full px-5">
                <div className="flex gap-2 place-items-center">
                    <HiCheckCircle className="text-green-500 animate-pulse" size={30} />
                    <div className="text-3xl font-semibold text-indigo-800">Success</div>
                </div>
                <div className="bg-inherit text-md font-light mt-2">
                    <span className="text-lg font-light">You have successfully submitted your Personal Data Sheet.</span>
                    <br /><br />
                    <span>You may close this window or click the view pds.</span>

                </div>
            </div>
        </>
    );
};
