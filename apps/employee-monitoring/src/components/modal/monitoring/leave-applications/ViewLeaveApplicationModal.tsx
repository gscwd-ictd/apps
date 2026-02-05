/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal, PageContentContext } from '@gscwd-apps/oneui';
import { LeaveName, LeaveStatus, MonetizationType } from 'libs/utils/src/lib/enums/leave.enum';
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
import LeaveApplicationConfirmModal from './LeaveApplicationConfirmModal';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { useLeaveLedgerStore } from 'apps/employee-monitoring/src/store/leave-ledger.store';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import { JustificationLetterPdfModal } from './JustificationLetterPdfModal';
import dayjs from 'dayjs';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import { mutate } from 'swr';

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
  // expand leave dates list
  const [moreLeaveDates, setMoreLeaveDates] = useState<boolean>(false);

  // Monetization Entry
  const [vlEntry, setVlEntry] = useState<LeaveLedgerEntry>();
  const [slEntry, setSlEntry] = useState<LeaveLedgerEntry>();

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

  // Get the year from the Date of Filing
  const yearFromDateOfFiling = dayjs(leaveApplicationDetails.leaveApplicationBasicInfo?.dateOfFiling).format('YYYY');

  // fetch leave ledger
  const { data: swrLeaveLedger, error: swrLedgerError } = useSWR(
    modalState && !isEmpty(leaveApplicationDetails)
      ? `/leave/ledger/${rowData.employee?.employeeId}/${leaveApplicationDetails.employeeDetails?.companyId}/${yearFromDateOfFiling}`
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

      // mutate notifications
      mutate((key) => typeof key === 'string' && key.startsWith('/stats/hrmo/dashboard'), undefined, {
        revalidate: true,
      });
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

  // View justification letter modal function
  const [jlDocModalIsOpen, setJlDocModalIsOpen] = useState<boolean>(false);
  const closeJlDocActionModal = () => {
    setJlDocModalIsOpen(false);
  };

  // Search for monetization entries
  const searchMonetizationEntry = (ledger: Array<LeaveLedgerEntry>, refNo: string) => {
    const debitEntries = ledger.filter((ledger) => ledger.remarks.includes(refNo));

    const debitVl = debitEntries.filter((entries) => entries.remarks.includes('VL'));
    setVlEntry(debitVl[0]);

    const debitSl = debitEntries.filter((entries) => entries.remarks.includes('SL'));
    setSlEntry(debitSl[0]);
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

      if (rowData.leaveName === LeaveName.MONETIZATION) {
        searchMonetizationEntry(swrLeaveLedger.data, rowData.referenceNo);
      }
    }
  }, [swrLeaveLedger]);

  useEffect(() => {
    if (leaveConfirmAction === 'yes') {
      onSubmit();
    }
  }, [leaveConfirmAction, confirmModalIsOpen]);

  useEffect(() => {
    if (!modalState) {
      setMoreLeaveDates(false);
    }
  }, [modalState]);

  return (
    <>
      {/* Confirmation Modal */}
      <LeaveApplicationConfirmModal
        modalState={confirmModalIsOpen}
        setModalState={setConfirmModalIsOpen}
        closeModalAction={closeConfirmModal}
        action={confirmAction}
      />

      {/* Justification Letter PDF Modal */}
      <JustificationLetterPdfModal
        leaveDetails={leaveApplicationDetails}
        modalState={jlDocModalIsOpen}
        setModalState={setJlDocModalIsOpen}
        closeModalAction={closeJlDocActionModal}
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
          {leaveApplicationDetails?.leaveApplicationBasicInfo?.isLateFiling === 'true' ? (
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
                                src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}${leaveApplicationDetails.employeeDetails?.photoUrl}`}
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

                  <div className="grid grid-cols-2 grid-rows-1 px-3 gap-3">
                    <LabelValue label="Leave Type" direction="top-to-bottom" textSize="md" value={rowData.leaveName} />

                    <LabelValue
                      label="Status"
                      direction="top-to-bottom"
                      textSize="md"
                      value={rowData.status ? UseRenderLeaveStatus(rowData.status, TextSize.TEXT_SM) : ''}
                    />

                    {/* Leave Dates and Number of Days */}
                    {rowData.leaveName !== LeaveName.MONETIZATION && rowData.leaveName !== LeaveName.TERMINAL ? (
                      <>
                        <LabelValue
                          label="Applied Leave Dates"
                          direction="top-to-bottom"
                          textSize="md"
                          value={
                            rowData.leaveName === LeaveName.MATERNITY ||
                            rowData.leaveName === LeaveName.STUDY ||
                            rowData.leaveName === LeaveName.REHABILITATION ||
                            rowData.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                            rowData.leaveName === LeaveName.ADOPTION ? (
                              // show first and last date (array) only if SBL (maternity, study, rehab...)
                              `${DateFormatter(rowData.leaveDates[0], 'YYYY/MM/DD')} - ${DateFormatter(
                                rowData.leaveDates[rowData.leaveDates?.length - 1],
                                'YYYY/MM/DD'
                              )}`
                            ) : (
                              // show all dates if not SBL (maternity, study, rehab...)
                              <>
                                <ul>
                                  {rowData.leaveDates?.map((dates: string, index: number) => {
                                    if (moreLeaveDates) {
                                      return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                    } else {
                                      if (index <= 1) return <li key={index}>{DateFormatter(dates, 'MM-DD-YYYY')}</li>;
                                    }
                                  })}
                                </ul>
                                {rowData.leaveDates?.length > 2 ? (
                                  <label
                                    className="cursor-pointer text-sm text-indigo-500 hover:text-indigo-600"
                                    onClick={(e) => setMoreLeaveDates(!moreLeaveDates)}
                                  >
                                    {moreLeaveDates ? 'Less...' : 'More...'}
                                  </label>
                                ) : null}
                              </>
                            )
                          }
                        />

                        <LabelValue
                          label="Applied Number of Days"
                          direction="top-to-bottom"
                          textSize="md"
                          value={
                            !isEmpty(leaveApplicationDetails.leaveApplicationBasicInfo?.leaveDates)
                              ? leaveApplicationDetails.leaveApplicationBasicInfo?.leaveDates.length
                              : 0
                          }
                        />
                      </>
                    ) : null}

                    {/* MONETIZATION - Converted Credits and Amount */}
                    {leaveApplicationDetails?.leaveApplicationBasicInfo?.leaveName === LeaveName.MONETIZATION ? (
                      <>
                        <LabelValue
                          label="Type"
                          direction="top-to-bottom"
                          textSize="md"
                          value={
                            leaveApplicationDetails?.leaveApplicationDetails?.monetizationType ===
                            MonetizationType.MAX20
                              ? 'Max 20 Credits'
                              : 'Max 50% of Credits'
                          }
                        />

                        <LabelValue
                          label="Converted Credits"
                          direction="top-to-bottom"
                          textSize="md"
                          value={` VL: ${leaveApplicationDetails?.leaveApplicationDetails?.convertedVl} / SL: ${leaveApplicationDetails?.leaveApplicationDetails?.convertedSl}`}
                        />

                        <LabelValue
                          label="Amount"
                          direction="top-to-bottom"
                          textSize="md"
                          value={leaveApplicationDetails?.leaveApplicationDetails?.monetizedAmount}
                        />
                      </>
                    ) : null}

                    {/* TERMINAL LEAVE - Converted Credits and Amount */}
                    {leaveApplicationDetails?.leaveApplicationBasicInfo?.leaveName === LeaveName.TERMINAL ? (
                      <>
                        <LabelValue
                          label="Converted Credits"
                          direction="top-to-bottom"
                          textSize="md"
                          value={` VL: ${leaveApplicationDetails?.leaveApplicationDetails?.vlBalance.afterTerminalLeave} / SL: ${leaveApplicationDetails?.leaveApplicationDetails?.slBalance.afterTerminalLeave}`}
                        />

                        <LabelValue
                          label="Amount"
                          direction="top-to-bottom"
                          textSize="md"
                          value={leaveApplicationDetails?.leaveApplicationDetails?.monetizedAmount}
                        />
                      </>
                    ) : null}

                    {/* VL OR SPL */}
                    {leaveApplicationDetails?.leaveApplicationBasicInfo?.leaveName === LeaveName.VACATION ||
                    leaveApplicationDetails?.leaveApplicationBasicInfo?.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                    leaveApplicationDetails?.leaveApplicationBasicInfo?.leaveName === LeaveName.FORCED ||
                    leaveApplicationDetails?.leaveApplicationBasicInfo?.leaveName === LeaveName.LEAVE_WITHOUT_PAY ? (
                      <>
                        <LabelValue
                          label="Location"
                          direction="top-to-bottom"
                          textSize="md"
                          value={
                            leaveApplicationDetails.leaveApplicationDetails?.inPhilippinesOrAbroad ||
                            'Within the Philippines'
                          }
                        />
                        <LabelValue
                          label="Specific Details"
                          direction="top-to-bottom"
                          textSize="md"
                          value={leaveApplicationDetails.leaveApplicationDetails?.location || '--'}
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

                  {/* SUPERVISOR AND ASSIGNMENT */}
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

                {/* ANY SPECIAL LEAVE BENEFIT TYPE OF LEAVE AND IS ON PENDING */}
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

                {/* TRAIL OF APPROVAL */}
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

                {!isEmpty(leaveApplicationDetails.leaveApplicationBasicInfo?.hrdmApprovalDate) ? (
                  <>
                    <hr />
                    <div className="grid grid-cols-2 grid-rows-1 px-7 sm:gap-2 md:gap:2 lg:gap-0">
                      <LabelValue
                        label="Manager Name"
                        direction="top-to-bottom"
                        textSize="md"
                        value={leaveApplicationDetails.leaveApplicationBasicInfo?.hrdmApprovedByName ?? ''}
                      />
                      <LabelValue
                        label="HRDM/DivM Approval Date"
                        direction="top-to-bottom"
                        textSize="md"
                        value={DateTimeFormatter(
                          leaveApplicationDetails.leaveApplicationBasicInfo?.hrdmApprovalDate,
                          'MMMM DD, YYYY hh:mm A'
                        )}
                      />
                    </div>
                  </>
                ) : null}

                <hr />

                {!isEmpty(leaveApplicationDetails.leaveApplicationBasicInfo?.supervisorDisapprovalRemarks) ? (
                  <div className="grid grid-cols-1 grid-rows-1 px-7 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Supervisor Remarks:"
                      textSize="md"
                      value={leaveApplicationDetails.leaveApplicationBasicInfo?.supervisorDisapprovalRemarks ?? ''}
                      direction="top-to-bottom"
                    />
                  </div>
                ) : null}

                {/* LEAVE LEDGER TABLE */}
                <div className="grid grid-cols-1 grid-rows-1 px-7 sm:gap-2 md:gap:2 lg:gap-0">
                  {rowData.status !== LeaveStatus.DISAPPROVED_BY_SUPERVISOR &&
                  rowData.status !== LeaveStatus.CANCELLED &&
                  rowData.status !== LeaveStatus.DISAPPROVED_BY_HRDM &&
                  rowData.status !== LeaveStatus.DISAPPROVED_BY_HRMO ? (
                    rowData.leaveName === LeaveName.VACATION ||
                    rowData.leaveName === LeaveName.FORCED ||
                    rowData.leaveName === LeaveName.SICK ||
                    rowData.leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                    rowData.leaveName === LeaveName.WELLNESS ? (
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

                            {/* FORCED */}
                            {rowData.leaveName === LeaveName.FORCED ? (
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

                            {/* VACATION  */}
                            {rowData.leaveName === LeaveName.VACATION ? (
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
                                    : parseFloat(`${selectedLeaveLedger[0]?.vacationLeaveBalance}`).toFixed(3)}
                                </td>
                              </tr>
                            ) : null}

                            {/* SICK */}
                            {rowData.leaveName === LeaveName.SICK ? (
                              <tr className="border border-slate-400">
                                <td className="border border-slate-400 text-center">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? Number(
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.sickLeaveBalance}`)
                                      ).toFixed(3)
                                    : Number(
                                        parseFloat(`${selectedLeaveLedger[0]?.sickLeaveBalance}`) +
                                          parseFloat(`${selectedLeaveLedger[0]?.sickLeave}`) * -1
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
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.sickLeaveBalance}`) -
                                        parseFloat(`${rowData.leaveDates?.length}`)
                                      ).toFixed(3)
                                    : Number(selectedLeaveLedger[0]?.sickLeaveBalance).toFixed(3)}
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
                                    ? (
                                        parseFloat(
                                          `${leaveLedger[leaveLedger.length - 1]?.specialPrivilegeLeaveBalance}`
                                        ) - parseFloat(`${rowData.leaveDates?.length}`)
                                      ).toFixed(3)
                                    : Number(selectedLeaveLedger[0]?.specialPrivilegeLeaveBalance).toFixed(3)}
                                </td>
                              </tr>
                            ) : null}

                            {/* WELLNESS */}
                            {rowData.leaveName === LeaveName.WELLNESS ? (
                              <tr className="border border-slate-400">
                                <td className="border border-slate-400 text-center">
                                  {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                  rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                  rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                    ? Number(
                                        parseFloat(
                                          `${leaveLedger[leaveLedger.length - 1]?.wellnessLeaveBalance}`
                                        ).toFixed(3)
                                      ).toFixed(3)
                                    : (
                                        Number(
                                          parseFloat(`${selectedLeaveLedger[0]?.wellnessLeaveBalance}`).toFixed(3)
                                        ) +
                                        Number(parseFloat(`${selectedLeaveLedger[0]?.wellnessLeave}`).toFixed(3)) * -1
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
                                        parseFloat(`${leaveLedger[leaveLedger.length - 1]?.wellnessLeaveBalance}`) -
                                        parseFloat(`${rowData.leaveDates?.length}`)
                                      ).toFixed(3)
                                    : Number(selectedLeaveLedger[0]?.wellnessLeaveBalance).toFixed(3)}
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    ) : rowData.leaveName === LeaveName.MONETIZATION ? (
                      // MONETIZATION
                      <div className="w-full pb-4">
                        <span className="text-slate-500 text-md">
                          Your {rowData.leaveName} Credits at the time of this application:
                        </span>
                        <table className="mt-2 bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                          <tbody>
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Leave Type</td>
                              <td className="border border-slate-400 text-center">Total Earned</td>
                              <td className="border border-slate-400 text-center">Less this app.</td>
                              <td className="border border-slate-400 text-center bg-green-100">Balance</td>
                            </tr>

                            {/* VL */}
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Vacation Leave</td>

                              <td className="border border-slate-400 text-center">
                                {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                  ? Number(
                                      parseFloat(`${leaveLedger[leaveLedger.length - 1]?.vacationLeaveBalance}`)
                                    ).toFixed(3)
                                  : (
                                      Number(parseFloat(`${vlEntry?.vacationLeaveBalance}`)) +
                                      parseFloat(`${rowData.convertedVl}`)
                                    ).toFixed(3)}
                              </td>

                              <td className="border border-slate-400 text-center">{rowData.convertedVl}</td>

                              <td className="border border-slate-400 text-center bg-green-100">
                                {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                  ? Number(
                                      parseFloat(`${leaveLedger[leaveLedger.length - 1]?.vacationLeaveBalance}`) -
                                        parseFloat(`${rowData.convertedVl}`)
                                    ).toFixed(3)
                                  : vlEntry?.vacationLeaveBalance}
                              </td>
                            </tr>

                            {/* SL */}
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Sick Leave</td>

                              <td className="border border-slate-400 text-center">
                                {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                  ? Number(
                                      parseFloat(`${leaveLedger[leaveLedger.length - 1]?.sickLeaveBalance}`)
                                    ).toFixed(3)
                                  : Number(
                                      parseFloat(`${slEntry?.sickLeaveBalance}`) + parseFloat(`${rowData.convertedSl}`)
                                    ).toFixed(3)}
                              </td>
                              <td className="border border-slate-400 text-center">{rowData.convertedSl}</td>

                              <td className="border border-slate-400 text-center bg-green-100">
                                {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                  ? Number(
                                      parseFloat(`${leaveLedger[leaveLedger.length - 1]?.sickLeaveBalance}`) -
                                        parseFloat(`${rowData.convertedSl}`)
                                    ).toFixed(3)
                                  : slEntry?.sickLeaveBalance}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : rowData.leaveName === LeaveName.TERMINAL ? (
                      // TERMINAL
                      <div className="w-full pb-4">
                        <span className="text-slate-500 text-md">Your {rowData.leaveName} Credits breakdown:</span>
                        <table className="mt-2 bg-slate-50 text-slate-600 border-collapse border-spacing-0 border border-slate-400 w-full rounded-md">
                          <tbody>
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Leave Type</td>
                              <td className="border border-slate-400 text-center">Current Credits</td>
                              <td className="border border-slate-400 text-center">Unearned Credits</td>
                              <td className="border border-slate-400 text-center bg-green-100">Total Credits</td>
                            </tr>

                            {/* VL */}
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Vacation Leave</td>

                              <td className="border border-slate-400 text-center">
                                {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                  ? Number(
                                      parseFloat(`${leaveLedger[leaveLedger.length - 1]?.vacationLeaveBalance}`)
                                    ).toFixed(3)
                                  : Number(
                                      parseFloat(
                                        `${leaveApplicationDetails.leaveApplicationDetails?.vlBalance?.beforeTerminalLeave}`
                                      )
                                    ).toFixed(3)}
                              </td>

                              <td className="border border-slate-400 text-center">
                                {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                  ? Number(
                                      parseFloat(
                                        `${leaveApplicationDetails.leaveApplicationDetails?.vlBalance?.afterTerminalLeave}`
                                      ) - parseFloat(`${leaveLedger[leaveLedger.length - 1]?.vacationLeaveBalance}`)
                                    ).toFixed(3)
                                  : Number(
                                      parseFloat(
                                        `${leaveApplicationDetails.leaveApplicationDetails?.vlBalance?.afterTerminalLeave}`
                                      ) -
                                        parseFloat(
                                          `${leaveApplicationDetails.leaveApplicationDetails?.vlBalance?.beforeTerminalLeave}`
                                        )
                                    ).toFixed(3)}
                              </td>

                              <td className="border border-slate-400 text-center bg-green-100">
                                {Number(
                                  parseFloat(
                                    `${leaveApplicationDetails.leaveApplicationDetails?.vlBalance?.afterTerminalLeave}`
                                  )
                                ).toFixed(3)}
                              </td>
                            </tr>

                            {/* SL */}
                            <tr className="border border-slate-400">
                              <td className="border border-slate-400 text-center">Sick Leave</td>

                              <td className="border border-slate-400 text-center">
                                {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                  ? Number(
                                      parseFloat(`${leaveLedger[leaveLedger.length - 1]?.sickLeaveBalance}`)
                                    ).toFixed(3)
                                  : Number(
                                      parseFloat(
                                        `${leaveApplicationDetails.leaveApplicationDetails?.slBalance?.beforeTerminalLeave}`
                                      )
                                    ).toFixed(3)}
                              </td>

                              <td className="border border-slate-400 text-center">
                                {rowData.status === LeaveStatus.FOR_HRMO_CREDIT_CERTIFICATION ||
                                rowData.status === LeaveStatus.FOR_SUPERVISOR_APPROVAL ||
                                rowData.status === LeaveStatus.FOR_HRDM_APPROVAL
                                  ? Number(
                                      parseFloat(
                                        `${leaveApplicationDetails.leaveApplicationDetails?.slBalance?.afterTerminalLeave}`
                                      ) - parseFloat(`${leaveLedger[leaveLedger.length - 1]?.sickLeaveBalance}`)
                                    ).toFixed(3)
                                  : Number(
                                      parseFloat(
                                        `${leaveApplicationDetails.leaveApplicationDetails?.slBalance?.afterTerminalLeave}`
                                      ) -
                                        parseFloat(
                                          `${leaveApplicationDetails.leaveApplicationDetails?.slBalance?.beforeTerminalLeave}`
                                        )
                                    ).toFixed(3)}
                              </td>

                              <td className="border border-slate-400 text-center bg-green-100">
                                {Number(
                                  parseFloat(
                                    `${leaveApplicationDetails.leaveApplicationDetails?.slBalance?.afterTerminalLeave}`
                                  )
                                ).toFixed(3)}
                              </td>
                            </tr>
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
              {leaveApplicationDetails?.leaveApplicationBasicInfo?.isLateFiling === 'true' ? (
                <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => setJlDocModalIsOpen(true)}>
                  Justification
                </Button>
              ) : null}

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
              {leaveApplicationDetails?.leaveApplicationBasicInfo?.isLateFiling === 'true' ? (
                <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => setJlDocModalIsOpen(true)}>
                  Justification
                </Button>
              ) : null}

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
