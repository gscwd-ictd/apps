/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import CancelOvertimeModal from './CancelOvertimeModal';
import { EmployeeOvertimeDetail } from 'libs/utils/src/lib/types/overtime.type';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import OvertimeSupervisorAccomplishmentModal from './OvertimeSupervisorAccomplishmentModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import UseRenderAccomplishmentSubmitted from 'apps/portal/src/utils/functions/RenderAccomplishmentSubmitted';
import RenderOvertimeAccomplishmentStatus from 'apps/portal/src/utils/functions/RenderOvertimeAccomplishmentStatus';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import OvertimeAuthorizationModal from './OvertimeAuthorizationModal';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { isEmpty } from 'lodash';

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
    overtimeSupervisorName,
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
    overtimeSupervisorName: state.overtime.supervisorName,
    setCancelOvertimeModalIsOpen: state.setCancelOvertimeModalIsOpen,
    setAccomplishmentOvertimeModalIsOpen: state.setAccomplishmentOvertimeModalIsOpen,
    setOvertimeAccomplishmentEmployeeId: state.setOvertimeAccomplishmentEmployeeId,
    setOvertimeAccomplishmentEmployeeName: state.setOvertimeAccomplishmentEmployeeName,
    setOvertimeAccomplishmentApplicationId: state.setOvertimeAccomplishmentApplicationId,
    setPdfOvertimeAuthorizationModalIsOpen: state.setPdfOvertimeAuthorizationModalIsOpen,
  }));

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
      <Modal size={`${windowWidth > 1024 ? 'md' : 'full'}`} open={modalState} setOpen={setModalState}>
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
          {isEmpty(overtimeDetails) ? (
            <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
              <SpinnerDotted
                speed={70}
                thickness={70}
                className="w-full flex h-full transition-all "
                color="slateblue"
                size={100}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col  ">
              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-2 px-4 rounded">
                  {overtimeDetails.status === OvertimeStatus.PENDING ? (
                    <AlertNotification alertType="warning" notifMessage={'For Supervisor Review'} dismissible={false} />
                  ) : null}

                  {overtimeDetails.status === OvertimeStatus.APPROVED ? (
                    <AlertNotification alertType="success" notifMessage={'Approved'} dismissible={false} />
                  ) : null}

                  {overtimeDetails.status === OvertimeStatus.DISAPPROVED ? (
                    <AlertNotification alertType="error" notifMessage={'Disapproved'} dismissible={false} />
                  ) : null}

                  {overtimeDetails.status === OvertimeStatus.CANCELLED ? (
                    <AlertNotification alertType="error" notifMessage={'Cancelled'} dismissible={false} />
                  ) : null}

                  <div className="flex flex-wrap justify-between">
                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Overtime Type:</label>

                      <div className="w-auto ml-5">
                        {overtimeDetails.status === OvertimeStatus.APPROVED ? (
                          <label className="text-md font-medium">
                            {DateFormatter(overtimeDetails.plannedDate, 'MM-DD-YYYY') <=
                            DateFormatter(overtimeDetails.dateApproved, 'MM-DD-YYYY')
                              ? 'Emergency Overtime'
                              : 'Scheduled Overtime'}
                          </label>
                        ) : (
                          <label className="text-md font-medium">N/A</label>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Overtime Date:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">
                          {DateFormatter(overtimeDetails.plannedDate, 'MM-DD-YYYY')}
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Estimated Hours:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">{overtimeDetails.estimatedHours}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">
                        {overtimeDetails.status === OvertimeStatus.APPROVED
                          ? 'Date Approved:'
                          : overtimeDetails.status === OvertimeStatus.DISAPPROVED
                          ? 'Date Disapproved:'
                          : overtimeDetails.status === OvertimeStatus.CANCELLED
                          ? 'Date Cancelled'
                          : 'Date Approved:'}
                      </label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">
                          {overtimeDetails.dateApproved
                            ? DateTimeFormatter(overtimeDetails.dateApproved)
                            : '-- -- ----'}
                        </label>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col justify-start items-start w-full sm:w-1/2
                      px-0.5 pb-3`}
                    >
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Purpose:</label>

                      <div className="w-auto ml-5 mr-5">
                        <label className="text-md font-medium">{overtimeDetails.purpose}</label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3 ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Supervisor:</label>

                      <div className="w-auto ml-5">
                        <label className=" text-md font-medium">{overtimeSupervisorName}</label>
                      </div>
                    </div>

                    {overtimeDetails.status === OvertimeStatus.DISAPPROVED ? (
                      <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Remarks:</label>

                        <div className="w-auto ml-5">
                          <label className="text-md font-medium">{overtimeDetails.remarks}</label>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col justify-between items-start w-full">
                      <label className="text-slate-500 text-md whitespace-nowrap">Employees:</label>

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
                                  className="rounded-full border border-stone-100 shadow w-16"
                                  src={process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + employee?.avatarUrl ?? ''}
                                  alt={'photo'}
                                ></img>
                                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 text-sm md:text-md">
                                  <label className="w-full">{employee.fullName}</label>
                                  <label className="w-full">{employee.assignment}</label>
                                  {/* <label className="w-full">{employee.positionTitle}</label> */}
                                  {overtimeDetails.status === OvertimeStatus.APPROVED ? (
                                    <div className="flex flex-col gap-2">
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
                                    </div>
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
          <div className="flex justify-end gap-2 px-4">
            {overtimeDetails.status === OvertimeStatus.APPROVED ||
            overtimeDetails.status === OvertimeStatus.DISAPPROVED ||
            overtimeDetails.status === OvertimeStatus.CANCELLED ? (
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
                  variant={'default'}
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
