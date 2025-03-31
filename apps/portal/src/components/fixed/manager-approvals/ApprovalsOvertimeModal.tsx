/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, CaptchaModal, Checkbox, LoadingSpinner, Modal, OtpModal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { OvertimeAccomplishmentStatus, OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useApprovalStore } from 'apps/portal/src/store/approvals.store';
import { EmployeeOvertimeDetail, OvertimeAccomplishmentApprovalPatch } from 'libs/utils/src/lib/types/overtime.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { overtimeAction } from 'apps/portal/src/types/approvals.type';
import { useEffect, useState } from 'react';
import { ManagerConfirmationApproval, ManagerOtpApproval } from 'libs/utils/src/lib/enums/approval.enum';
import { ConfirmationApprovalModal } from './ApprovalOtp/ConfirmationApprovalModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import ApprovalAccomplishmentModal from './ApprovalAccomplishmentModal';
import RenderOvertimeAccomplishmentStatus from 'apps/portal/src/utils/functions/RenderOvertimeAccomplishmentStatus';
import UseRenderAccomplishmentSubmitted from 'apps/portal/src/utils/functions/RenderAccomplishmentSubmitted';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { RemoveEmployeeModal } from './RemoveEmployeeModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: `${OvertimeStatus.APPROVED}` },
  { label: 'Disapprove', value: `${OvertimeStatus.DISAPPROVED}` },
];

