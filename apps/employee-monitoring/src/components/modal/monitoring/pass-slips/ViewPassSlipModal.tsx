/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
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
import { patchEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import PassSlipConfirmModal from './PassSlipConfirmModal';
import { isEmpty } from 'lodash';

const actionTaken: Array<SelectOption> = [
  { label: 'Approve', value: 'for supervisor approval' },
  { label: 'Disapprove', value: 'disapproved by hrmo' },
];

type ViewPassSlipModalProps = {
  rowData: PassSlip;
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// yup error handling initialization
const yupSchema = yup.object({
  status: yup.string().required('Please select a action for this pass slip'),
  hrmoDisapprovalRemarks: yup.string().when('status', {
    is: 'disapproved by hrmo',
    then: yup.string().required('Please add disapproval remarks'),
  }),
});

const ViewPassSlipModal: FunctionComponent<ViewPassSlipModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  // state for current form data
  const [currentFormData, setCurrentFormData] = useState<HrmoApprovalPassSlip>({} as HrmoApprovalPassSlip);

  // Zustand store initialization
  const {
    ResponseHrmoApprovalPassSlip,

    EmptyErrorsAndResponse,
  } = usePassSlipStore((state) => ({
    ResponseHrmoApprovalPassSlip: state.response.hrmoApprovalPassSlip,

    EmptyErrorsAndResponse: state.emptyErrorsAndResponse,
  }));

  // React hook form initialization
  const {
    reset,
    register,
    setValue,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isSubmitting: patchFormLoading },
  } = useForm<HrmoApprovalPassSlip>({
    mode: 'onChange',
    defaultValues: {
      passSlipId: '',
      status: '',
    },
    resolver: yupResolver(yupSchema),
  });

  // form submission
  const onSubmit: SubmitHandler<HrmoApprovalPassSlip> = (data: HrmoApprovalPassSlip) => {
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

  // set passSlipId in the form default values
  useEffect(() => {
    if (!modalState) {
      reset();
    } else {
      setValue('passSlipId', rowData.id);
    }
  }, [modalState]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(ResponseHrmoApprovalPassSlip) ? (
        <ToastNotification toastType="success" notifMessage="Pass slip approval is successful" />
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
          <div className="w-full min-h-[14rem]">
            <div className="flex flex-col w-full gap-4 px-2">
              <div className="flex flex-col gap-4 py-2 ">
                <div className="flex items-center gap-2 px-2">
                  {rowData.avatarUrl ? (
                    <div className="flex flex-wrap justify-center">
                      <div className="w-[6rem]">
                        <Image
                          src={rowData.avatarUrl}
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
                      value={dayjs(rowData.dateOfApplication).format('MMMM DD, YYYY')}
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
                rowData.status === PassSlipStatus.DISAPPROVED ||
                rowData.status === PassSlipStatus.APPROVED ? null : (
                  <div className="grid px-5 sm:grid-rows-2 sm:grid-cols-1 md:grid-rows-2 md:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 sm:gap-2 md:gap:2 lg:gap-0">
                    <LabelValue
                      label="Pass Slip Time Out"
                      direction="top-to-bottom"
                      textSize="md"
                      value={rowData.timeOut ?? 'N/A'}
                    />

                    {rowData.natureOfBusiness === NatureOfBusiness.HALF_DAY ||
                    rowData.natureOfBusiness === NatureOfBusiness.UNDERTIME ? null : (
                      <LabelValue
                        label="Pass Slip Time In"
                        direction="top-to-bottom"
                        textSize="md"
                        value={rowData.timeIn ?? 'N/A'}
                      />
                    )}
                  </div>
                )}

                {rowData.status === PassSlipStatus.FOR_HRMO_APPROVAL ? (
                  <>
                    <hr />
                    <form onSubmit={handleSubmit(onSubmit)} id="updatePassSlipForm">
                      <div className="w-full pb-3">
                        <SelectListRF
                          id="status"
                          textSize="md"
                          selectList={actionTaken}
                          controller={{ ...register('status') }}
                          errorMessage={errors.status?.message}
                          label="Action"
                        />
                      </div>

                      {watch('status') === 'disapproved by hrmo' && (
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
              className="px-3 w-[5rem] py-2 text-sm text-gray-700 bg-gray-50 border rounded"
              onClick={closeModalAction}
              type="button"
            >
              Close
            </button>

            {rowData.status === PassSlipStatus.FOR_HRMO_APPROVAL && watch('status') !== '' && (
              <button
                className="px-3 w-[5rem] py-2 text-sm text-white bg-blue-400 hover:bg-blue-500 rounded"
                type="submit"
                form="updatePassSlipForm"
                disabled={patchFormLoading ? true : false}
              >
                Submit
              </button>
            )}
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
