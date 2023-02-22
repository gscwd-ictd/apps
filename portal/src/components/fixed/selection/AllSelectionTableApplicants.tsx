import { AllSelectionApplicantCounter } from "./AllSelectionApplicantCounter"
import { AllSelectionApplicantsList } from "./AllSelectionApplicantsList"

export const AllSelectionTableApplicants = () => {

    return (<>

        <div className="grid grid-cols-5 rounded-md">
            <div className="col-span-5">

                <AllSelectionApplicantCounter />

                <AllSelectionApplicantsList />

            </div>

        </div></>)
}