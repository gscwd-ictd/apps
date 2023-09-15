/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { useForm } from 'react-hook-form';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import { EmployeeOvertimeDetail } from 'libs/utils/src/lib/types/overtime.type';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const { overtimeDetails, pendingOvertimeModalIsOpen } = useApprovalStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
  }));

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      // passSlipId: passSlip.id,
      // status: null,
    },
  });

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { windowWidth } = UseWindowDimensions();

  // cancel action for Leave Pending Modal
  const closeCancelOvertimeModal = async () => {
    // setCancelOvertimeModalIsOpen(false);
  };

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Application</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {/* Cancel Overtime Application Modal */}
          {/* <CancelOvertimeModal
            modalState={cancelOvertimeModalIsOpen}
            setModalState={setCancelOvertimeModalIsOpen}
            closeModalAction={closeCancelOvertimeModal}
          />

          <OvertimeSupervisorAccomplishmentModal
            modalState={accomplishmentOvertimeModalIsOpen}
            setModalState={setAccomplishmentOvertimeModalIsOpen}
            closeModalAction={closeOvertimeAccomplishmentModal}
          /> */}
          {!overtimeDetails ? (
            <>
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col  ">
              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-2 p-4 rounded">
                  {overtimeDetails.status === OvertimeStatus.PENDING ? (
                    <AlertNotification alertType="info" notifMessage={'For Supervisor Approval'} dismissible={false} />
                  ) : null}
                  {overtimeDetails.status === OvertimeStatus.APPROVED ? (
                    <AlertNotification alertType="info" notifMessage={'Approved'} dismissible={false} />
                  ) : null}
                  {overtimeDetails.status === OvertimeStatus.DISAPPROVED ? (
                    <AlertNotification alertType="warning" notifMessage={'Disapproved'} dismissible={false} />
                  ) : null}

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Overtime Date:</label>

                      <div className="w-full md:w-96 ">
                        <label className="text-slate-500 w-full text-md ">{overtimeDetails.plannedDate}</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Estimated Hours:</label>

                      <div className="w-full md:w-96 ">
                        <label className="text-slate-500 w-full text-md ">{overtimeDetails.estimatedHours}</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Employees:</label>

                      <div className="w-full ">
                        <label className="text-slate-500 w-full text-md flex flex-col">
                          {overtimeDetails?.employees?.map((employee: EmployeeOvertimeDetail, index: number) => {
                            return (
                              <div
                                key={index}
                                className={`${
                                  index != 0 ? 'border-t border-slate-200' : ''
                                } p-2 md:p-4 flex flex-row justify-between items-center gap-8 `}
                              >
                                <img
                                  className="rounded-full border border-stone-100 shadow w-20"
                                  src={employee?.avatarUrl ?? ''}
                                  alt={'photo'}
                                ></img>
                                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
                                  <div className="w-full flex flex-row items-center gap-4 text-sm md:text-md">
                                    <label className="w-full">{employee.fullName}</label>
                                    <label className="w-full">{employee.assignment}</label>
                                  </div>

                                  <Button
                                    variant={'primary'}
                                    size={'sm'}
                                    loading={false}
                                    // onClick={(e) => setAccomplishmentOvertimeModalIsOpen(true)}
                                    type="submit"
                                  >
                                    View Accomplishment
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Purpose:</label>
                    </div>
                    <textarea
                      disabled
                      rows={2}
                      className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                      value={overtimeDetails.purpose}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button
              variant={'primary'}
              size={'md'}
              loading={false}
              // onClick={(e) => setCancelOvertimeModalIsOpen(true)}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeModal;
