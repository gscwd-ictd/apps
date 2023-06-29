import { isEmpty } from 'lodash';
import { useAppEndStore } from '../../../store/endorsement.store';
import { UndrawSelecting } from '../undraw/Selecting';
import { AllApplicantsList } from './AllApplicantsList';
import { AppEndPds } from './AppEndPds';
import { SelectedApplicantCard } from './SelectedApplicantCard';
import { SelectedPublication } from './SelectedPublication';

export const AppEndSelectApplicants = () => {
  const applicantList = useAppEndStore((state) => state.applicantList);

  const {
    showPds,
    selectedPublication,
    selectedApplicantDetails,
    selectedApplicants,
    setShowPds,
  } = useAppEndStore((state) => ({
    showPds: state.showPds,
    setShowPds: state.setShowPds,
    selectedApplicants: state.selectedApplicants,
    selectedApplicantDetails: state.selectedApplicantDetails,
    selectedPublication: state.selectedPublication,
  }));

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
            className="text-sm font-medium text-indigo-700 disabled:cursor-not-allowed"
            onClick={() => setShowPds(!showPds)}
            hidden={isEmpty(selectedApplicantDetails) ? true : false}
          >
            {showPds ? 'Hide PDS' : 'Show PDS'}
          </button>
        </div>
      </div>
      <div className="flex grid w-full grid-cols-12 gap-5 rounded-md ">
        {/** FIRST SECTION */}
        <section className="w-full col-span-4">
          <div className="flex justify-end py-2 mb-1 text-sm">
            {applicantList.length > 0 ? (
              <>
                <p className="font-medium text-gray-600">
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
            showPds ? 'col-span-4' : 'col-span-8'
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
          <section className="w-full h-[36rem] bg-gray-100 shadow-md rounded overflow-y-auto col-span-4">
            {/** PDS COMPONENT */}

            <AppEndPds applicantDetails={selectedApplicantDetails} />
          </section>
        ) : null}
      </div>
    </>
  );
};
