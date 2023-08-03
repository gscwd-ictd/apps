/* eslint-disable @nx/enforce-module-boundaries */
import {
  AlertNotification,
  Modal,
  PageContentContext,
} from '@gscwd-apps/oneui';
import { UseCapitalizer } from 'apps/employee-monitoring/src/utils/functions/Capitalizer';
import dayjs from 'dayjs';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import {
  EmployeeLeaveDetails,
  MonitoringLeave,
} from 'libs/utils/src/lib/types/leave-application.type';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LabelValue } from '../../../labels/LabelValue';
import userphoto from '../../../../../public/user-photo.jpg';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { SelectListRF } from '../../../inputs/SelectListRF';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { LabelInput } from '../../../inputs/LabelInput';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { useLeaveApplicationStore } from 'apps/employee-monitoring/src/store/leave-application.store';
import { isEmpty } from 'lodash';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import UseRenderLeaveStatus from 'apps/employee-monitoring/src/utils/functions/RenderLeaveStatus';
import { LeaveType } from 'libs/utils/src/lib/types/leave-benefits.type';
import UseRenderBadgePill from 'apps/employee-monitoring/src/utils/functions/RenderBadgePill';
import UseRenderLeaveType from 'apps/employee-monitoring/src/utils/functions/RenderLeaveType';
import LeaveApplicationConfirmModal from './LeaveApplicationConfirmModal';

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

const ViewLeaveApplicationModal: FunctionComponent<
  ViewLeaveApplicationModalProps