export const OvertimeModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    approvedOvertimeModalIsOpen,
    disapprovedOvertimeModalIsOpen,
    pendingOvertimeModalIsOpen,
    overtimeDetails,

    confirmApplicationModalIsOpen,
    setConfirmApplicationModalIsOpen,
    overtimeAccomplishmentModalIsOpen,
    setOvertimeAccomplishmentModalIsOpen,
    overtimeAccomplishmentEmployeeId,
    setOvertimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId,
    setOvertimeAccomplishmentApplicationId,
    setOvertimeAccomplishmentEmployeeName,
    selectedOvertimeId,
    getOvertimeDetails,
    getOvertimeDetailsSuccess,
    getOvertimeDetailsFail,
    emptyResponseAndError,
    patchResponseAccomplishment,
    approveAllAccomplishmentModalIsOpen,
    setApproveAllAccomplishmentModalIsOpen,
    overtimeAccomplishmentEmployeeName,
    removeEmployeeModalIsOpen,
    setRemoveEmployeeModalIsOpen,
  } = useApprovalStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    approvedOvertimeModalIsOpen: state.approvedOvertimeModalIsOpen,
    disapprovedOvertimeModalIsOpen: state.disapprovedOvertimeModalIsOpen,
    pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
    confirmApplicationModalIsOpen: state.confirmApplicationModalIsOpen,
    setConfirmApplicationModalIsOpen: state.setConfirmApplicationModalIsOpen,
    overtimeAccomplishmentModalIsOpen: state.overtimeAccomplishmentModalIsOpen,
    setOvertimeAccomplishmentModalIsOpen: state.setOvertimeAccomplishmentModalIsOpen,
    overtimeAccomplishmentEmployeeId: state.overtimeAccomplishmentEmployeeId,
    setOvertimeAccomplishmentEmployeeId: state.setOvertimeAccomplishmentEmployeeId,
    overtimeAccomplishmentApplicationId: state.overtimeAccomplishmentApplicationId,
    setOvertimeAccomplishmentApplicationId: state.setOvertimeAccomplishmentApplicationId,
    setOvertimeAccomplishmentEmployeeName: state.setOvertimeAccomplishmentEmployeeName,
    selectedOvertimeId: state.selectedOvertimeId,
    getOvertimeDetails: state.getOvertimeDetails,
    getOvertimeDetailsSuccess: state.getOvertimeDetailsSuccess,
    getOvertimeDetailsFail: state.getOvertimeDetailsFail,
    emptyResponseAndError: state.emptyResponseAndError,
    patchResponseAccomplishment: state.response.patchResponseAccomplishment,
    approveAllAccomplishmentModalIsOpen: state.approveAllAccomplishmentModalIsOpen,
    setApproveAllAccomplishmentModalIsOpen: state.setApproveAllAccomplishmentModalIsOpen,
    overtimeAccomplishmentEmployeeName: state.overtimeAccomplishmentEmployeeName,
    removeEmployeeModalIsOpen: state.removeEmployeeModalIsOpen,
    setRemoveEmployeeModalIsOpen: state.setRemoveEmployeeModalIsOpen,
  }));
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [reason, setReason] = useState<string>('');
  const [approveAllAccomplishmentData, setApproveAllAccomplishmentData] =
    useState<OvertimeAccomplishmentApprovalPatch>();
  const [pendingAccomplishmentEmployees, setPendingAccomplishmentEmployees] = useState<Array<string>>([]);
  const [canStillRemoveEmployee, setCanStillRemoveEmployee] = useState<boolean>(true);
  const [actualHours, setActualHours] = useState<number>(0);
  const [finalEmployeeList, setFinalEmployeeList] = useState<Array<EmployeeOvertimeDetail>>([]);

  const overtimeDetailsUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${employeeDetails.employmentDetails.userId}/approval/${selectedOvertimeId}`;

  const {
    data: swrOvertimeDetails,
    isLoading: swrOvertimeDetailsIsLoading,
    error: swrOvertimeDetailsError,
    mutate: mutateOvertimeDetailsUrl,
  } = useSWR(
    (approvedOvertimeModalIsOpen || disapprovedOvertimeModalIsOpen || pendingOvertimeModalIsOpen) &&
      selectedOvertimeId &&
      employeeDetails.employmentDetails.userId
      ? overtimeDetailsUrl
      : null,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
    }
  );

  //check if OT is cancellable
  const checkIfCancellable = (employees: Array<EmployeeOvertimeDetail>) => {
    const tempEmployees = employees?.filter(
      (employee) =>
        employee.accomplishmentStatus === OvertimeAccomplishmentStatus.PENDING ||
        employee.accomplishmentStatus === OvertimeAccomplishmentStatus.APPROVED
    );
    if (tempEmployees?.length >= 2) {
      setCanStillRemoveEmployee(true);
    } else {
      setCanStillRemoveEmployee(false);
    }
  };

  // Initial zustand state update
  useEffect(() => {
    if (overtimeDetails) {
      setPendingAccomplishmentEmployees(Array.from(new Set([])));
      let employeeIdList = [];
      for (let i = 0; i < overtimeDetails?.employees?.length; i++) {
        if (
          overtimeDetails?.employees[i]?.isAccomplishmentSubmitted == true &&
          overtimeDetails?.employees[i]?.accomplishmentStatus === OvertimeAccomplishmentStatus.PENDING
        ) {
          employeeIdList.push(overtimeDetails?.employees[i]?.employeeId);
        }
      }
      setPendingAccomplishmentEmployees(employeeIdList);
    }

    checkIfCancellable(overtimeDetails?.employees);
  }, [overtimeDetails]);

  useEffect(() => {
    setApproveAllAccomplishmentData({
      employeeIds: pendingAccomplishmentEmployees,
      overtimeApplicationId: overtimeDetails.id,
      status: OvertimeAccomplishmentStatus.APPROVED,
      actualHrs: actualHours,
      approvedBy: employeeDetails.employmentDetails.userId,
    });
  }, [actualHours]);

  useEffect(() => {
    setActualHours(0);
  }, [modalState]);

  const handleEmployeeList = async (selectedEmployee: EmployeeOvertimeDetail) => {
    const filteredEmployee = finalEmployeeList.filter(
      (employee) => employee.employeeId === selectedEmployee.employeeId
    );

    if (filteredEmployee.length > 0) {
      //if selected employee is still in final employee list, remove it from array
      setFinalEmployeeList(finalEmployeeList.filter((employee) => employee.employeeId !== selectedEmployee.employeeId));
    } else {
      //if selected employee is not found in final employee list, add it from array
      setFinalEmployeeList([...finalEmployeeList, selectedEmployee]);
      // finalEmployeeList.push(selectedEmployee);
    }
  };
  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeDetailsIsLoading) {
      getOvertimeDetails(swrOvertimeDetailsIsLoading);
    }
  }, [swrOvertimeDetailsIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeDetails)) {
      getOvertimeDetailsSuccess(swrOvertimeDetailsIsLoading, swrOvertimeDetails);
    }

    if (!isEmpty(swrOvertimeDetailsError)) {
      getOvertimeDetailsFail(swrOvertimeDetailsIsLoading, swrOvertimeDetailsError.message);
    }
  }, [swrOvertimeDetails, swrOvertimeDetailsError]);

  useEffect(() => {
    if (!isEmpty(patchResponseAccomplishment)) {
      mutateOvertimeDetailsUrl();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [patchResponseAccomplishment]);

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<overtimeAction>({
    mode: 'onChange',
    defaultValues: {
      status: null,
    },
  });

  // close Confirm Application Modal
  const closeConfirmModal = async () => {
    setConfirmApplicationModalIsOpen(false);
    setApproveAllAccomplishmentModalIsOpen(false);
    setRemoveEmployeeModalIsOpen(false);
  };

  const closeAccomplishmentModal = async () => {
    setOvertimeAccomplishmentModalIsOpen(false);
  };

  const handleEmployeeAccomplishment = async (employeeId: string, employeeName: string) => {
    setOvertimeAccomplishmentEmployeeId(employeeId);
    setOvertimeAccomplishmentEmployeeName(employeeName);
    setOvertimeAccomplishmentApplicationId(overtimeDetails.id);
    setOvertimeAccomplishmentModalIsOpen(true);
  };

  const onSubmit: SubmitHandler<overtimeAction> = (data: overtimeAction) => {
    if (data.status === OvertimeStatus.APPROVED) {
      setConfirmApplicationModalIsOpen(true);
    } else {
      setConfirmApplicationModalIsOpen(true);
    }
  };

  useEffect(() => {
    reset();
  }, [pendingOvertimeModalIsOpen]);

  const handleRemoveEmployee = (employeeId: string, employeeName: string) => {
    setOvertimeAccomplishmentEmployeeId(employeeId);
    setOvertimeAccomplishmentEmployeeName(employeeName);
    setOvertimeAccomplishmentApplicationId(overtimeDetails.id);
    setRemoveEmployeeModalIsOpen(true);
  };

  // Prevent value inside input from changing on mouse scroll
  const numberInputOnWheelPreventChange = (e) => {
    // Prevent the input value change
    e.target.blur();

    // Prevent the page/container scrolling
    e.stopPropagation();

    // Refocus immediately, on the next tick (after the current function is done)
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal
        size={`${windowWidth > 1330 ? 'lg' : windowWidth > 1024 ? 'lg' : 'full'}`}
        open={modalState}
        setOpen={setModalState}
      >
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
          {/* Remove Employee in OT Modal */}
          <RemoveEmployeeModal
            modalState={removeEmployeeModalIsOpen}
            name={overtimeAccomplishmentEmployeeName}
            employeeId={overtimeAccomplishmentEmployeeId}
            setModalState={setRemoveEmployeeModalIsOpen}
            closeModalAction={closeConfirmModal}
          />

          {!swrOvertimeDetails ? (
            <div className="w-full h-[90%]  static flex flex-col justify-center items-center place-items-center">
              <LoadingSpinner size={'lg'} />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col  ">
              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-0 px-4 rounded">
                  <div className="w-full flex flex-col gap-0">
                    <AlertNotification
                      alertType={
                        overtimeDetails.status === OvertimeStatus.PENDING
                          ? 'warning'
                          : overtimeDetails.status === OvertimeStatus.APPROVED
                          ? 'success'
                          : overtimeDetails.status === OvertimeStatus.DISAPPROVED
                          ? 'error'
                          : overtimeDetails.status === OvertimeStatus.CANCELLED
                          ? 'error'
                          : 'info'
                      }
                      notifMessage={
                        overtimeDetails.status === OvertimeStatus.PENDING
                          ? 'For Supervisor Review'
                          : overtimeDetails.status === OvertimeStatus.APPROVED
                          ? 'Approved'
                          : overtimeDetails.status === OvertimeStatus.DISAPPROVED
                          ? 'Disapproved'
                          : overtimeDetails.status === OvertimeStatus.CANCELLED
                          ? 'Cancelled'
                          : overtimeDetails.status
                      }
                      dismissible={false}
                    />

                    {pendingAccomplishmentEmployees.length > 0 ? (
                      <AlertNotification
                        alertType={'warning'}
                        notifMessage={
                          'Approving All Accomplishments will approve only the submitted and pending Overtime Accomplishments.'
                        }
                        dismissible={false}
                      />
                    ) : null}
                  </div>

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

                    <div className={`flex flex-col justify-start items-start w-full  px-0.5 pb-3`}>
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Purpose:</label>

                      <div className="w-auto ml-5 mr-5">
                        <label className="text-md font-medium">{overtimeDetails.purpose}</label>
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                      <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Requested By:</label>

                      <div className="w-auto ml-5">
                        <label className="text-md font-medium">{overtimeDetails.immediateSupervisorName}</label>
                      </div>
                    </div>

                    {overtimeDetails.status === OvertimeStatus.APPROVED ||
                    overtimeDetails.status === OvertimeStatus.DISAPPROVED ? (
                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
                        <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">
                          {overtimeDetails.status === OvertimeStatus.APPROVED
                            ? 'Approved By:'
                            : overtimeDetails.status === OvertimeStatus.DISAPPROVED
                            ? 'Disapproved By:'
                            : 'Approved By:'}
                        </label>

                        <div className="w-auto ml-5">
                          <label className="text-md font-medium">{overtimeDetails.approvedBy ?? '---'}</label>
                        </div>
                      </div>
                    ) : null}

                    {overtimeDetails.status === OvertimeStatus.DISAPPROVED ? (
                      <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
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

                      <div className="text-slate-500 w-full text-md flex flex-col">
                        {overtimeDetails.employees?.map((employee: EmployeeOvertimeDetail, index: number) => {
                          return (
                            <div
                              key={employee.companyId}
                              className={`${index != 0 ? 'border-t border-slate-200' : ''} ${
                                employee.accomplishmentStatus === OvertimeAccomplishmentStatus.REMOVED_BY_MANAGER ||
                                employee.accomplishmentStatus === OvertimeAccomplishmentStatus.REMOVED_BY_SUPERVISOR
                                  ? 'opacity-40'
                                  : ''
                              } px-2 py-4 md:px-4 md:py-4 flex flex-row justify-between items-center gap-8 `}
                            >
                              <img
                                className={`rounded-full border border-stone-100 shadow w-16 ${
                                  overtimeDetails.status === OvertimeStatus.PENDING &&
                                  (finalEmployeeList?.filter((e) => e.employeeId === employee.employeeId).length <= 0
                                    ? ''
                                    : '')
                                }`}
                                src={
                                  employee?.avatarUrl
                                    ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + employee?.avatarUrl
                                    : '/'
                                }
                                alt={'photo'}
                              ></img>
                              <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 text-sm md:text-md">
                                <label
                                  className={`w-full ${
                                    overtimeDetails.status === OvertimeStatus.PENDING &&
                                    (finalEmployeeList?.filter((e) => e.employeeId === employee.employeeId).length <= 0
                                      ? ''
                                      : '')
                                  }`}
                                >
                                  {employee.fullName}
                                </label>
                                <label
                                  className={`w-full ${
                                    overtimeDetails.status === OvertimeStatus.PENDING &&
                                    (finalEmployeeList?.filter((e) => e.employeeId === employee.employeeId).length <= 0
                                      ? ''
                                      : '')
                                  }`}
                                >
                                  {employee.positionTitle}
                                </label>
                                {/* <label className="w-full">{employee.assignment}</label> */}
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

                                {employee.encodedHours ? (
                                  <div className="flex flex-col">
                                    <label className={`w-full`}>
                                      {Math.trunc(employee.encodedHours * 100) / 100} Hours
                                    </label>
                                    <label className={`w-full`}>Rendered</label>
                                  </div>
                                ) : (
                                  <div className="flex flex-col">
                                    <label className={`w-full`}>0 Hours</label>
                                    <label className={`w-full`}>Rendered</label>
                                  </div>
                                )}

                                {overtimeDetails.status === OvertimeStatus.APPROVED ? (
                                  <Button
                                    disabled={employee.isAccomplishmentSubmitted == true ? false : true}
                                    variant={'primary'}
                                    size={'sm'}
                                    loading={false}
                                    onClick={(e) =>
                                      handleEmployeeAccomplishment(employee.employeeId, employee.fullName)
                                    }
                                  >
                                    Accomplishment
                                  </Button>
                                ) : null}

                                {canStillRemoveEmployee ? (
                                  overtimeDetails.status !== OvertimeStatus.CANCELLED ? (
                                    employee.accomplishmentStatus === OvertimeAccomplishmentStatus.APPROVED ||
                                    employee.accomplishmentStatus === OvertimeAccomplishmentStatus.REMOVED_BY_MANAGER ||
                                    employee.accomplishmentStatus ===
                                      OvertimeAccomplishmentStatus.REMOVED_BY_SUPERVISOR ? (
                                      <Button
                                        variant={'default'}
                                        size={'sm'}
                                        loading={true}
                                        type="button"
                                        className="opacity-0 cursor-default"
                                      >
                                        X
                                      </Button>
                                    ) : (
                                      <Button
                                        variant={'danger'}
                                        size={'sm'}
                                        loading={true}
                                        onClick={(e) =>
                                          overtimeDetails?.employees.length === 1
                                            ? setRemoveEmployeeModalIsOpen(true)
                                            : handleRemoveEmployee(employee.employeeId, employee.fullName)
                                        }
                                        type="button"
                                      >
                                        X
                                      </Button>
                                    )
                                  ) : null
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {overtimeDetails.status === OvertimeStatus.PENDING ? (
                    <form id="OvertimeAction" onSubmit={handleSubmit(onSubmit)}>
                      <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-end items-start md:items-center">
                        <span className="text-slate-500 text-md font-medium">Action:</span>

                        <select
                          id="action"
                          className="text-slate-500 h-12 w-42 rounded-md text-md border-slate-300"
                          required
                          {...register('status')}
                        >
                          <option value="" disabled>
                            Select Action
                          </option>
                          {approvalAction.map((item: SelectOption, idx: number) => (
                            <option value={item.value} key={idx}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {watch('status') === OvertimeStatus.DISAPPROVED ? (
                        <textarea
                          required={true}
                          className={'resize-none mt-3 w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                          placeholder="Enter Reason"
                          rows={3}
                          onChange={(e) => setReason(e.target.value as unknown as string)}
                        ></textarea>
                      ) : null}
                    </form>
                  ) : null}

                  {overtimeDetails.status === OvertimeStatus.APPROVED && pendingAccomplishmentEmployees.length > 0 ? (
                    <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-end items-start md:items-center pb-3">
                      <span className="text-slate-500 text-md">Approved Hours:</span>

                      <input
                        type="number"
                        onWheel={numberInputOnWheelPreventChange}
                        className="border-slate-300 text-slate-500 h-12 text-md w-full md:w-44 rounded-lg"
                        placeholder="Enter number of hours"
                        required
                        value={actualHours}
                        max="24"
                        step={0.01}
                        min="0"
                        onChange={(e) => setActualHours(e.target.value as unknown as number)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          <ConfirmationApprovalModal
            modalState={confirmApplicationModalIsOpen}
            setModalState={setConfirmApplicationModalIsOpen}
            closeModalAction={closeConfirmModal}
            actionOvertime={watch('status')}
            tokenId={overtimeDetails.id}
            remarks={reason}
            confirmName={ManagerConfirmationApproval.OVERTIME}
            employeeId={employeeDetails.user._id}
          />

          <ConfirmationApprovalModal
            modalState={approveAllAccomplishmentModalIsOpen}
            setModalState={setApproveAllAccomplishmentModalIsOpen}
            closeModalAction={closeConfirmModal}
            dataToSubmitApproveAllAccomplishment={approveAllAccomplishmentData}
            employeeListForApproveAllAccomplishment={overtimeDetails.employees}
            tokenId={overtimeDetails.id}
            confirmName={ManagerConfirmationApproval.ALL_OVERTIME_ACCOMPLISHMENT}
            employeeId={employeeDetails.user._id}
          />

          <ApprovalAccomplishmentModal
            modalState={overtimeAccomplishmentModalIsOpen}
            setModalState={setOvertimeAccomplishmentModalIsOpen}
            closeModalAction={closeAccomplishmentModal}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            {overtimeDetails.status === OvertimeStatus.PENDING ? (
              <Button variant={'primary'} size={'md'} loading={false} form={`OvertimeAction`} type="submit">
                Submit
              </Button>
            ) : overtimeDetails.status === OvertimeStatus.APPROVED ? (
              <>
                {overtimeDetails.status === OvertimeStatus.APPROVED && pendingAccomplishmentEmployees.length > 0 ? (
                  <Button
                    variant={'primary'}
                    size={'md'}
                    loading={false}
                    onClick={(e) => setApproveAllAccomplishmentModalIsOpen(true)}
                    type="submit"
                    disabled={
                      pendingAccomplishmentEmployees.length > 0 && actualHours > 0 && actualHours ? false : true
                    }
                  >
                    Approve All Accomplishments
                  </Button>
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
              <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
                Close
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeModal;
