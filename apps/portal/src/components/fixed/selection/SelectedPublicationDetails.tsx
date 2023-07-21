import { useAppSelectionStore } from '../../../store/selection.store';

export const SelectedPublicationDetails = () => {
  const publicationDetails = useAppSelectionStore(
    (state) => state.publicationDetails
  );

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col lg:flex-row h-auto p-4 mt-5 mb-2 rounded gap-2">
          <section className="w-full lg:w-[50%]">
            <div className="flex w-full align-text-top">
              <p className="flex justify-start font-normal text-sm text-gray-700 w-[50%] lg:w-[50%]">
                Date of Panel Interview:
              </p>
              <p className="flex justify-end text-end lg:justify-start font-normal text-sm text-gray-800 w-[50%] lg:w-[50%] lg:pl-10">
                {publicationDetails.dateOfPanelInterview}
              </p>
            </div>
            <div className="flex w-full align-text-top">
              <p className="flex justify-start font-normal text-sm text-gray-700 w-[75%] lg:w-[50%]">
                Number of Submitted Applications:
              </p>
              <p className="flex justify-end lg:justify-start font-normal text-sm text-gray-800 w-[25%] lg:w-[50%] pl-10">
                {publicationDetails.numberOfApplicants}
              </p>
            </div>

            {/* <div> Number of Applicants: {publicationDetails.numberOfApplicants}</div> */}
          </section>
          <section className="w-full lg:w-[50%] lg:pl-28">
            {/* <div>Number of Interviewed Applicants: {publicationDetails.numberOfInterviewedApplicants}</div> */}
            <div className="flex w-full lg:pl-10 align-text-top">
              <p className="flex justify-start font-normal text-sm text-gray-700 w-[75%] lg:w-[75%]">
                Number of Interviewed Applicants:
              </p>
              <p className="flex justify-end lg:justify-start font-normal text-sm text-gray-800 pl-10 lg:pl-0 w-[25%] lg:w-[25%]">
                {publicationDetails.numberOfInterviewedApplicants}
              </p>
            </div>
            {/* <div>Number of Qualified Applicants: {publicationDetails.numberOfQualifiedApplicants}</div> */}
            <div className="flex w-full lg:pl-10 align-text-top">
              <p className="flex justify-start font-normal text-sm text-gray-700 w-[75%] lg:w-[75%]">
                Number of Qualified Applicants:
              </p>
              <p className="flex justify-end lg:justify-start font-normal text-sm text-gray-800 pl-10 lg:pl-0 w-[25%] lg:w-[25%]">
                {publicationDetails.numberOfQualifiedApplicants}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