> = ({ rowData, modalState, closeModalAction, setModalState }) => {
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
    `/leave-application/details/${rowData.employee?.employeeId}/${rowData.id}`,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // store
  const {
    data,
    leaveApplicationDetails,
    setData,
    getLeaveApplicationDetails,
    getLeaveApplicationDetailsFail,
    getLeaveApplicationDetailsSuccess,
  } = useLeaveApplicationStore((state) => ({
    leaveApplicationDetails: state.leaveApplicationDetails,
    data: state.leaveDataForSubmission,
    setData: state.setLeaveDataForSubmission,
    getLeaveApplicationDetails: state.getLeaveApplicationDetails,
    getLeaveApplicationDetailsSuccess: state.getLeaveApplicationDetailsSuccess,
    getLeaveApplicationDetailsFail: state.getLeaveApplicationDetailsFail,
  }));

  // confirm modal
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState<boolean>(false);

  // on submit
  const onSubmit = async () => {
    setData({ ...data, id: rowData.id });
    if (
      leaveApplicationDetails.leaveApplicationBasicInfo.leaveType ===
        LeaveType.CUMULATIVE ||
      leaveApplicationDetails.leaveApplicationBasicInfo.leaveType ===
        LeaveType.RECURRING
    ) {
      setData({ ...data, action: 'approve', id: rowData.id });
    }
    await openConfirmModal();
  };

  // open confirm modal
  const openConfirmModal = async () => {
    setConfirmModalIsOpen(true);
  };

  // close confirm modal
  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
  };

  // use form
  const { register, getValues, watch, reset, setValue, handleSubmit } =
    useForm<LeaveForm>({
      defaultValues: {
        action: null,
        accumulatedCredits:
          parseInt(
            leaveApplicationDetails.leaveApplicationBasicInfo?.debitValue
          ) ?? null,
      },
    });

  // close modal action
  const closeModal = () => {
    closeModalAction();
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

  //! temporary
  useEffect(() => {
    if (!isEmpty(leaveApplicationDetails)) {
      console.log(leaveApplicationDetails);
    }
  }, [leaveApplicationDetails]);

  useEffect(() => {
    register('action');
  }, [modalState]);

  return (
    <>
      <LeaveApplicationConfirmModal
        modalState={confirmModalIsOpen}
        setModalState={setConfirmModalIsOpen}
        closeModalAction={closeConfirmModal}
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
            ? 'sm'
            : 'full'
        }
        steady
      >
        <Modal.Header withCloseBtn>
          <div className="flex justify-between text-2xl font-semibold text-gray-800">
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
                <div className="flex flex-col gap-4 px-2 py-2 rounded ">
                  {/* HEADER */}
                  <div className="flex justify-between w-full px-2 sm:flex-col md:flex-col lg:flex-row">
                    <section className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-2">
                        {leaveApplicationDetails.employeeDetails?.photoUrl ? (
                          <div className="flex flex-wrap justify-center">
                            <div className="w-[6rem]">
                              <Image
                                src={
                                  leaveApplicationDetails.employeeDetails
                                    ?.photoUrl
                                }
                                width={100}
                                height={100}
                                alt="employee-photo"
                                className="h-auto max-w-full align-middle border-none rounded-full shadow"
                              />
                            </div>
                          </div>
                        ) : (
                          <i className="text-gray-700 text-8xl bx bxs-user-circle"></i>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <div className="text-2xl font-semibold">
                          {rowData.employee?.employeeName}
                        </div>
                        <div className="font-light">
                          {leaveApplicationDetails.employeeDetails?.assignment
                            .positionTitle ?? 'Employee'}
                        </div>
                        <div className="font-semibold ">
                          {leaveApplicationDetails.employeeDetails?.companyId ??
                            '--'}
                        </div>
                      </div>
                    </section>
                  </div>

                  <hr />

                  <div className="grid grid-cols-2 grid-rows-1 px-5 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Leave Name"
                      direction="top-to-bottom"
                      textSize="md"
                      value={rowData.leaveName}
                    />

                    <LabelValue
                      label="Status"
                      direction="top-to-bottom"
                      textSize="md"
                      value={
                        rowData.status
                          ? UseRenderLeaveStatus(rowData.status)
                          : ''
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 grid-rows-1 px-5 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Applied Number of Days"
                      direction="top-to-bottom"
                      textSize="md"
                      value={
                        leaveApplicationDetails.leaveApplicationBasicInfo
                          ?.debitValue
                          ? parseInt(
                              leaveApplicationDetails.leaveApplicationBasicInfo
                                ?.debitValue
                            )
                          : 0
                      }
                    />

                    <LabelValue
                      label="Applied Leave Dates"
                      direction="top-to-bottom"
                      textSize="md"
                      value={
                        rowData.leaveDates && rowData.leaveDates.length >= 2 ? (
                          <div className="flex items-center gap-2 text-sm font-light">
                            {UseRenderBadgePill(
                              firstAndLastDate(rowData.leaveDates).start
                            )}
                            <div>to</div>
                            {UseRenderBadgePill(
                              firstAndLastDate(rowData.leaveDates).end
                            )}
                          </div>
                        ) : rowData.leaveDates &&
                          rowData.leaveDates.length === 1 ? (
                          rowData.leaveDates.map((date) => {
                            return (
                              <div className="flex items-center gap-2 text-sm font-light">
                                {UseRenderBadgePill(date)}
                              </div>
                            );
                          })
                        ) : (
                          'N/A'
                        )
                      }
                    />
                  </div>

                  {/* VACATION LEAVE */}
                  <div className="grid grid-cols-2 grid-rows-1 px-5 sm:gap-2 md:gap:2 lg:gap-0">
                    {!isEmpty(
                      leaveApplicationDetails.leaveApplicationDetails
                        ?.inPhilippinesOrAbroad
                    ) ? (
                      <>
                        <LabelValue
                          label="Leave Details"
                          direction="top-to-bottom"
                          textSize="md"
                          value={
                            leaveApplicationDetails.leaveApplicationDetails
                              ?.inPhilippinesOrAbroad
                          }
                        />
                        <LabelValue
                          label="Location"
                          direction="top-to-bottom"
                          textSize="md"
                          value={
                            leaveApplicationDetails.leaveApplicationDetails
                              ?.location
                          }
                        />
                      </>
                    ) : null}

                    {/* SICK LEAVE */}
                    {!isEmpty(
                      leaveApplicationDetails.leaveApplicationDetails?.hospital
                    ) ? (
                      <>
                        <LabelValue
                          label="Leave Details"
                          direction="top-to-bottom"
                          textSize="md"
                          value={
                            leaveApplicationDetails.leaveApplicationDetails
                              .hospital
                          }
                        />
                        <LabelValue
                          label="Illness"
                          direction="top-to-bottom"
                          textSize="md"
                          value={
                            leaveApplicationDetails.leaveApplicationDetails
                              ?.illness ?? 'N/A'
                          }
                        />
                      </>
                    ) : null}

                    {/* STUDY LEAVE */}
                    {!isEmpty(
                      leaveApplicationDetails.leaveApplicationDetails
                        ?.forBarBoardReview
                    ) ||
                    !isEmpty(
                      leaveApplicationDetails.leaveApplicationDetails
                        ?.forMastersCompletion
                    ) ? (
                      <>
                        {leaveApplicationDetails.leaveApplicationDetails
                          ?.forBarBoardReview && (
                          <LabelValue
                            label="Leave Details"
                            direction="top-to-bottom"
                            textSize="md"
                            value={
                              parseInt(
                                leaveApplicationDetails.leaveApplicationDetails
                                  ?.forBarBoardReview
                              ) === 1
                                ? 'For Board Review'
                                : parseInt(
                                    leaveApplicationDetails
                                      .leaveApplicationDetails
                                      ?.forMastersCompletion
                                  ) === 1
                                ? 'For Masters Completion'
                                : ''
                            }
                          />
                        )}
                        <LabelValue
                          label="Purpose"
                          direction="top-to-bottom"
                          textSize="md"
                          value={
                            leaveApplicationDetails.leaveApplicationDetails
                              ?.studyLeaveOther ?? 'N/A'
                          }
                        />
                      </>
                    ) : null}
                  </div>

                  <hr />

                  <div className="grid grid-cols-2 grid-rows-1 px-5 sm:gap-2 md:gap:2 lg:gap-0">
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
                      value={
                        leaveApplicationDetails.employeeDetails?.assignment
                          ?.name ?? ''
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 grid-rows-1 px-5 sm:gap-2 md:gap:2 lg:gap-0">
                  {leaveApplicationDetails.leaveApplicationBasicInfo
                    ?.leaveType === LeaveType.SPECIAL &&
                    leaveApplicationDetails.leaveApplicationBasicInfo.status ===
                      LeaveStatus.FOR_HRMO_APPROVAL && (
                      <div className="w-full px-2">
                        {/* <LabelInput
                        id="accumulatedCredits"
                        label="Credits"
                        disabled
                        helper={
                          <span className="flex items-center px-2 font-light text-white bg-green-500 rounded lg:text-xs">{`Maximum credit is ${parseInt(
                            leaveApplicationDetails.leaveApplicationBasicInfo.maximumCredits.toString()
                          )}`}</span>
                        }
                        textSize="md"
                        className="w-full"
                        defaultValue={parseInt(
                          leaveApplicationDetails.leaveApplicationBasicInfo
                            .debitValue
                        )}
                        type="number"
                        min={1}
                        max={parseInt(
                          leaveApplicationDetails.leaveApplicationBasicInfo?.maximumCredits.toString()
                        )}
                        controller={{
                          ...register('accumulatedCredits', {
                            onChange: (e) => {
                              setData({
                                ...data,
                                approveValue: e.target.value,
                              });
                            },
                          }),
                        }}
                      /> */}
                        <LabelValue
                          label={`Maximum Credit Value is ${parseInt(
                            leaveApplicationDetails.leaveApplicationBasicInfo?.maximumCredits.toString()
                          )}`}
                          direction="top-to-bottom"
                          textSize="md"
                          value={parseInt(
                            leaveApplicationDetails.leaveApplicationBasicInfo
                              .debitValue
                          )}
                        />
                      </div>
                    )}

                  {leaveApplicationDetails.leaveApplicationBasicInfo
                    ?.leaveType === LeaveType.SPECIAL &&
                    leaveApplicationDetails.leaveApplicationBasicInfo.status ===
                      LeaveStatus.FOR_HRMO_APPROVAL && (
                      <div className="w-full pr-2">
                        <SelectListRF
                          id="action"
                          textSize="md"
                          selectList={actionTaken}
                          controller={{
                            ...register('action', {
                              onChange: (e) => {
                                console.log(e.target.value);
                                setData({ ...data, action: e.target.value });
                              },
                            }),
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
        {leaveApplicationDetails.leaveApplicationBasicInfo?.leaveType ===
        LeaveType.SPECIAL ? (
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
                LeaveStatus.FOR_HRMO_APPROVAL &&
                watch('action') !== null && (
                  <button
                    className="px-3 w-[5rem] py-2 text-sm text-white bg-blue-400 rounded"
                    type="button"
                    onClick={onSubmit}
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
                LeaveStatus.FOR_HRMO_APPROVAL && (
                <button
                  className="px-3 w-[5rem] py-2 text-sm text-white bg-blue-400 rounded"
                  type="button"
                  onClick={onSubmit}
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
