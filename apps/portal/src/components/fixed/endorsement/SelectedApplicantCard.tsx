import { HiUserCircle } from 'react-icons/hi';
import { useAppEndStore } from '../../../store/endorsement.store';

type SelectedApplicantCardProps = {
  showPds: boolean;
};

export const SelectedApplicantCard = ({
  showPds,
}: SelectedApplicantCardProps): JSX.Element => {
  const { selectedApplicants } = useAppEndStore((state) => ({
    selectedApplicants: state.selectedApplicants,
    setSelectedApplicantDetails: state.setSelectedApplicantDetails,
  }));

  return (
    <>
      {selectedApplicants &&
        selectedApplicants.map((applicant, index: number) => {
          return (
            <div
              className="p-5 my-5 bg-white rounded shadow-lg shadow-slate-100 ring-1 ring-slate-100"
              key={index}
            >
              <div className="flex items-center justify-between">
                <section className="flex items-center w-full gap-5">
                  <div className="flex items-center justify-center w-12 h-10 rounded bg-indigo-50">
                    <HiUserCircle className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="font-light text-gray-500">
                    {applicant.applicantName}
                  </div>
                </section>
                {/* <section className="flex justify-end w-full">
                  {showPds ? (
                    <div className="flex items-center justify-center h-10 px-2 py-2 rounded w-max bg-indigo-50 ">
                      <button
                        onClick={() =>
                          setSelectedApplicantDetails({
                            applicantId: applicant.applicantId,
                            applicantType: applicant.applicantType,
                          })
                        }
                      >
                        <div className="flex items-center w-full gap-2">
                          <HiEye className="w-6 h-6 text-indigo-500" />
                          <div className="text-xs text-indigo-400">
                            View PDS
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : null}
                </section> */}
              </div>
            </div>
          );
        })}
    </>
  );
};
