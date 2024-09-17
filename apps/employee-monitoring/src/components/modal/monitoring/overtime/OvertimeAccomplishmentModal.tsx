/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import useSWR from 'swr';
import Image from 'next/image';
import React, { FunctionComponent, useEffect } from 'react';
import { LabelValue } from '../../../labels/LabelValue';
import { EmployeeOvertimeDetails } from 'libs/utils/src/lib/types/employee.type';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import { useOvertimeStore } from 'apps/employee-monitoring/src/store/overtime.store';
import { ScheduleBases } from 'libs/utils/src/lib/enums/schedule.enum';
import UseRenderOvertimeAccomplishmentStatus from 'apps/employee-monitoring/src/utils/functions/RenderOvertimeAccomplishmentStatus';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { OvertimeAccomplishmentStatus } from 'libs/utils/src/lib/enums/overtime.enum';

type EmployeeRowDetails = {
  overtimeId: string;
  employee: EmployeeOvertimeDetails;
};

type OvertimeAccomplishmentModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: EmployeeRowDetails;
};

const ViewEmployeeOvertimeAccomplishmentModal: FunctionComponent<OvertimeAccomplishmentModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // Zustand initialization
  const {
    OvertimeAccomplishment,
    SetOvertimeAccomplishment,

    ErrorOvertimeAccomplishment,
    SetErrorOvertimeAccomplishment,
  } = useOvertimeStore((state) => ({
    OvertimeAccomplishment: state.overtimeAccomplishment,
    SetOvertimeAccomplishment: state.setOvertimeAccomplishment,

    ErrorOvertimeAccomplishment: state.errorOvertimeAccomplishment,
    SetErrorOvertimeAccomplishment: state.setErrorOvertimeAccomplishment,
  }));

  // swr request for overtime details
  const {
    data: overtimeAccomplishment,
    isLoading: overtimeAccomplishmentLoading,
    error: overtimeAccomplishmentError,
  } = useSWR(
    modalState && rowData.employee?.employeeId && rowData.overtimeId
      ? `/overtime/${rowData.employee?.employeeId}/${rowData.overtimeId}/details`
      : null,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // set zustand state. either success or fail
  useEffect(() => {
    if (!isEmpty(overtimeAccomplishment)) {
      SetOvertimeAccomplishment(overtimeAccomplishment.data);
    }

    if (!isEmpty(overtimeAccomplishmentError)) {
      SetErrorOvertimeAccomplishment(overtimeAccomplishmentError.message);
    }
  }, [overtimeAccomplishment, overtimeAccomplishmentError]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(ErrorOvertimeAccomplishment) ? (
        <ToastNotification toastType="error" notifMessage={ErrorOvertimeAccomplishment} />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between text-2xl font-semibold text-gray-800">
            <div className="flex gap-1 px-5 text-2xl font-semibold text-gray-800">
              <span>Overtime</span>
            </div>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModalAction}
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
                      {rowData.employee?.avatarUrl ? (
                        <div className="flex flex-wrap justify-center">
                          <div className="w-[6rem]">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}${rowData.employee?.avatarUrl}`}
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
                      <div className="text-xl font-semibold">{rowData.employee?.fullName}</div>
                      <div className="font-light">{rowData.employee?.assignment}</div>
                      <div className="font-semibold ">{rowData.employee?.companyId}</div>
                    </div>
                  </section>
                </div>

                <hr />

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Planned Date"
                    direction="top-to-bottom"
                    textSize="md"
                    value={OvertimeAccomplishment.plannedDate || '--'}
                  />

                  <LabelValue
                    label="Status"
                    direction="top-to-bottom"
                    textSize="md"
                    value={
                      OvertimeAccomplishment.status
                        ? UseRenderOvertimeAccomplishmentStatus(OvertimeAccomplishment.status)
                        : '--'
                    }
                  />
                </div>

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Estimated Hours"
                    direction="top-to-bottom"
                    textSize="md"
                    value={OvertimeAccomplishment.estimatedHours ? OvertimeAccomplishment.estimatedHours : '--'}
                  />
                </div>

                <hr />

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <div className="grid  grid-cols-1 gap-0">
                    <label className="font-normal text-gray-500">IVMS Entries:</label>

                    {OvertimeAccomplishment && OvertimeAccomplishment.entriesForTheDay?.length > 0 ? (
                      OvertimeAccomplishment.entriesForTheDay?.map((logs: string, idx: number) => {
                        return (
                          <div key={idx} className="pl-3">
                            <label className="text-sm font-medium ">{logs}</label>
                          </div>
                        );
                      })
                    ) : (
                      <label className="text-md font-medium pl-3">None</label>
                    )}
                  </div>

                  <div className="grid px-5 grid-rows-2 grid-cols-1 gap-2">
                    <LabelValue
                      label="Encoded Time In"
                      direction="top-to-bottom"
                      textSize="md"
                      value={
                        OvertimeAccomplishment.encodedTimeIn
                          ? DateTimeFormatter(OvertimeAccomplishment.encodedTimeIn)
                          : '--'
                      }
                    />

                    <LabelValue
                      label="Encoded Time Out"
                      direction="top-to-bottom"
                      textSize="md"
                      value={
                        OvertimeAccomplishment.encodedTimeOut
                          ? DateTimeFormatter(OvertimeAccomplishment.encodedTimeOut)
                          : '--'
                      }
                    />
                  </div>
                </div>

                <hr />

                {/* If there is accomplishment filled up */}
                {OvertimeAccomplishment?.accomplishments ? (
                  <div className="grid px-5 grid-cols-1">
                    <LabelValue
                      label="Accomplishment Report"
                      direction="top-to-bottom"
                      textSize="md"
                      value={
                        OvertimeAccomplishment.accomplishments
                          ? OvertimeAccomplishment.accomplishments
                          : 'Not yet filled.'
                      }
                    />
                  </div>
                ) : null}

                {/* If status is declined */}
                {OvertimeAccomplishment.status === OvertimeAccomplishmentStatus.DISAPPROVED ? (
                  <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Remarks"
                      direction="top-to-bottom"
                      textSize="md"
                      value={OvertimeAccomplishment.remarks ? OvertimeAccomplishment.remarks : 'N/A'}
                    />
                  </div>
                ) : null}

                <hr />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewEmployeeOvertimeAccomplishmentModal;
