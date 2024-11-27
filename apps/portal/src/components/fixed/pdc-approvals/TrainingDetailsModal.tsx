/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, CaptchaModal, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { HiArrowCircleRight, HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PdcApprovalAction, TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';
import { usePdcApprovalsStore } from 'apps/portal/src/store/pdc-approvals.store';
import { useEffect, useState } from 'react';
import { isEmpty, isEqual } from 'lodash';
import { ConfirmationPdcModal } from './PdcApprovalOtp/ConfirmationPdcModal';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { UserRole } from 'libs/utils/src/lib/enums/user-roles.enum';
import { ApprovalCaptcha } from './PdcApprovalOtp/ApprovalCaptcha';
import { createColumnHelper } from '@tanstack/react-table';
import {
  NominatedEmployees,
  Training,
  TrainingDetails,
  TrainingRequirement,
} from 'libs/utils/src/lib/types/training.type';
import UseRenderTrainingNomineeStatus from 'apps/portal/src/utils/functions/RenderTrainingNomineeStatus';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import { DataTablePortal, useDataTable } from 'libs/oneui/src/components/Tables/DataTablePortal';
import { ApprovalType } from 'libs/utils/src/lib/enums/approval-type.enum';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import dayjs from 'dayjs';
import { TrainingDesignModal } from './TrainingDesignModal';
import { useLnd } from 'apps/portal/src/utils/hooks/use-lnd';
import { Storage } from 'appwrite';
import { Disclosure } from '@headlessui/react';
import axios from 'axios';
import convertSize from 'convert-size';
import Link from 'next/link';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type PdcAction = {
  action: PdcApprovalAction;
};

const approvalAction: Array<SelectOption> = [
  { label: 'Approve', value: `${PdcApprovalAction.APPROVE}` },
  { label: 'Disapprove', value: `${PdcApprovalAction.DISAPPROVE}` },
];

export const TrainingDetailsModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    loadingResponse,
    individualTrainingDetails, //portal format
    otpPdcModalIsOpen,
    confirmTrainingModalIsOpen,
    setConfirmTrainingModalIsOpen,
    setOtpPdcModalIsOpen,
    setCaptchaPdcModalIsOpen,
    captchaPdcModalIsOpen,

    trainingDetails, //L&D format
    loadingTrainingDetails,
    errorTrainingDetails,
    getTrainingDetails,
    getTrainingDetailsSuccess,
    getTrainingDetailsFail,

    trainingDesignModalIsOpen,

    bucketFiles,
    errorBucketFiles,
    getBucketFiles,
    getBucketFilesSuccess,
    getBucketFilesFail,

    setBucketFiles,
    setTrainingDesignModalIsOpen,
    setTrainingDetails,
  } = usePdcApprovalsStore((state) => ({
    individualTrainingDetails: state.individualTrainingDetails,
    loadingResponse: state.loading.loadingResponse,
    otpPdcModalIsOpen: state.otpPdcModalIsOpen,
    confirmTrainingModalIsOpen: state.confirmTrainingModalIsOpen,
    setConfirmTrainingModalIsOpen: state.setConfirmTrainingModalIsOpen,
    setOtpPdcModalIsOpen: state.setOtpPdcModalIsOpen,
    setCaptchaPdcModalIsOpen: state.setCaptchaPdcModalIsOpen,
    captchaPdcModalIsOpen: state.captchaPdcModalIsOpen,

    trainingDetails: state.trainingDetails,
    loadingTrainingDetails: state.loading.loadingTrainingDetails,
    errorTrainingDetails: state.error.errorTrainingDetails,
    getTrainingDetails: state.getTrainingDetails,
    getTrainingDetailsSuccess: state.getTrainingDetailsSuccess,
    getTrainingDetailsFail: state.getTrainingDetailsFail,

    trainingDesignModalIsOpen: state.trainingDesignModalIsOpen,
    setTrainingDesignModalIsOpen: state.setTrainingDesignModalIsOpen,

    bucketFiles: state.bucketFiles,
    errorBucketFiles: state.error.errorBucketFiles,
    getBucketFiles: state.getBucketFiles,
    getBucketFilesSuccess: state.getBucketFilesSuccess,
    getBucketFilesFail: state.getBucketFilesFail,
    setBucketFiles: state.setBucketFiles,

    setTrainingDetails: state.setTrainingDetails,
  }));

  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  const [reason, setReason] = useState<string>('');

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<PdcAction>({
    mode: 'onChange',
    defaultValues: {
      action: PdcApprovalAction.APPROVE,
    },
  });

  useEffect(() => {
    if (!modalState) {
      setValue('action', null);
      setTrainingDetails({} as TrainingDetails);
    }
  }, [modalState]);

  const onSubmit: SubmitHandler<PdcAction> = (data: PdcAction) => {
    if (data.action === PdcApprovalAction.APPROVE) {
      setConfirmTrainingModalIsOpen(true);
    } else {
      setConfirmTrainingModalIsOpen(true);
    }
  };

  //close confirmation modal
  const closeConfirmationModal = async () => {
    setConfirmTrainingModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  // Define table columns
  const columnHelper = createColumnHelper<NominatedEmployees>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      // enableColumnFilter: false,
      cell: (info) => UseRenderTrainingNomineeStatus(info.getValue(), TextSize.TEXT_SM),
    }),
    columnHelper.accessor('remarks', {
      header: 'Remarks',
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),
  ];

  // React Table initialization
  // list of submitted nominated employees
  const { table: submittedNominations } = useDataTable(
    {
      columns: columns,
      data: individualTrainingDetails.nominees,
    },
    ApprovalType.NOMINEE_STATUS
  );

  const trainingDetailsUrl = `${process.env.NEXT_PUBLIC_LMS}/api/lms/v1/training/${individualTrainingDetails?.trainingId}`;

  const {
    data: swrTrainingDetails,
    isLoading: swrTrainingDetailsIsLoading,
    error: swrTrainingDetailsError,
    mutate: mutateTrainingDetails,
  } = useSWR(individualTrainingDetails.trainingId ? trainingDetailsUrl : null, fetchWithToken);

  // Initial zustand state update
  useEffect(() => {
    if (swrTrainingDetailsIsLoading) {
      getTrainingDetails(swrTrainingDetailsIsLoading);
    }
  }, [swrTrainingDetailsIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrTrainingDetails)) {
      getTrainingDetailsSuccess(swrTrainingDetailsIsLoading, swrTrainingDetails);
    }

    if (!isEmpty(swrTrainingDetailsError)) {
      getTrainingDetailsFail(swrTrainingDetailsIsLoading, swrTrainingDetailsError.message);
    }
  }, [swrTrainingDetails, swrTrainingDetailsError]);

  const openTrainingDesignModal = () => {
    setTrainingDesignModalIsOpen(true);
  };

  const closeTrainingDesignModal = () => {
    setTrainingDesignModalIsOpen(false);
  };
  const client = useLnd();

  // Initial zustand state update
  useEffect(() => {
    if (trainingDetails && trainingDetails?.source?.name === 'External') {
      const getBucketList = async () => {
        const storage = new Storage(client!);
        const getBucketListFiles = await axios.get(
          `${process.env.NEXT_PUBLIC_LND_FE_URL}/api/bucket/lnd?id=${individualTrainingDetails?.trainingId}`,
          { withCredentials: true }
        );

        if (getBucketListFiles.data.files.length > 0) {
          const newBucketFiles = Promise.all(
            getBucketListFiles.data.files.map(async (file: any) => {
              const fileDetails = await storage.getFile(individualTrainingDetails?.trainingId!, file.$id);
              const filePreview = storage.getFilePreview(individualTrainingDetails?.trainingId!, file.$id);
              const fileView = storage.getFileView(individualTrainingDetails?.trainingId!, file.$id);

              return {
                id: file.$id,
                name: fileDetails.name,
                href: fileView.href,
                fileLink: fileView.href,
                sizeOriginal: convertSize(fileDetails.sizeOriginal, 'KB', { stringify: true }),
                mimeType: fileDetails.mimeType,
              };
            })
          );
          setBucketFiles(await newBucketFiles);
          return await newBucketFiles;
        } else setBucketFiles([]);
      };
      getBucketList();
    }
  }, [trainingDetails?.source?.name]);

  // const bucketFilesUrl = `${process.env.NEXT_PUBLIC_LND_FE_URL}/api/bucket/lnd?id=${individualTrainingDetails?.trainingId}`;

  // const {
  //   data: swrBucketFiles,
  //   isLoading: swrBucketFilesLoading,
  //   error: swrBucketFilesError,
  //   mutate: mutateBucketFiles,
  // } = useSWR(
  //   trainingDetails?.source?.name === 'External' && individualTrainingDetails.trainingId ? bucketFilesUrl : null,
  //   fetchWithToken
  // );

  // // Initial zustand state update
  // useEffect(() => {
  //   if (swrBucketFilesLoading) {
  //     getBucketFiles(swrBucketFilesLoading);
  //   }
  // }, [swrBucketFilesLoading]);

  // // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrBucketFiles)) {
  //     getBucketFilesSuccess(swrBucketFilesLoading, swrBucketFiles);
  //   }

  //   if (!isEmpty(swrBucketFilesError)) {
  //     getBucketFilesFail(swrBucketFilesLoading, swrBucketFilesError.message);
  //   }
  // }, [swrBucketFiles, swrBucketFilesError]);

  return (
    <>
      {!isEmpty(errorTrainingDetails) && modalState ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorTrainingDetails}: Failed to load Training Details.`}
        />
      ) : null}

      {!isEmpty(errorBucketFiles) && modalState ? (
        <ToastNotification toastType="error" notifMessage={`${errorBucketFiles}: Failed to load attached files.`} />
      ) : null}

      <TrainingDesignModal
        id={trainingDetails?.trainingDesign?.id}
        modalState={trainingDesignModalIsOpen}
        setModalState={setTrainingDesignModalIsOpen}
        closeModalAction={closeTrainingDesignModal}
      />

      <Modal size={windowWidth > 1024 ? 'md' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Training Details</span>
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
          <div className="w-full h-full flex flex-col gap-2">
            <div className="w-full flex flex-col gap-2 px-4 rounded">
              {/* loading post reponse */}
              {loadingResponse ? (
                <AlertNotification
                  logo={<LoadingSpinner size="xs" />}
                  alertType="info"
                  notifMessage="Submitting Request"
                  dismissible={false}
                />
              ) : null}

              <AlertNotification
                alertType={
                  individualTrainingDetails.status === TrainingStatus.ON_GOING_NOMINATION
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.NOMINATION_DONE
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_APPROVAL
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                    ? 'error'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED
                    ? 'error'
                    : individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.GM_DECLINED
                    ? 'error'
                    : individualTrainingDetails.status === TrainingStatus.FOR_BATCHING
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.DONE_BATCHING
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.UPCOMING
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.ON_GOING_TRAINING
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.REQUIREMENTS_SUBMISSION
                    ? 'info'
                    : individualTrainingDetails.status === TrainingStatus.PENDING
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.COMPLETED
                    ? 'success'
                    : 'info'
                }
                notifMessage={
                  individualTrainingDetails.status === TrainingStatus.ON_GOING_NOMINATION
                    ? 'On Going Nomination'
                    : individualTrainingDetails.status === TrainingStatus.NOMINATION_DONE
                    ? 'Nomination Done'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_APPROVAL
                    ? 'For PDC Secretary Review'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
                    ? 'For PDC Chairman Review'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                    ? 'Disapproved by PDC Chairman'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED
                    ? 'Disapproved by PDC Secretary'
                    : individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
                    ? 'For General Manager Review'
                    : individualTrainingDetails.status === TrainingStatus.GM_DECLINED
                    ? 'Disapproved by General Manager'
                    : individualTrainingDetails.status === TrainingStatus.FOR_BATCHING
                    ? 'On Going Batching'
                    : individualTrainingDetails.status === TrainingStatus.DONE_BATCHING
                    ? 'Done Batching'
                    : individualTrainingDetails.status === TrainingStatus.UPCOMING
                    ? 'Upcoming'
                    : individualTrainingDetails.status === TrainingStatus.ON_GOING_TRAINING
                    ? 'On Going Training'
                    : individualTrainingDetails.status === TrainingStatus.REQUIREMENTS_SUBMISSION
                    ? 'For Requirements Submission'
                    : individualTrainingDetails.status === TrainingStatus.PENDING
                    ? 'Pending'
                    : individualTrainingDetails.status === TrainingStatus.COMPLETED
                    ? 'Completed'
                    : individualTrainingDetails.status
                }
                dismissible={false}
              />

              <div className="flex flex-col gap-2 px-2 py-4 text-sm text-gray-700 rounded bg-white">
                <div className="flex items-center justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  {trainingDetails?.source?.name === 'Internal' ? (
                    <button
                      className="border-none bg-transparent cursor-pointer text-left"
                      onClick={openTrainingDesignModal}
                    >
                      <span className="underline">{trainingDetails?.courseTitle}</span>
                    </button>
                  ) : (
                    <span>{trainingDetails?.courseTitle}</span>
                  )}
                </div>
                <div className="flex flex-col items-start justify-center gap-1">
                  <div className="flex gap-2">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                      <path d="M7 18H17V16H7V18Z" fill="currentColor" />
                      <path d="M17 14H7V12H17V14Z" fill="currentColor" />
                      <path d="M7 10H11V8H7V10Z" fill="currentColor" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Course Content</span>
                  </div>
                  <div className="flex flex-col">
                    {trainingDetails?.courseContent &&
                      trainingDetails?.courseContent.map((content, idx) => {
                        return (
                          <div key={idx} className="flex gap-2 pl-8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            <span className="text-indigo-500">{content.title}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {trainingDetails?.source?.name === 'External' && bucketFiles && bucketFiles.length > 0 && (
                  <div className="flex items-start justify-start gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14 0C16.7614 0 19 2.23858 19 5V17C19 20.866 15.866 24 12 24C8.13401 24 5 20.866 5 17V9H7V17C7 19.7614 9.23858 22 12 22C14.7614 22 17 19.7614 17 17V5C17 3.34315 15.6569 2 14 2C12.3431 2 11 3.34315 11 5V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V6H15V17C15 18.6569 13.6569 20 12 20C10.3431 20 9 18.6569 9 17V5C9 2.23858 11.2386 0 14 0Z"
                        fill="currentColor"
                      />
                    </svg>

                    {bucketFiles && (
                      <Disclosure>
                        {({ open }) => (
                          <div>
                            <Disclosure.Button
                              className="flex items-center justify-between w-full transition-all "
                              tabIndex={-1}
                            >
                              <div className="text-indigo-500 ">
                                {bucketFiles?.length}{' '}
                                {bucketFiles?.length > 1
                                  ? 'attached training design files'
                                  : bucketFiles?.length === 1
                                  ? 'attached training design file'
                                  : null}
                              </div>
                            </Disclosure.Button>

                            <Disclosure.Panel className="" as="ul">
                              {bucketFiles &&
                                bucketFiles.map((file, idx) => {
                                  return (
                                    <div key={idx} className="pb-1 pl-5">
                                      <span className="text-xs">{idx + 1}. </span>
                                      <Link href={file.href} target="_blank">
                                        <span className="text-xs text-zinc-500 hover:text-indigo-700 active:text-indigo-800 ">
                                          {file.name}
                                        </span>
                                      </Link>
                                    </div>
                                  );
                                })}
                            </Disclosure.Panel>
                          </div>
                        )}
                      </Disclosure>
                    )}
                  </div>
                )}

                <div className="flex items-center capitalize justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                    />
                  </svg>
                  {trainingDetails?.type} Training
                </div>
                <div className="flex items-center justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  {trainingDetails?.trainingTags?.map((tag) => {
                    return (
                      <span key={tag.id} className="px-2 text-white bg-pink-400 rounded">
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                  {trainingDetails?.trainingLspDetails?.map((faci) => {
                    return (
                      <span key={faci.id} className="px-2 text-white rounded bg-zinc-500">
                        {faci.name}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                  No. of participants: <span className="text-indigo-500">{trainingDetails?.numberOfParticipants}</span>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>
                  <div className="flex gap-4">
                    <div>
                      {!isEmpty(trainingDetails?.trainingStart) ? 'From: ' : 'Date: '}{' '}
                      <span className="text-indigo-500">
                        {!isEmpty(trainingDetails?.trainingStart)
                          ? dayjs(trainingDetails?.trainingStart).format('MMMM DD, YYYY')
                          : null}
                      </span>
                    </div>
                    <div>
                      {!isEmpty(trainingDetails?.trainingEnd) ? 'To: ' : null}{' '}
                      <span className="text-indigo-500">
                        {!isEmpty(trainingDetails?.trainingEnd)
                          ? dayjs(trainingDetails?.trainingEnd).format('MMMM DD, YYYY')
                          : null}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-6 h-6 bi bi-hourglass"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702c0 .7-.478 1.235-1.011 1.491A3.5 3.5 0 0 0 4.5 13v1h7v-1a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351v-.702c0-.7.478-1.235 1.011-1.491A3.5 3.5 0 0 0 11.5 3V2h-7z" />{' '}
                  </svg>
                  <span className="text-indigo-500">{trainingDetails?.numberOfHours}</span>
                  {trainingDetails?.numberOfHours && trainingDetails?.numberOfHours > 1
                    ? 'hours in total'
                    : 'hour in total'}
                </div>
                <div className="flex items-center justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  {trainingDetails?.location}
                </div>

                <div className="flex items-start justify-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                    />
                  </svg>

                  <div>
                    <div className="pb-1">Training Requirements</div>
                    {trainingDetails?.trainingRequirements &&
                      trainingDetails?.trainingRequirements?.map((req: TrainingRequirement, idx) => {
                        return (
                          <div key={idx} className="flex w-full gap-2 pl-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>

                            <span className="text-indigo-500">{req.document}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
                {/* Prepared By */}
                <div className="flex items-center justify-start gap-2">
                  <HiArrowCircleRight className="h-6 w-6 text-gray-600" /> Prepared by{' '}
                  <span className="text-indigo-500">{trainingDetails?.preparedBy?.name}</span>
                </div>
              </div>

              <div className="flex flex-row md:gap-2 justify-between items-start md:items-start pt-2">
                <label className="text-slate-500 text-md whitespace-nowrap sm:w-80">Participants:</label>
              </div>

              {(employeeDetail.employmentDetails.isPdcSecretariat ||
                employeeDetail.employmentDetails.isPdcChairman ||
                isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
              individualTrainingDetails.status != TrainingStatus.ON_GOING_NOMINATION &&
              individualTrainingDetails.status != TrainingStatus.NOMINATION_DONE &&
              individualTrainingDetails.status != TrainingStatus.PENDING ? (
                <DataTablePortal
                  textSize={'text-md'}
                  model={submittedNominations}
                  showGlobalFilter={false}
                  showColumnFilter={false}
                  paginate={true}
                />
              ) : null}

              {individualTrainingDetails.status === TrainingStatus.GM_DECLINED ||
              individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED ||
              individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED ? (
                <>
                  <div className="flex flex-row items-center justify-between w-full pt-1">
                    <label className="text-md font-medium text-slate-500 whitespace-nowrap">
                      {individualTrainingDetails.status === TrainingStatus.GM_DECLINED
                        ? 'Remarks by General Manager:'
                        : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                        ? 'Remarks by PDC Chairman:'
                        : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED
                        ? 'Remarks by PDC Secretary:'
                        : 'Remarks:'}
                    </label>
                  </div>
                  <textarea
                    disabled
                    rows={2}
                    className="w-full p-2 text-md rounded resize-none text-slate-500 border-slate-300"
                    value={individualTrainingDetails.remarks ?? 'None'}
                  ></textarea>
                </>
              ) : null}

              {(employeeDetail.employmentDetails.isPdcSecretariat &&
                individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_APPROVAL) ||
              (employeeDetail.employmentDetails.isPdcChairman &&
                individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL) ||
              ((isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
                individualTrainingDetails.status === TrainingStatus.GM_APPROVAL) ? (
                <form id="PdcAction" onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 justify-end items-start md:items-center pt-1 md:pt-2">
                    <span className="text-slate-500 text-md font-medium">Action:</span>

                    <select
                      id="action"
                      className="text-slate-500 h-12 w-full md:w-40 rounded text-md border-slate-300"
                      required
                      {...register('action')}
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

                  {watch('action') === PdcApprovalAction.DISAPPROVE ? (
                    <textarea
                      required={true}
                      className={'resize-none mt-4 w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                      placeholder="Enter Reason for Disapproval"
                      rows={3}
                      onChange={(e) => setReason(e.target.value as unknown as string)}
                    ></textarea>
                  ) : null}
                </form>
              ) : null}
            </div>
          </div>

          <CaptchaModal
            modalState={captchaPdcModalIsOpen}
            setModalState={setCaptchaPdcModalIsOpen}
            title={'TRAINING APPROVAL CAPTCHA'}
          >
            {/* contents */}
            <ApprovalCaptcha
              employeeId={employeeDetail.user._id}
              action={PdcApprovalAction.APPROVE}
              tokenId={individualTrainingDetails.trainingId}
              captchaName={`${
                employeeDetail.employmentDetails.isPdcSecretariat
                  ? 'pdcSecretariatApproval'
                  : employeeDetail.employmentDetails.isPdcChairman &&
                    !isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) &&
                    !isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)
                  ? 'pdcChairmanApproval'
                  : !employeeDetail.employmentDetails.isPdcChairman &&
                    (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                      isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER))
                  ? 'pdcGeneralManagerApproval'
                  : employeeDetail.employmentDetails.isPdcChairman &&
                    (isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                      isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER))
                  ? 'pdcGmAndChairmanApproval'
                  : 'N/A'
              }`}
            />
          </CaptchaModal>

          <ConfirmationPdcModal
            modalState={confirmTrainingModalIsOpen}
            setModalState={setConfirmTrainingModalIsOpen}
            closeModalAction={closeConfirmationModal}
            action={watch('action')}
            remarks={reason}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="max-w-auto">
              {(employeeDetail.employmentDetails.isPdcSecretariat &&
                individualTrainingDetails.status == TrainingStatus.PDC_SECRETARIAT_APPROVAL) ||
              (employeeDetail.employmentDetails.isPdcChairman &&
                individualTrainingDetails.status == TrainingStatus.PDC_CHAIRMAN_APPROVAL) ||
              ((isEqual(employeeDetail.employmentDetails.userRole, UserRole.GENERAL_MANAGER) ||
                isEqual(employeeDetail.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)) &&
                individualTrainingDetails.status == TrainingStatus.GM_APPROVAL) ? (
                <Button form={`PdcAction`} variant={'primary'} size={'md'} loading={false} type="submit">
                  Submit
                </Button>
              ) : (
                <Button variant={'default'} size={'md'} loading={false} type="submit" onClick={closeModalAction}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainingDetailsModal;
