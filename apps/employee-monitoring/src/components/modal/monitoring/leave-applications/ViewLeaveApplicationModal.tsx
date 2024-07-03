/* eslint-disable @nx/enforce-module-boundaries */
import { Alert, AlertNotification, Modal, PageContentContext } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { EmployeeLeaveDetails, MonitoringLeave } from 'libs/utils/src/lib/types/leave-application.type';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { LabelValue } from '../../../labels/LabelValue';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { SelectListRF } from '../../../inputs/SelectListRF';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { useLeaveApplicationStore } from 'apps/employee-monitoring/src/store/leave-application.store';
import { isEmpty } from 'lodash';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import UseRenderLeaveStatus from 'apps/employee-monitoring/src/utils/functions/RenderLeaveStatus';
import { LeaveType } from 'libs/utils/src/lib/types/leave-benefits.type';
import UseRenderBadgePill from 'apps/employee-monitoring/src/utils/functions/RenderBadgePill';
import LeaveApplicationConfirmModal from './LeaveApplicationConfirmModal';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { useLeaveLedgerStore } from 'apps/employee-monitoring/src/store/leave-ledger.store';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';

type ViewLeaveApplicationModalProps = {
  rowData: MonitoringLeave;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

enum Action {
  APPROVE = 'approve',
  DISAPPROVE = 'disapprove',
}

type LeaveForm = EmployeeLeaveDetails & {
  action: Action | null;
  accumulatedCredits: number | null;
};

const actionTaken: Array<SelectOption> = [
  { label: 'Approve', value: 'approve' },
  { label: 'Disapprove', value: 'disapprove' },
];

const ViewLeaveApplicationModal: FunctionComponent<ViewLeaveApplicationModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // use context
  const {
    aside: { windowWidth },
  } = useContext(PageContentContext);

  // leave application store
  const {
    leaveConfirmAction,
    setLeaveConfirmAction,

    patchLeaveApplication,
    patchLeaveApplicationFail,
    patchLeaveApplicationSuccess,

    leaveApplicationDetails,
    getLeaveApplicationDetails,
    getLeaveApplicationDetailsFail,
    getLeaveApplicationDetailsSuccess,
  } = useLeaveApplicationStore((state) => ({
    leaveConfirmAction: state.leaveConfirmAction,
    setLeaveConfirmAction: state.setLeaveConfirmAction,

    patchLeaveApplication: state.patchLeaveApplication,
    patchLeaveApplicationSuccess: state.patchLeaveApplicationSuccess,
    patchLeaveApplicationFail: state.patchLeaveApplicationFail,

    leaveApplicationDetails: state.leaveApplicationDetails,
    getLeaveApplicationDetails: state.getLeaveApplicationDetails,
    getLeaveApplicationDetailsSuccess: state.getLeaveApplicationDetailsSuccess,
    getLeaveApplicationDetailsFail: state.getLeaveApplicationDetailsFail,
  }));

  // leave ledger store
  const { leaveLedger, setLeaveLedger, selectedLeaveLedger, setSelectedLeaveLedger } = useLeaveLedgerStore((state) => ({
    leaveLedger: state.leaveLedger,
    setLeaveLedger: state.setLeaveLedger,
    selectedLeaveLedger: state.selectedLeaveLedger,
    setSelectedLeaveLedger: state.setSelectedLeaveLedger,
  }));

  // fetch leave details
  const {
    data: swrLeaveDetails,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(
    modalState ? `/leave-application/details/${rowData.employee?.employeeId}/${rowData.id}` : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // fetch leave ledger
  const { data: swrLeaveLedger, error: swrLedgerError } = useSWR(
    modalState && !isEmpty(leaveApplicationDetails)
      ? `/leave/ledger/${rowData.employee?.employeeId}/${leaveApplicationDetails.employeeDetails?.companyId}`
      : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // confirm modal
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState<boolean>(false);

  // action to be sent to the modal
  const [confirmAction, setConfirmAction] = useState<Action | null>(null);

  // use form
  const { register, getValues, watch, reset, setValue, handleSubmit } = useForm<LeaveForm>({
    defaultValues: {
      action: null,
      accumulatedCredits: parseInt(leaveApplicationDetails.leaveApplicationBasicInfo?.debitValue) ?? null,
    },
  });

  // on submit
  const onSubmit = async () => {
    const data = {
      id: rowData.id,
      status:
        leaveApplicationDetails.leaveApplicationBasicInfo.leaveType === LeaveType.CUMULATIVE ||
        leaveApplicationDetails.leaveApplicationBasicInfo.leaveType === LeaveType.RECURRING ||
        leaveApplicationDetails.leaveApplicationBasicInfo.leaveType === null
          ? LeaveStatus.FOR_SUPERVISOR_APPROVAL
          : leaveApplicationDetails.leaveApplicationBasicInfo.leaveType === LeaveType.SPECIAL
          ? getValues('action') === Action.APPROVE
            ? LeaveStatus.FOR_SUPERVISOR_APPROVAL
            : getValues('action') === Action.DISAPPROVE && LeaveStatus.DISAPPROVED_BY_HRMO
          : null,
    };

    // call the function to start loading
    patchLeaveApplication();

    // call the patch function
    await handlePatchLeaveApplication(data);
  };

  // function for patching the leave application
  const handlePatchLeaveApplication = async (data: { id: string; status: LeaveStatus }) => {
    const { error, result } = await patchEmpMonitoring('leave/hrmo', data);

    if (!error) {
      // patch leave application success
      patchLeaveApplicationSuccess(result);
      closeModalAction();
    } else if (error) {
      // patch leave application fail
      patchLeaveApplicationFail(result);

      // set action to null
      setLeaveConfirmAction(null);
    }
  };

  // open confirm modal and set actions
  const openConfirmModal = (action: Action) => {
    setConfirmAction(action);

    setConfirmModalIsOpen(true);
  };

  // close confirm modal and set actions
  const closeConfirmModal = () => {
    // set the confirm modal to false
    setConfirmModalIsOpen(false);
  };

  // close modal action
  const closeModal = () => {
    closeModalAction();

    // set the confirm modal action to default
    setLeaveConfirmAction(null);
    reset();
  };

  const firstAndLastDate = (dates: Array<string>) => {
    const sortedDates = dates.sort((date1, date2) =>
      dayjs(date1).format('YYYY/MM/DD') > dayjs(date2).format('YYYY/MM/DD')
        ? 1
        : dayjs(date1).format('YYYY/MM/DD') > dayjs(date2).format('YYYY/MM/DD')
        ? -1
        : 0
    );
    return { start: sortedDates[0], end: sortedDates[sortedDates.length - 1] };
  };

  // is loading
  useEffect(() => {
    if (swrIsLoading) {
      getLeaveApplicationDetails();
    }
  }, [swrIsLoading]);

  // success or fail of leave details
  useEffect(() => {
    if (!isEmpty(swrLeaveDetails)) {
      getLeaveApplicationDetailsSuccess(swrLeaveDetails.data);
    }

    if (!isEmpty(swrError)) {
      getLeaveApplicationDetailsFail(swrError.message);
    }
  }, [swrLeaveDetails, swrError]);

  // success of leave ledger
  useEffect(() => {
    if (!isEmpty(swrLeaveLedger)) {
      setSelectedLeaveLedger(swrLeaveLedger.data, rowData.id);

      setLeaveLedger(swrLeaveLedger.data);
    }
  }, [swrLeaveLedger]);

  useEffect(() => {
    if (leaveConfirmAction === 'yes') {
      onSubmit();
    }
  }, [leaveConfirmAction, confirmModalIsOpen]);

  return (
    <>
      <LeaveApplicationConfirmModal
        modalState={confirmModalIsOpen}
        setModalState={setConfirmModalIsOpen}
        closeModalAction={closeConfirmModal}
        action={confirmAction}
      />

      <Modal
        open={modalState}
        setOpen={setModalState}
        size={
          windowWidth > 1024 && windowWidth < 1280
            ? 'lg'
            : windowWidth >= 1280 && windowWidth < 1536
            ? 'md'
            : windowWidth >= 1536
            ? 'md'
            : 'full'
        }
        steady
      >
        <Modal.Header withCloseBtn>
          <div className="flex justify-between text-2xl font-semibold text-black">
            <span className="px-5">Leave Application | {rowData.referenceNo}</span>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModal}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          {/* Alert notif if leave application is late filing */}
          {rowData.isLateFiling ? (
            <AlertNotification alertType="warning" notifMessage="Late Filling Application" dismissible={false} />
          ) : null}

          {swrIsLoading ? (
            <Skeleton count={6} enableAnimation />
          ) : (
            <div className="w-full min-h-[14rem]">
              <div className="flex flex-col w-full gap-4 rounded ">
                <div className="flex flex-col gap-4 px-3 rounded ">
                  {/* HEADER */}
                  <div className="flex justify-between w-full px-2 py-1 sm:flex-col md:flex-col lg:flex-row">
                    <section className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {leaveApplicationDetails.employeeDetails?.photoUrl ? (
                          <div className="flex flex-wrap justify-center">
                            <div className="w-[6rem]">
                              <Image
                                src={leaveApplicationDetails.employeeDetails?.photoUrl}
                                width={100}
                                height={100}
                                alt="employee-photo"
                                className="h-auto max-w-full align-middle border-none rounded-full shadow"
                              />
                            </div>
                          </div>
                        ) : (
                          <i className="text-gray-700 text-8xl bx bxs-user"></i>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <div className="text-xl font-semibold">{rowData.employee?.employeeName}</div>
                        <div className="font-light">
                          {leaveApplicationDetails.employeeDetails?.assignment.positionTitle ?? <Skeleton />}
                        </div>
                        <div className="font-semibold ">
                          {leaveApplicationDetails.employeeDetails?.companyId ?? '--'}
                        </div>
                      </div>
                    </section>
                  </div>

                  <hr />

                  <div className="grid grid-cols-2 grid-rows-1 px-3 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue label="Leave Type" direction="top-to-bottom" textSize="md" value={rowData.leaveName} />

                    <LabelValue
                      label="Status"
                      direction="top-to-bottom"
                      textSize="md"
                      value={rowData.status ? UseRenderLeaveStatus(rowData.status, TextSize.TEXT_SM) : ''}
                    />
                  </div>

                  <div className="grid grid-cols-2 grid-rows-1 px-3 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Applied Number of Days"
                      direction="top-to-bottom"
                      textSize="md"
                      value={
                        leaveApplicationDetails.leaveApplicationBasicInfo?.debitValue
                          ? parseInt(leaveApplicationDetails.leaveApplicationBasicInfo?.debitValue)
                          : 0
                      }
                    />

                    <LabelValue
                      label="Applied Leave Dates"
                      direction="top-to-bottom"
                      textSize="md"
                      value={
                        rowData.leaveDates && rowData.leaveDates.length >= 2 ? (
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            {UseRenderBadgePill(firstAndLastDate(rowData.leaveDates).start, 'text-md')}
                            <div>to</div>
                            {UseRenderBadgePill(firstAndLastDate(rowData.leaveDates).end, 'text-md')}
                          </div>
                        ) : rowData.leaveDates && rowData.leaveDates.length === 1 ? (
                          rowData.leaveDates.map((date, idx) => {
                            return (
                              <div className="flex items-center gap-2 text-sm font-semibold" key={idx}>
                                {UseRenderBadgePill(date, 'text-md')}
                              </div>
                            );
                          })
                        ) : (
                          'N/A'
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 grid-rows-1 px-3 sm:gap-2 md:gap:2 lg:gap-0">
                    {/* VACATION LEAVE */}
                    {!isEmpty(leaveApplicationDetails.leaveApplicationDetails?.inPhilippinesOrAbroad) ? (
                      <>
                        <LabelValue
                          label="Leave Details"
                          direction="top-to-bottom"
                          textSize="md"
                          value={leaveApplicationDetails.leaveApplicationDetails?.inPhilippinesOrAbroad}
                        />
                        <LabelValue
                          label="Location"
                          direction="top-to-bottom"
                          textSize="md"
                          value={leaveApplicationDetails.leaveApplicationDetails?.location}
                        />
                      </>
                    ) : null}

                    {/* SICK LEAVE */}
                    {!isEmpty(leaveApplicationDetails.leaveApplicationDetails?.hospital) ? (
                      <>
                        <LabelValue
                          label="Leave Details"
                          direction="top-to-bottom"
                          textSize="md"
                          value={leaveApplicationDetails.leaveApplicationDetails.hospital}
                        />
                        <LabelValue
                          label="Illness"
                          direction="top-to-bottom"
                          textSize="md"
                          value={leaveApplicationDetails.leaveApplicationDetails?.illness ?? 'N/A'}
                        />
                      </>
                    ) : null}

                    {/* SPL WOMEN */}
                    {leaveApplicationDetails.leaveApplicationDetails?.splWomen ? (
                      <LabelValue
                        label="Leave Details"
                        direction="top-to-bottom"
                        textSize="md"
                        value={leaveApplicationDetails.leaveApplicationDetails.splWomen}
                      />
                    ) : null}

                    {/* STUDY LEAVE */}
                    {!isEmpty(leaveApplicationDetails.leaveApplicationDetails?.forBarBoardReview) ||
                    !isEmpty(leaveApplicationDetails.leaveApplicationDetails?.forMastersCompletion) ? (
                      <>
                        {leaveApplicationDetails.leaveApplicationDetails?.forBarBoardReview && (
                          <LabelValue
                            label="Leave Details"
                            direction="top-to-bottom"
                            textSize="md"
                            value={
                              parseInt(leaveApplicationDetails.leaveApplicationDetails?.forBarBoardReview) === 1
                                ? 'For Board Review'
                                : parseInt(leaveApplicationDetails.leaveApplicationDetails?.forMastersCompletion) === 1
                                ? 'For Masters Completion'
                                : ''
                            }
                          />
                        )}
                        <LabelValue
                          label="Purpose"
                          direction="top-to-bottom"
                          textSize="md"
                          value={leaveApplicationDetails.leaveApplicationDetails?.studyLeaveOther ?? 'N/A'}
                        />
                      </>
                    ) : null}
                  </div>

                  <hr />

                  <div className="grid grid-cols-2 grid-rows-1 px-3 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Supervisor Name"
                      direction="top-to-bottom"
                      textSize="md"
                      value={rowData.supervisor?.supervisorName}
                    />
                    <LabelValue
                      label="Assignment"
                      direction="top-to-bottom"
                      textSize="md"
                      value={leaveApplicationDetails.employeeDetails?.assignment?.name ?? ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 grid-rows-1 px-3 sm:gap-2 md:gap:2 lg:gap-0">
                  {leaveApplicationDetails.leaveApplicationBasicInfo?.leaveType === LeaveType.SPECIAL &&
                    leaveApplicationDetails.leaveApplicationBasicInfo.status ===
                      LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION && (
                      <div className="w-full px-2">
                        <LabelValue
                          label={`Maximum Credit Value is ${parseInt(
                            leaveApplicationDetails.leaveApplicationBasicInfo?.maximumCredits.toString()
                          )}`}
                          direction="top-to-bottom"
                          textSize="md"
                          value={parseInt(leaveApplicationDetails.leaveApplicationBasicInfo.debitValue)}
                        />
                      </div>
                    )}

                  {leaveApplicationDetails.leaveApplicationBasicInfo?.leaveType === LeaveType.SPECIAL &&
                    leaveApplicationDetails.leaveApplicationBasicInfo.status ===
                      LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION && (
                      <div className="w-full pr-2">
                        <SelectListRF
                          id="action"
                          textSize="md"
                          selectList={actionTaken}
                          controller={{
                            ...register('action'),
                          }}
                          label="Action"
                        />
                      </div>
                    )}
                </div>

                <hr />

                {/* TRAIL */}
                <div className="grid grid-cols-1 grid-rows-1 px-7 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Date of Filing: "
                    textSize="md"
                    value={DateTimeFormatter(
                      leaveApplicationDetails.leaveApplicationBasicInfo?.dateOfFiling,
                      'MMMM DD, YYYY hh:mm A'
                    )}
                    direction="left-to-right"
                  />
                </div>

                {!isEmpty(leaveApplicationDetails.leaveApplicationBasicInfo?.hrmoApprovalDate) ? (
                  <div className="grid grid-cols-1 grid-rows-1 px-7 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="HRMO Approval Date: "
                      textSize="md"
                      value={DateTimeFormatter(
                        leaveApplicationDetails.leaveApplicationBasicInfo?.hrmoApprovalDate,
                        'MMMM DD, YYYY hh:mm A'
                      )}
                      direction="left-to-right"
                    />
                  </div>
                ) : null}

                {!isEmpty(leaveApplicationDetails.leaveApplicationBasicInfo?.supervisorApprovalDate) ? (
                  <div className="grid grid-cols-1 grid-rows-1 px-7 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Supervisor Approval Date: "
                      textSize="md"
                      value={DateTimeFormatter(
                        leaveApplicationDetails.leaveApplicationBasicInfo?.supervisorApprovalDate,
                        'MMMM DD, YYYY hh:mm A'
                      )}
                      direction="left-to-right"
                    />
                  </div>
                ) : null}

                <hr />

                {/* LEAVE LEDGER TABLE */}
                <div className="grid grid-cols-1 grid-rows-1 px-7 sm:gap-2 md:gap:2 lg:gap-0">
                  {rowData.status !== LeaveStatus.DISAPPROVED_BY_SUPERVISOR &&
                  rowData.status !== LeaveStatus.CANCELLED &&
                  rowData.status !== LeaveStatus.DISAPPROVED_BY_HRDM &&
                  rowData.status !== LeaveStatus.DISAPPROVED_BY_HRMO ? (
                    rowData.leaveName === LeaveName.VACATION ||
                    rowData.leaveName === LeaveName.FORCED ||
                    rowData.leaveName === LeaveName.SICK ||
                    rowData.leaveName === LeaveName.SPECIAL_PRIVILEGE ? (
                      <div className="w-full pb-4">
                        <span className="text-slate-500 text-md">
                          Your {rowData.leaveName} Credits at the time of this application:
                        </span>
                        <table className="mt-2 bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                          <tbody>
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Total Earned</td>
                              <td className="border border-slate-400 text-center">Less this application</td>
                              <td className="border border-slate-400 text-center bg-green-100">Balance</td>
                            </tr>

                            {/* VACATION & FORCED */}
                            {rowData.leaveName === LeaveName.VACATION || rowData.leaveName === LeaveName.FORCED ? (
                              <tr className="border border-slate-400">
                                <td className="border border-slate-400 text-center">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? parseFloat(
                                        `${leaveLedger[leaveLedger.length - 1]?.vacationLeaveBalance}`
                                      ).toFixed(3)
                                    : (
                                        parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) +
                                        parseFloat(`${selectedLeaveLedger[0]?.vacationLeave}`) * -1
                                      ).toFixed(3)}
                                </td>

                                <td className="border border-slate-400 text-center">
                                  {rowData.leaveDates?.length.toFixed(3)}
                                </td>

                                <td className="border border-slate-400 text-center bg-green-100">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? (
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.vacationLeaveBalance}`) -
                                        parseFloat(`${rowData.leaveDates?.length}`)
                                      ).toFixed(3)
                                    : (
                                        parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) -
                                        parseFloat(`${rowData.leaveDates?.length}`)
                                      ).toFixed(3)}
                                </td>
                              </tr>
                            ) : null}

                            {/* {rowData.leaveName === LeaveName.VACATION || rowData.leaveName === LeaveName.FORCED ? (
                              <tr className="border border-slate-400">
                                <td className="border border-slate-400 text-center">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? (
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.vacationLeaveBalance}`) +
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.forcedLeaveBalance}`)
                                      ).toFixed(3)
                                    : (
                                        parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) +
                                        parseFloat(`${selectedLeaveLedger[0]?.vacationLeave}`) * -1 +
                                        parseFloat(`${selectedLeaveLedger[0]?.forcedLeaveBalance}`) +
                                        parseFloat(`${selectedLeaveLedger[0]?.forcedLeave}`) * -1
                                      ).toFixed(3)}
                                </td>
                                <td className="border border-slate-400 text-center">
                                  {rowData.leaveDates?.length.toFixed(3)}
                                </td>
                                <td className="border border-slate-400 text-center bg-green-100">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? (
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.vacationLeaveBalance}`) +
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.forcedLeaveBalance}`) -
                                        parseFloat(`${rowData.leaveDates?.length}`)
                                      ).toFixed(3)
                                    : (
                                        parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`) +
                                        parseFloat(`${selectedLeaveLedger[0]?.forcedLeaveBalance}`)
                                      ).toFixed(3)}
                                </td>
                              </tr>
                            ) : null} */}

                            {/* SICK */}
                            {rowData.leaveName === LeaveName.SICK ? (
                              <tr className="border border-slate-400">
                                <td className="border border-slate-400 text-center">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? Number(
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.sickLeaveBalance}`).toFixed(
                                          3
                                        )
                                      ).toFixed(3)
                                    : (
                                        Number(parseFloat(`${selectedLeaveLedger[0]?.sickLeaveBalance}`).toFixed(3)) +
                                        Number(parseFloat(`${selectedLeaveLedger[0]?.sickLeave}`).toFixed(3)) * -1
                                      ).toFixed(3)}
                                </td>

                                <td className="border border-slate-400 text-center">
                                  {rowData.leaveDates?.length.toFixed(3)}
                                </td>

                                <td className="border border-slate-400 text-center bg-green-100">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? Number(
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.sickLeaveBalance}`).toFixed(
                                          3
                                        )
                                      ) - Number(parseFloat(`${rowData.leaveDates?.length}`).toFixed(3))
                                    : selectedLeaveLedger[0]?.sickLeaveBalance}
                                </td>
                              </tr>
                            ) : null}

                            {/* SPECIAL PRIVILEGE */}
                            {rowData.leaveName === LeaveName.SPECIAL_PRIVILEGE ? (
                              <tr className="border border-slate-400">
                                <td className="border border-slate-400 text-center">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? Number(
                                        parseFloat(
                                          `${leaveLedger[leaveLedger.length - 1]?.specialPrivilegeLeaveBalance}`
                                        ).toFixed(3)
                                      ).toFixed(3)
                                    : (
                                        Number(
                                          parseFloat(`${selectedLeaveLedger[0]?.specialPrivilegeLeaveBalance}`).toFixed(
                                            3
                                          )
                                        ) +
                                        Number(
                                          parseFloat(`${selectedLeaveLedger[0]?.specialPrivilegeLeave}`).toFixed(3)
                                        ) *
                                          -1
                                      ).toFixed(3)}
                                </td>

                                <td className="border border-slate-400 text-center">
                                  {rowData.leaveDates?.length.toFixed(3)}
                                </td>

                                <td className="border border-slate-400 text-center bg-green-100">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? Number(
                                        parseFloat(
                                          `${leaveLedger[leaveLedger.length - 1]?.specialPrivilegeLeaveBalance}`
                                        ).toFixed(3)
                                      ) - Number(parseFloat(`${rowData.leaveDates?.length}`).toFixed(3))
                                    : selectedLeaveLedger[0]?.specialPrivilegeLeaveBalance}
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    ) : null
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

        {leaveApplicationDetails.leaveApplicationBasicInfo?.leaveType === LeaveType.SPECIAL ? (
          <Modal.Footer>
            <div className="flex justify-end w-full gap-2">
              <button
                className="px-3 w-[5rem] py-2 text-sm text-gray-700 bg-gray-50 border rounded"
                onClick={closeModal}
                type="button"
              >
                Close
              </button>
              {leaveApplicationDetails.leaveApplicationBasicInfo?.status ===
                LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION &&
                watch('action') !== null && (
                  <button
                    className="px-3 w-[5rem] py-2 text-sm text-white bg-blue-400 rounded"
                    type="button"
                    onClick={() => openConfirmModal(getValues('action'))}
                  >
                    Submit
                  </button>
                )}
            </div>
          </Modal.Footer>
        ) : (
          <Modal.Footer>
            <div className="flex justify-end w-full gap-2">
              <button
                className="px-3 w-[5rem] py-2 text-sm text-gray-700 bg-gray-50 border rounded"
                onClick={closeModal}
                type="button"
              >
                Close
              </button>
              {leaveApplicationDetails.leaveApplicationBasicInfo?.status ===
                LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION && (
                <button
                  className="px-3 w-[5rem] py-2 text-sm text-white bg-blue-400 rounded"
                  type="button"
                  onClick={() => openConfirmModal(Action.APPROVE)}
                >
                  Certify Credits
                </button>
              )}
            </div>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

export default ViewLeaveApplicationModal;
