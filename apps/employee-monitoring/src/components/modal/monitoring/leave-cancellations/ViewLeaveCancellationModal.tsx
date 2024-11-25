/* eslint-disable @nx/enforce-module-boundaries */
import { Modal, PageContentContext } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import { LeaveCancellationStatus } from 'libs/utils/src/lib/enums/leave.enum';
import { LeaveCancellation, LeaveCancellationDetails } from 'libs/utils/src/lib/types/leave-application.type';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { LabelValue } from '../../../labels/LabelValue';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useLeaveApplicationStore } from 'apps/employee-monitoring/src/store/leave-application.store';
import { isEmpty } from 'lodash';
import 'react-loading-skeleton/dist/skeleton.css';
import UseRenderBadgePill from 'apps/employee-monitoring/src/utils/functions/RenderBadgePill';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import UseRenderLeaveCancellationStatus from 'apps/employee-monitoring/src/utils/functions/RenderLeaveCancellationStatus';
import LeaveCancellationConfirmModal from './LeaveCancellationConfirmModal';

type ViewLeaveCancellationModalProps = {
  rowData: LeaveCancellationDetails;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

enum Action {
  APPROVE = 'approve',
  DISAPPROVE = 'disapprove',
}

const ViewLeaveCancellationModal: FunctionComponent<ViewLeaveCancellationModalProps> = ({
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

    SetLeaveCancellationConfirmAction,

    SetApproveLeaveCancellation,

    SetErrorApproveLeaveCancellation,
  } = useLeaveApplicationStore((state) => ({
    leaveConfirmAction: state.leaveConfirmAction,

    SetLeaveCancellationConfirmAction: state.setLeaveCancellationConfirmAction,

    SetApproveLeaveCancellation: state.setApproveLeaveCancellation,

    SetErrorApproveLeaveCancellation: state.setErrorApproveLeaveCancellation,
  }));

  // confirm modal
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState<boolean>(false);

  // action to be sent to the modal
  const [confirmAction, setConfirmAction] = useState<Action | null>(null);

  // use form
  const {
    reset,
    formState: { isSubmitting },
  } = useForm<LeaveCancellation>();

  // on submit
  const onSubmit = async () => {
    const data = {
      leaveApplicationId: rowData.leaveApplicationId,
      status: LeaveCancellationStatus.CANCELLED,
      leaveDates: rowData.forCancellationLeaveDates,
    };

    // call the patch function
    await handlePatchLeaveCancellation(data);
  };

  // function for patching the leave application
  const handlePatchLeaveCancellation = async (data: LeaveCancellation) => {
    const { error, result } = await patchEmpMonitoring('leave/employee/leave-date-cancellation/', data);

    if (!error) {
      // patch leave application success
      SetApproveLeaveCancellation(result);
      closeModalAction();
    } else if (error) {
      // patch leave application fail
      SetErrorApproveLeaveCancellation(result);

      // set action to null
      SetLeaveCancellationConfirmAction(null);
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
    SetLeaveCancellationConfirmAction(null);
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

  useEffect(() => {
    if (leaveConfirmAction === 'yes') {
      onSubmit();
    }
  }, [leaveConfirmAction, confirmModalIsOpen]);

  return (
    <>
      <LeaveCancellationConfirmModal
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
            <span className="px-5">Leave Cancellation</span>
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
          <div className="w-full min-h-[14rem]">
            <div className="flex flex-col w-full gap-4 rounded ">
              <div className="flex flex-col gap-4 px-3 rounded ">
                {/* HEADER */}
                <div className="flex justify-between w-full px-2 py-1 sm:flex-col md:flex-col lg:flex-row">
                  <section className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {!isEmpty(rowData.employeeDetails?.photoUrl) ? (
                        <div className="flex flex-wrap justify-center">
                          <div className="w-[6rem]">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}${rowData.employeeDetails?.photoUrl}`}
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
                      <div className="text-xl font-semibold">{rowData.employeeDetails?.employeeName}</div>
                      <div className="font-light">{rowData.employeeDetails?.positionTitle}</div>
                      <div className="font-semibold ">{rowData.employeeDetails?.companyId}</div>
                    </div>
                  </section>
                </div>

                <hr />

                <div className="grid grid-cols-2 grid-rows-1 px-3 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Date of Filing: "
                    textSize="md"
                    value={dayjs(rowData.dateOfFiling).format('MMM DD, YYYY')}
                    direction="top-to-bottom"
                  />
                </div>

                <div className="grid grid-cols-2 grid-rows-1 px-3 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue label="Leave Type" direction="top-to-bottom" textSize="md" value={rowData.leaveName} />

                  <LabelValue
                    label="Status"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.status ? UseRenderLeaveCancellationStatus(rowData.status, 'text-sm') : ''}
                  />
                </div>

                <div className="grid grid-cols-2 grid-rows-1 px-3 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Leave Dates"
                    direction="top-to-bottom"
                    textSize="md"
                    value={
                      rowData.leaveDates && rowData.leaveDates.length >= 2 ? (
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          {UseRenderBadgePill(firstAndLastDate(rowData.leaveDates).start, 'text-md')}
                          <div>,</div>
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

                  <LabelValue
                    label="Leave Dates for Cancellation"
                    direction="top-to-bottom"
                    textSize="md"
                    value={
                      rowData.forCancellationLeaveDates && rowData.forCancellationLeaveDates.length >= 2 ? (
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          {UseRenderBadgePill(firstAndLastDate(rowData.forCancellationLeaveDates).start, 'text-md')}
                          <div>to</div>
                          {UseRenderBadgePill(firstAndLastDate(rowData.forCancellationLeaveDates).end, 'text-md')}
                        </div>
                      ) : rowData.forCancellationLeaveDates && rowData.forCancellationLeaveDates.length === 1 ? (
                        rowData.forCancellationLeaveDates.map((date, idx) => {
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

                <div className="grid grid-cols-1 grid-rows-1 px-3 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue label="Remarks" direction="top-to-bottom" textSize="md" value={rowData.remarks} />
                </div>

                <hr />
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 w-[5rem] py-2 text-sm text-gray-700 bg-gray-50 border rounded"
              onClick={closeModal}
              type="button"
            >
              Close
            </button>

            {rowData.status === LeaveCancellationStatus.FOR_CANCELLATION && (
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
      </Modal>
    </>
  );
};

export default ViewLeaveCancellationModal;
