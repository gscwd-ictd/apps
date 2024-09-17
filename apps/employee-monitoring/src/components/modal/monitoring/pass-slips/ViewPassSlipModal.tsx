/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import { NatureOfBusiness, PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { HrmoApprovalPassSlip, PassSlip } from 'libs/utils/src/lib/types/pass-slip.type';
import Image from 'next/image';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { LabelValue } from '../../../labels/LabelValue';
import UseRenderPassSlipStatus from 'apps/employee-monitoring/src/utils/functions/RenderPassSlipStatus';
import { SelectListRF } from '../../../inputs/SelectListRF';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { LabelInput } from '../../../inputs/LabelInput';
import { usePassSlipStore } from 'apps/employee-monitoring/src/store/pass-slip.store';
import PassSlipConfirmModal from './PassSlipConfirmModal';
import { isEmpty } from 'lodash';
import UseConvertDayToTime from 'apps/employee-monitoring/src/utils/functions/ConvertDateToTime';
import { DateTimeFormatter } from 'libs/utils/src/lib/functions/DateTimeFormatter';
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

const actionTaken: Array<SelectOption> = [
  { label: 'Approve', value: 'for supervisor approval' },
  { label: 'Disapprove', value: 'disapproved by hrmo' },
];

const awaitingMedicalCertificate: Array<SelectOption> = [
  { label: 'Approved with Medical Certificate', value: 'approved with medical certificate' },
  { label: 'Approved without Medical Certificate', value: 'approved without medical certificate' },
];

type ViewPassSlipModalProps = {
  rowData: PassSlip;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// yup error handling initialization
const passSlipApprovalSchema = yup.object({
  status: yup.string().required('Please select a action for this pass slip'),
  hrmoDisapprovalRemarks: yup.string().when('status', {
    is: 'disapproved by hrmo',
    then: yup.string().required('Please add disapproval remarks'),
  }),
});

const passSlipMedicalPurposeSchema = yup.object({
  status: yup.string().required('Please select approval for this pass slip'),
});

const ViewPassSlipModal: FunctionComponent<ViewPassSlipModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // state for current form data
  const [currentFormData, setCurrentFormData] = useState<HrmoApprovalPassSlip>({} as HrmoApprovalPassSlip);

  // Zustand store initialization
  const {
    ResponseHrmoApprovalPassSlip,
    ResponseUpdatePassSlipMedicalPurpose,

    UpdatePassSlipMedicalPurpose,
    UpdatePassSlipMedicalPurposeSuccess,
    UpdatePassSlipMedicalPurposeFail,

    EmptyErrorsAndResponse,
  } = usePassSlipStore((state) => ({
    ResponseHrmoApprovalPassSlip: state.response.hrmoApprovalPassSlip,
    ResponseUpdatePassSlipMedicalPurpose: state.response.updatePassSlip,

    UpdatePassSlipMedicalPurpose: state.updatePassSlip,
    UpdatePassSlipMedicalPurposeSuccess: state.updatePassSlipSuccess,
    UpdatePassSlipMedicalPurposeFail: state.updatePassSlipFail,

    EmptyErrorsAndResponse: state.emptyErrorsAndResponse,
  }));

  // React hook form for pass slip approval
  const {
    reset: resetFormPassSlipApproval,
    register: registerFormPassSlipApproval,
    setValue: setValuePassSlipApproval,
    handleSubmit: handleSubmitPassSlipApproval,
    watch: watchPassSlipApproval,
    formState: { errors: errorsPassSlipApproval, isSubmitting: patchPassSlipApprovalFormLoading },
  } = useForm<HrmoApprovalPassSlip>({
    mode: 'onChange',
    defaultValues: {
      passSlipId: '',
      status: '',
    },
    resolver: yupResolver(passSlipApprovalSchema),
  });

  // React hook form for medical purpose
  const {
    reset: resetPassSlipMedicalPurpose,
    register: registerPassSlipMedicalPurpose,
    setValue: setValuePassSlipMedicalPurpose,
    handleSubmit: handleSubmitPassSlipMedicalPurpose,
    trigger: triggerPassSlipMedicalPurpose,
    formState: { errors: errorsPassSlipMedicalPurpose, isSubmitting: patchPassSlipMedicalPurposeFormLoading },
  } = useForm<Partial<HrmoApprovalPassSlip>>({
    mode: 'onSubmit',
    resolver: yupResolver(passSlipMedicalPurposeSchema),
  });

  // form submission for pass slip approval
  const onSubmitForApproval: SubmitHandler<HrmoApprovalPassSlip> = (data: HrmoApprovalPassSlip) => {
    EmptyErrorsAndResponse();
    openPassSlipConfirmModal(data);
  };

  // view pass slip confirm modal
  const [passSlipConfirmModalIsOpen, setPassSlipConfirmModalIsOpen] = useState<boolean>(false);
  const openPassSlipConfirmModal = (formData: HrmoApprovalPassSlip) => {
    setPassSlipConfirmModalIsOpen(true);
    setCurrentFormData(formData);
  };
  const closePassSlipConfirmModal = () => setPassSlipConfirmModalIsOpen(false);

  // form submission for pass slip (PB) with medical certificate
  const onSubmitForMedicalPurpose: SubmitHandler<Partial<HrmoApprovalPassSlip>> = async (
    data: Partial<HrmoApprovalPassSlip>
  ) => {
    const isValid = await triggerPassSlipMedicalPurpose();

    if (!isValid) {
      return;
    }

    const payload: Partial<HrmoApprovalPassSlip> = {
      passSlipId: rowData.id,
      status: data.status,
    };

    UpdatePassSlipMedicalPurpose();
    handleUpdatePassSlipMedicalPurpose(payload);
  };

  const handleUpdatePassSlipMedicalPurpose = async (data: Partial<HrmoApprovalPassSlip>) => {
    const { error, result } = await patchEmpMonitoring(`/pass-slip/`, data);
    setIsLoading(true);

    if (!error) {
      UpdatePassSlipMedicalPurposeSuccess(result);
      setIsLoading(false);
      resetPassSlipMedicalPurpose();
      closeModalAction();
    } else if (error) {
      UpdatePassSlipMedicalPurposeFail(result);
      setIsLoading(false);
    }
  };

  // if modal is closed reset values
  useEffect(() => {
    if (!modalState) {
      resetFormPassSlipApproval();
      resetPassSlipMedicalPurpose();
    } else {
      setValuePassSlipApproval('passSlipId', rowData.id);
      setValuePassSlipApproval('status', rowData.status);
      setValuePassSlipMedicalPurpose('passSlipId', rowData.id);
      setValuePassSlipMedicalPurpose('status', rowData.status);
    }
  }, [modalState]);

  // if success approval, close modal
  useEffect(() => {
    if (!isEmpty(ResponseHrmoApprovalPassSlip)) {
      closeModalAction();
      resetFormPassSlipApproval();
      resetPassSlipMedicalPurpose();
    }
  }, [ResponseHrmoApprovalPassSlip]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(ResponseHrmoApprovalPassSlip) ? (
        <ToastNotification toastType="success" notifMessage="Pass slip approval is successful" />
      ) : null}

      {!isEmpty(ResponseUpdatePassSlipMedicalPurpose) ? (
        <ToastNotification toastType="success" notifMessage="Pass slip approval for medical purpose is successful" />
      ) : null}

      <Modal open={modalState} setOpen={setModalState} size="md">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between text-2xl font-semibold text-black">
            <span className="px-5">Pass Slip Application</span>
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
          {isLoading || patchPassSlipMedicalPurposeFormLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}
          <div className="w-full min-h-[14rem]">
            <div className="flex flex-col w-full gap-4 px-2">
              <div className="flex flex-col gap-4 py-2 ">
                <div className="flex items-center gap-2 px-2">
                  {rowData.avatarUrl ? (
                    <div className="flex flex-wrap justify-center">
                      <div className="w-[6rem]">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_EMPLOYEE_AVATAR_URL}${rowData.avatarUrl}`}
                          width={100}
                          height={100}
                          alt="employee-photo"
                          className="h-auto max-w-full align-middle border-none rounded-full shadow"
                        />
                      </div>
                    </div>
                  ) : (
                    <i className="text-gray-400 text-8xl bx bxs-user-circle"></i>
                  )}

                  <div className="flex flex-col">
                    <div className="text-2xl font-semibold">{rowData.employeeName}</div>
                  </div>
                </div>

                <div className="grid px-5 mt-2 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2">
                  <div className="sm:order-1 md:order-1 lg:order-2">
                    <LabelValue
                      label="Pass Slip Date"
                      direction="top-to-bottom"
                      textSize="md"
                      value={DateTimeFormatter(rowData.createdAt, 'MMMM DD, YYYY hh:mm A')}
                    />
                  </div>

                  <div className="sm:order-1 md:order-1 lg:order-2">
                    <LabelValue
                      label="Status"
                      direction="top-to-bottom"
                      textSize="md"
                      value={rowData.status ? UseRenderPassSlipStatus(rowData.status, 'text-sm') : ''}
                    />
                  </div>
                </div>

                <hr />
                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <div className="pr-10">
                    <LabelValue
                      label="Assignment"
                      direction="top-to-bottom"
                      textSize="md"
                      value={rowData.assignmentName ? rowData.assignmentName : 'N/A'}
                    />
                  </div>
                  <LabelValue
                    label="Supervisor Name"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.supervisorName}
                  />
                </div>

                <hr />

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Nature of Business"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.natureOfBusiness}
                  />
                  <LabelValue
                    label="Estimated Hours"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.estimateHours}
                  />
                </div>

                <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                  <LabelValue
                    label="Mode of Transportation"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.obTransportation ?? 'N/A'}
                  />

                  <LabelValue
                    label="Purpose or Destination"
                    direction="top-to-bottom"
                    textSize="md"
                    value={rowData.purposeDestination}
                  />
                </div>

                {rowData.status === PassSlipStatus.FOR_HRMO_APPROVAL ||
                rowData.status === PassSlipStatus.FOR_SUPERVISOR_APPROVAL ||
                rowData.status === PassSlipStatus.DISAPPROVED ? null : (
                  <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Pass Slip Time Out"
                      direction="top-to-bottom"
                      textSize="md"
                      value={UseConvertDayToTime(rowData.timeOut) ?? '--'}
                    />

                    {rowData.natureOfBusiness === NatureOfBusiness.HALF_DAY ||
                    rowData.natureOfBusiness === NatureOfBusiness.UNDERTIME ? null : (
                      <LabelValue
                        label="Pass Slip Time In"
                        direction="top-to-bottom"
                        textSize="md"
                        value={UseConvertDayToTime(rowData.timeIn) ?? '--'}
                      />
                    )}
                  </div>
                )}

                {rowData.isMedical === true && rowData.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE ? (
                  //  && rowData.timeOut !== null
                  <div className="px-5">
                    <form
                      onSubmit={handleSubmitPassSlipMedicalPurpose(onSubmitForMedicalPurpose)}
                      id="approvePassSlipMedicalPurpose"
                    >
                      <div className="w-full pb-3">
                        <SelectListRF
                          id="status"
                          textSize="md"
                          selectList={awaitingMedicalCertificate}
                          controller={{ ...registerPassSlipMedicalPurpose('status') }}
                          errorMessage={errorsPassSlipMedicalPurpose.status?.message}
                          isError={errorsPassSlipMedicalPurpose.status ? true : false}
                          label="Approval for Medical Status"
                        />
                      </div>

                      {/* {watch('status') === 'disapproved by hrmo' && (
                        <div className="mb-6">
                          <LabelInput
                            id={'hrmoDisapprovalRemarks'}
                            label={'Remarks'}
                            controller={{ ...register('hrmoDisapprovalRemarks') }}
                            isError={errors.hrmoDisapprovalRemarks ? true : false}
                            errorMessage={errors.hrmoDisapprovalRemarks?.message}
                            textSize="md"
                          />
                        </div>
                      )} */}
                    </form>
                  </div>
                ) : null}

                {rowData.status === PassSlipStatus.FOR_HRMO_APPROVAL ? (
                  <>
                    <hr />
                    <form onSubmit={handleSubmitPassSlipApproval(onSubmitForApproval)} id="updatePassSlipForm">
                      <div className="w-full pb-3">
                        <SelectListRF
                          id="status"
                          textSize="md"
                          selectList={actionTaken}
                          controller={{ ...registerFormPassSlipApproval('status') }}
                          errorMessage={errorsPassSlipApproval.status?.message}
                          label="Action"
                        />
                      </div>

                      {watchPassSlipApproval('status') === 'disapproved by hrmo' && (
                        <div className="mb-6">
                          <LabelInput
                            id={'hrmoDisapprovalRemarks'}
                            label={'Remarks'}
                            controller={{ ...registerFormPassSlipApproval('hrmoDisapprovalRemarks') }}
                            isError={errorsPassSlipApproval.hrmoDisapprovalRemarks ? true : false}
                            errorMessage={errorsPassSlipApproval.hrmoDisapprovalRemarks?.message}
                            textSize="md"
                          />
                        </div>
                      )}
                    </form>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              className="px-3 w-[5rem] py-2 text-sm text-gray-700 bg-gray-50 border rounded hover:bg-gray-200 transition-all"
              onClick={closeModalAction}
              type="button"
            >
              Close
            </button>

            {rowData.status === PassSlipStatus.FOR_HRMO_APPROVAL && watchPassSlipApproval('status') !== '' && (
              <button
                className="px-3 w-[5rem] py-2 text-sm text-white bg-blue-400 hover:bg-blue-500 rounded"
                type="submit"
                form="updatePassSlipForm"
                disabled={patchPassSlipApprovalFormLoading ? true : false}
              >
                Submit
              </button>
            )}

            {rowData.isMedical === true && rowData.status === PassSlipStatus.AWAITING_MEDICAL_CERTIFICATE ? (
              // && rowData.timeOut !== null
              <button
                className="px-3 w-[5rem] py-2 text-sm text-white bg-blue-400 hover:bg-blue-500 rounded transition-all"
                type="submit"
                form="approvePassSlipMedicalPurpose"
                disabled={patchPassSlipMedicalPurposeFormLoading ? true : false}
              >
                Approve
              </button>
            ) : null}
          </div>
        </Modal.Footer>
      </Modal>

      <PassSlipConfirmModal
        modalState={passSlipConfirmModalIsOpen}
        setModalState={setPassSlipConfirmModalIsOpen}
        closeModalAction={closePassSlipConfirmModal}
        formData={currentFormData}
      />
    </>
  );
};

export default ViewPassSlipModal;
