/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import CancelOvertimeModal from './CancelOvertimeModal';
import { EmployeeOvertimeDetail } from 'libs/utils/src/lib/types/overtime.type';
import { OvertimeAccomplishmentStatus, OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import OvertimeSupervisorAccomplishmentModal from './OvertimeSupervisorAccomplishmentModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import UseRenderAccomplishmentSubmitted from 'apps/portal/src/utils/functions/RenderAccomplishmentSubmitted';
import RenderOvertimeAccomplishmentStatus from 'apps/portal/src/utils/functions/RenderOvertimeAccomplishmentStatus';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import OvertimeAuthorizationModal from './OvertimeAuthorizationModal';
import OvertimeSummaryReportPdfModal from './OvertimeSummaryReportPdfModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeDetails,
    cancelOvertimeModalIsOpen,
    accomplishmentOvertimeModalIsOpen,
    pdfOvertimeAuthorizationModalIsOpen,
    setCancelOvertimeModalIsOpen,
    setAccomplishmentOvertimeModalIsOpen,
    setOvertimeAccomplishmentEmployeeId,
    setOvertimeAccomplishmentEmployeeName,
    setOvertimeAccomplishmentApplicationId,
    setPdfOvertimeAuthorizationModalIsOpen,
  } = useOvertimeStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    cancelOvertimeModalIsOpen: state.cancelOvertimeModalIsOpen,
    accomplishmentOvertimeModalIsOpen: state.accomplishmentOvertimeModalIsOpen,
    pdfOvertimeAuthorizationModalIsOpen: state.pdfOvertimeAuthorizationModalIsOpen,
    setCancelOvertimeModalIsOpen: state.setCancelOvertimeModalIsOpen,
    setAccomplishmentOvertimeModalIsOpen: state.setAccomplishmentOvertimeModalIsOpen,
    setOvertimeAccomplishmentEmployeeId: state.setOvertimeAccomplishmentEmployeeId,
    setOvertimeAccomplishmentEmployeeName: state.setOvertimeAccomplishmentEmployeeName,
    setOvertimeAccomplishmentApplicationId: state.setOvertimeAccomplishmentApplicationId,
    setPdfOvertimeAuthorizationModalIsOpen: state.setPdfOvertimeAuthorizationModalIsOpen,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { windowWidth } = UseWindowDimensions();

  const closeCancelOvertimeModal = async () => {
    setCancelOvertimeModalIsOpen(false);
  };

  const closeOvertimeAccomplishmentModal = async () => {
    setAccomplishmentOvertimeModalIsOpen(false);
  };

  const closePdfOvertimeAuthorizationModal = async () => {
    setPdfOvertimeAuthorizationModalIsOpen(false);
  };

  const handleEmployeeAccomplishment = async (employeeId: string, employeeName: string) => {
    setOvertimeAccomplishmentEmployeeId(employeeId);
    setOvertimeAccomplishmentEmployeeName(employeeName);
    setOvertimeAccomplishmentApplicationId(overtimeDetails.id);
    setAccomplishmentOvertimeModalIsOpen(true);
  };

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">
                {overtimeDetails.status === OvertimeStatus.APPROVED ||
                overtimeDetails.status === OvertimeStatus.DISAPPROVED
                  ? 'Completed Overtime Application'
                  : 'Ongoing Overtime Application'}
              </span>
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
          <CancelOvertimeModal
            modalState={cancelOvertimeModalIsOpen}
            setModalState={setCancelOvertimeModalIsOpen}
            closeModalAction={closeCancelOvertimeModal}
          />

          <OvertimeSupervisorAccomplishmentModal
            modalState={accomplishmentOvertimeModalIsOpen}
            setModalState={setAccomplishmentOvertimeModalIsOpen}
            closeModalAction={closeOvertimeAccomplishmentModal}
          />
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
                    <AlertNotification
                      alertType="warning"
                      notifMessage={'For Supervisor Approval'}
                      dismissible={false}
                    />
                  ) : null}

                  {overtimeDetails.status === OvertimeStatus.APPROVED ? (
                    <AlertNotification alertType="info" notifMessage={'Approved'} dismissible={false} />
                  ) : null}

                  {overtimeDetails.status === OvertimeStatus.DISAPPROVED ? (
                    <AlertNotification alertType="error" notifMessage={'Disapproved'} dismissible={false} />
                  ) : null}

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Overtime Date:</label>

                      <div className="w-full md:w-96 ">
                        <label className="text-slate-500 w-full text-md ">
                          {DateFormatter(overtimeDetails.plannedDate, 'MM-DD-YYYY')}
                        </label>
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
                        <div className="text-slate-500 w-full text-md flex flex-col">
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
                                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 text-sm md:text-md">
                                  <label className="w-full">{employee.fullName}</label>
                                  <label className="w-full">{employee.assignment}</label>
                                  {/* <label className="w-full">{employee.positionTitle}</label> */}
                                  {overtimeDetails.status === OvertimeStatus.APPROVED ? (
                                    <>
                                      <label className="w-full whitespace-nowrap">
                                        {UseRenderAccomplishmentSubmitted(
                                          employee.isAccomplishmentSubmitted,
                                          TextSize.TEXT_SM
                                        )}
                                      </label>
                                      <label className="w-full">
                                        {RenderOvertimeAccomplishmentStatus(
                                          employee.accomplishmentStatus,
                                          TextSize.TEXT_SM
                                        )}
                                      </label>
                                    </>
                                  ) : null}

                                  {overtimeDetails.status === OvertimeStatus.APPROVED ? (
                                    <Button
                                      variant={'primary'}
                                      disabled={employee.isAccomplishmentSubmitted == true ? false : true}
                                      size={'sm'}
                                      loading={true}
                                      onClick={(e) =>
                                        handleEmployeeAccomplishment(employee.employeeId, employee.fullName)
                                      }
                                      type="button"
                                    >
                                      Accomplishment
                                    </Button>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
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
          <OvertimeAuthorizationModal
            modalState={pdfOvertimeAuthorizationModalIsOpen}
            setModalState={setPdfOvertimeAuthorizationModalIsOpen}
            closeModalAction={closePdfOvertimeAuthorizationModal}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            {overtimeDetails.status === OvertimeStatus.APPROVED ||
            overtimeDetails.status === OvertimeStatus.DISAPPROVED ? (
              <>
                {overtimeDetails.status === OvertimeStatus.APPROVED ? (
                  <>
                    <Button
                      variant={'primary'}
                      size={'md'}
                      loading={false}
                      onClick={(e) => setPdfOvertimeAuthorizationModalIsOpen(true)}
                      type="submit"
                    >
                      Authorization
                    </Button>
                  </>
                ) : null}
                <Button
                  variant={'primary'}
                  size={'md'}
                  loading={false}
                  onClick={(e) => closeModalAction()}
                  type="submit"
                >
                  Close
                </Button>
              </>
            ) : (
              <Button
                variant={'warning'}
                size={'md'}
                loading={false}
                onClick={(e) => setCancelOvertimeModalIsOpen(true)}
                type="submit"
              >
                Cancel Overtime
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeModal;
