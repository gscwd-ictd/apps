import { HiExclamationCircle } from "react-icons/hi"

type PdsAlertSubmitConfirmationProps = {

}

export const PdsAlertSubmitConfirmation = () => {
    return (<>

        <div className="flex-row w-full h-auto items-center p-5">
            <div className="text-slate-700 text-lg w-full text-left font-normal ">
                <div className="flex gap-2 place-items-center"><HiExclamationCircle size={30} className="text-yellow-400" /><div className="text-3xl font-semibold text-gray-700">Action</div></div>
                <div className="flex gap-2 text-left text-md font-light"><div>Are you sure you want to submit your PDS? This action cannot be undone.</div></div>

            </div>
            <div className="text-slate-700 text-lg w-full text-left font-light mt-5 ">Do you want to proceed?</div>
        </div></>)
}