/* eslint-disable @nx/enforce-module-boundaries */
import { LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import React, { FunctionComponent, useEffect } from 'react';
import { LabelValue } from '../../../labels/LabelValue';

//type and store
import { SystemLog } from 'apps/employee-monitoring/src/utils/types/system-log.type';
import { useSystemLogsStore } from 'apps/employee-monitoring/src/store/system-log.store';

import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';

type ViewSystemLogModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: SystemLog;
};

const ViewSystemLogModal: FunctionComponent<ViewSystemLogModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // useSWR
  const {
    data: swrSystemLogDetails,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(modalState && rowData.id ? `/user-logs/${rowData.id}` : null, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  // Zustand initialization
  const {
    SystemLogDetails,
    SetGetSystemLogDetails,

    ErrorSystemLog,
    SetErrorSystemLog,
  } = useSystemLogsStore((state) => ({
    SystemLogDetails: state.getSystemLogDetails,
    SetGetSystemLogDetails: state.setGetSystemLogDetails,

    ErrorSystemLog: state.errorSystemLog,
    SetErrorSystemLog: state.setErrorSystemLog,
  }));

  // isLoading
  useEffect(() => {
    if (swrIsLoading) {
      SetGetSystemLogDetails({
        id: '',
        dateLogged: '',
        timeLogged: '',
        userFullName: '',
        method: '',
        route: '',
        body: undefined,
      });
    }
  }, [swrIsLoading]);

  // SystemLogDetails
  useEffect(() => {
    if (!isEmpty(swrSystemLogDetails)) {
      SetGetSystemLogDetails(swrSystemLogDetails.data);
    }

    // Error
    if (!isEmpty(swrError)) {
      SetErrorSystemLog(swrError);
    }
  }, [swrSystemLogDetails, swrError]);

  return (
    <>
      {ErrorSystemLog ? (
        <ToastNotification toastType="error" notifMessage={ErrorSystemLog} />
      ) : (
        <Modal open={modalState} setOpen={setModalState} size="md">
          <Modal.Header withCloseBtn>
            <div className="flex justify-between text-2xl font-semibold text-gray-800">
              <div className="flex gap-1 px-5 text-xl font-semibold text-gray-800">
                <span>System Log</span>
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
              <div className="flex flex-col w-full px-2 py-4">
                <div className="flex flex-col gap-4">
                  {swrIsLoading ? (
                    <LoadingSpinner size="lg" />
                  ) : (
                    <div className="grid px-5 gap-3">
                      <div className="flex flex-row gap-2">
                        <LabelValue
                          label="Date Logged"
                          direction="top-to-bottom"
                          textSize="xs"
                          value={
                            SystemLogDetails.dateLogged
                              ? dayjs(SystemLogDetails.dateLogged).format('MMMM DD, YYYY')
                              : ''
                          }
                        />
                        <LabelValue
                          label="Time Logged"
                          direction="top-to-bottom"
                          textSize="xs"
                          value={dayjs(SystemLogDetails.dateLogged).format('hh:mm A')}
                        />
                      </div>
                      <LabelValue
                        label="Name"
                        direction="top-to-bottom"
                        textSize="xs"
                        value={SystemLogDetails.userFullName}
                      />
                      <LabelValue
                        label="Method"
                        direction="top-to-bottom"
                        textSize="xs"
                        value={SystemLogDetails.method}
                      />
                      <LabelValue
                        label="Route"
                        direction="top-to-bottom"
                        textSize="xs"
                        value={SystemLogDetails.route}
                      />
                      <LabelValue
                        label="Body"
                        direction="top-to-bottom"
                        textSize="xs"
                        value={JSON.stringify(SystemLogDetails.body)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <></>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ViewSystemLogModal;
