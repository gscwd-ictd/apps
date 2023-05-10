import { useState } from 'react';
import { useAppEndStore } from '../../../store/endorsement.store';
import { UndrawSelecting } from '../undraw/Selecting';
import { AllApplicantsList } from './AllApplicantsList';
import { AppEndPds } from './AppEndPds';
import { SelectedApplicantCard } from './SelectedApplicantCard';
import { SelectedPublication } from './SelectedPublication';

export const AppEndSelectApplicants = () => {
  const selectedPublication = useAppEndStore(
    (state) => state.selectedPublication
  );

  const selectedApplicants = useAppEndStore(
    (state) => state.selectedApplicants
  );

  const selectedApplicantDetails = useAppEndStore(
    (state) => state.selectedApplicantDetails
  );

  const applicantList = useAppEndStore((state) => state.applicantList);

  const [showPds, setShowPds] = useState<boolean>(false);

  return (
    <>
      <div>
        <SelectedPublication publication={selectedPublication} />
      </div>
      <div className="flex justify-between w-full grid-cols-2">
        <div className="col-span-1 px-5 mt-5 mb-2 font-light text-gray-500">
          Select applicants for short-listing
        </div>
        <div className="col-span-1 px-5 mt-5 mb-2 font-light text-gray-500">
          <button
            type="button"
            tabIndex={-1}
            className=""
            onClick={() => setShowPds(!showPds)}
          >
            {showPds ? 'Hide PDS' : 'Show PDS'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 border rounded-md border-gray-50">
        {/** FIRST SECTION */}
        <section className="w-full col-span-3">
          <div className="flex justify-end px-5 py-2 mb-1 text-sm">
            {applicantList.length > 0 ? (
              <>
                {' '}
                <p className="text-gray-600 font-extralight">
                  {selectedApplicants.length > 0
                    ? selectedApplicants.length
                    : ' '}{' '}
                  {selectedApplicants.length === 1
                    ? 'applicant'
                    : selectedApplicants.length === 0
                    ? 'No applicant'
                    : 'applicants'}{' '}
                  selected
                </p>
              </>
            ) : null}
          </div>
          <div className="h-[32rem] overflow-y-auto">
            <AllApplicantsList />
          </div>
        </section>
        {/** SECOND SECTION */}
        <section
          className={`${
            showPds ? 'col-span-5' : 'col-span-9'
          } bg-gray-50 bg-opacity-50 px-5 pt-5 transition-all `}
        >
          {selectedApplicants.length > 0 ? (
            <div className="h-[32rem] overflow-y-auto">
              {' '}
              <SelectedApplicantCard showPds={showPds} />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center w-full h-full gap-5">
                <UndrawSelecting width={250} height={250} />
                <div className="text-2xl text-gray-300">
                  Select at least 1 applicant to proceed
                </div>
              </div>
            </>
          )}
        </section>
        {/** THIRD SECTION */}
        {showPds ? (
          <section className="w-full h-[32rem] bg-gray-100 shadow-md rounded overflow-y-auto col-span-4">
            {/** PDS COMPONENT */}
            <AppEndPds applicantDetails={selectedApplicantDetails} />
          </section>
        ) : null}
      </div>
    </>
  );
};
