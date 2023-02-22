import { useAppSelectionStore } from "../../../store/selection.store"

export const SelectedPublicationDetails = () => {

    const publicationDetails = useAppSelectionStore((state) => state.publicationDetails)

    return <>
        <div className="w-full">
            <div className="h-auto rounded p-4 flex mt-5 mb-2">
                <section className="w-[50%]">
                    <div className="flex w-full align-text-top">
                        <p className="flex justify-start font-normal text-xs text-gray-700 w-[25%]">Date of Panel Interview:</p>
                        <p className="flex justify-start font-normal text-sm text-gray-800 w-[75%] pl-10">{publicationDetails.dateOfPanelInterview}</p>
                    </div>
                    <div className="flex w-full align-text-top">
                        <p className="flex justify-start font-normal text-xs text-gray-700 w-[25%]">Number of Applicants:</p>
                        <p className="flex justify-start font-normal text-sm text-gray-800 w-[75%] pl-10">{publicationDetails.numberOfApplicants}</p>
                    </div>

                    {/* <div> Number of Applicants: {publicationDetails.numberOfApplicants}</div> */}
                </section>
                <section className="w-[50%] pl-28">
                    {/* <div>Number of Interviewed Applicants: {publicationDetails.numberOfInterviewedApplicants}</div> */}
                    <div className="flex w-full align-text-top pl-10">
                        <p className="flex justify-start font-normal text-xs text-gray-700 w-[75%]">Number of Interviewed Applicants:</p>
                        <p className="flex justify-start font-normal text-sm text-gray-800 w-[25%]">{publicationDetails.numberOfInterviewedApplicants}</p>
                    </div>
                    {/* <div>Number of Qualified Applicants: {publicationDetails.numberOfQualifiedApplicants}</div> */}
                    <div className="flex w-full align-text-top pl-10">
                        <p className="flex justify-start font-normal text-xs text-gray-700 w-[75%]">Number of Qualified Applicants:</p>
                        <p className="flex justify-start font-normal text-sm text-gray-800 w-[25%]">{publicationDetails.numberOfQualifiedApplicants}</p>
                    </div>
                </section>
            </div>
        </div>
    </>
}