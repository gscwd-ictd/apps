/* eslint-disable @nx/enforce-module-boundaries */
import { Modal, PageContentContext } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
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

// /v1/leave-application/details/${leaveId}

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

  // useSWR
  const {
    data: swrLeaveDetails,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(
    modalState && rowData.employee?.employeeId && rowData.id
      ? `/leave-application/details/${rowData.employee?.employeeId}/${rowData.id}`
      : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // leave application store
  const {
    leaveApplicationDetails,
    leaveConfirmAction,
    setLeaveConfirmAction,
    patchLeaveApplication,
    patchLeaveApplicationFail,
    patchLeaveApplicationSuccess,
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
    // const { action, ...rest } = leave;

    const data = {
      id: rowData.id,
      status:
        leaveApplicationDetails.leaveApplicationBasicInfo.leaveType === LeaveType.CUMULATIVE ||
        leaveApplicationDetails.leaveApplicationBasicInfo.leaveType === LeaveType.RECURRING
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

  // success or fail
  useEffect(() => {
    if (!isEmpty(swrLeaveDetails)) {
      getLeaveApplicationDetailsSuccess(swrLeaveDetails.data);
    }

    if (!isEmpty(swrError)) {
      getLeaveApplicationDetailsFail(swrError.message);
    }
  }, [swrLeaveDetails, swrError]);

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
            <span className="px-5">Leave Application</span>
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
                      value={rowData.status ? UseRenderLeaveStatus(rowData.status, 'text-sm') : ''}
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
                    leaveApplicationDetails.leaveApplicationBasicInfo.status === LeaveStatus.FOR_HRMO_APPROVAL && (
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
                    leaveApplicationDetails.leaveApplicationBasicInfo.status === LeaveStatus.FOR_HRMO_APPROVAL && (
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

                {/* TRAIL */}
                <div className="grid grid-cols-2 grid-rows-1 px-7 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Date of Filing: "
                    textSize="md"
                    value={dayjs(rowData.dateOfFiling).format('MMM DD, YYYY')}
                    direction="left-to-right"
                  />
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
              {leaveApplicationDetails.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRMO_APPROVAL &&
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
              {leaveApplicationDetails.leaveApplicationBasicInfo?.status === LeaveStatus.FOR_HRMO_APPROVAL && (
                <button
                  className="px-3 w-[5rem] py-2 text-sm text-white bg-blue-400 rounded"
                  type="button"
                  onClick={() => openConfirmModal(Action.APPROVE)}
                >
                  Approve
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
