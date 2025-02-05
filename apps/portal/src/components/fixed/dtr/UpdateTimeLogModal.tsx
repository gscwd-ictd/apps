import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { LabelValue } from 'apps/employee-monitoring/src/components/labels/LabelValue';
import dayjs from 'dayjs';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';
import { isEmpty } from 'lodash';
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OfficeSchema } from './OfficeSchema';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { HiX } from 'react-icons/hi';
import { EmployeeDtr, useDtrStore } from 'apps/portal/src/store/dtr.store';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { ConfirmationUpdateTimeLogModal } from './ConfirmationModal';
import { DtrCorrectionStatus } from 'libs/utils/src/lib/enums/dtr.enum';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';

type EditDailySchedModalProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: EmployeeDtrWithSchedule; // TBD
};

type TimeLogRemarks = {
  remarks: string;
};

const UpdateTimeLogModal: FunctionComponent<EditDailySchedModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const {
    watch,
    setValue,
    register,
    trigger,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isValid },
  } = useForm<EmployeeDtr & TimeLogRemarks>({
    resolver: yupResolver(OfficeSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  // default values
  const [defaultDtrValues, setDefaultDtrValues] = useState<EmployeeDtr & TimeLogRemarks>(
    {} as EmployeeDtr & TimeLogRemarks
  );

  const closeModal = () => {
    reset();
    closeModalAction();
  };

  // removes the seconds and returns 24H format
  const removeSeconds = (value: string | null) => {
    if (isEmpty(value)) return null;
    else return dayjs(rowData.dtr.dtrDate + ' ' + value).format('HH:mm');
  };

  const { confirmUpdateModalIsOpen, setConfirmUpdateModalIsOpen } = useDtrStore((state) => ({
    confirmUpdateModalIsOpen: state.confirmUpdateModalIsOpen,
    setConfirmUpdateModalIsOpen: state.setConfirmUpdateModalIsOpen,
  }));

  const onSubmit = async (data: Partial<EmployeeDtr>) => {
    setConfirmUpdateModalIsOpen(true);
  };

  const setDefaultValues = (rowData: EmployeeDtrWithSchedule, remarks: string) => {
    reset({
      dtrId: rowData?.dtr?.id,
      companyId: rowData?.companyId,
      dtrDate: rowData?.day,
      timeIn: removeSeconds(rowData?.dtr?.timeIn),
      lunchIn: removeSeconds(rowData?.dtr?.lunchIn),
      lunchOut: removeSeconds(rowData?.dtr?.lunchOut),
      timeOut: removeSeconds(rowData?.dtr?.timeOut),
      withLunch: true,
      shift: rowData?.schedule?.shift,
      remarks: remarks,
    });

    setDefaultDtrValues({
      dtrId: rowData?.dtr?.id,
      companyId: rowData?.companyId,
      dtrDate: rowData?.day,
      timeIn: removeSeconds(rowData?.dtr?.timeIn),
      lunchIn: removeSeconds(rowData?.dtr?.lunchIn),
      lunchOut: removeSeconds(rowData?.dtr?.lunchOut),
      timeOut: removeSeconds(rowData?.dtr?.timeOut),
      withLunch: true,
      shift: rowData?.schedule?.shift,
      remarks: remarks,
    });

    setValue('dtrId', rowData?.dtr?.id);
    setValue('companyId', employeeDetails?.employmentDetails?.companyId);
    setValue('dtrDate', rowData?.day);
    setValue('timeIn', removeSeconds(rowData?.dtr?.timeIn));
    setValue('timeOut', removeSeconds(rowData?.dtr?.timeOut));
    setValue('lunchIn', removeSeconds(rowData?.dtr?.lunchIn));
    setValue('lunchOut', removeSeconds(rowData?.dtr?.lunchOut));
    setValue('withLunch', true);
    setValue('shift', rowData?.schedule?.shift);
    setValue('remarks', remarks);
  };

  useEffect(() => {
    if (modalState) {
      setDefaultValues(rowData, '');
    }
  }, [modalState]);

  // cancel action for Confirmation Application Modal
  const closeConfirmationModal = async () => {
    setConfirmUpdateModalIsOpen(false);
  };
  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <ConfirmationUpdateTimeLogModal
        modalState={confirmUpdateModalIsOpen}
        setModalState={setConfirmUpdateModalIsOpen}
        closeModalAction={closeConfirmationModal}
        dataToSubmit={{
          dtrDate: watch('dtrDate'),
          companyId: watch('companyId'),
          dtrId: watch('dtrId'),
          timeIn: watch('timeIn'),
          timeOut: watch('timeOut'),
          lunchIn: watch('lunchIn'),
          lunchOut: watch('lunchOut'),
          remarks: watch('remarks'),
        }}
        title={'Time Log Correction'}
      />

      <Modal open={modalState} setOpen={setModalState} size={windowWidth > 1024 ? 'sm' : 'full'}>
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full pl-5">
            <span className="font-semibold text-xl">Time Log Correction</span>
            <button className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full" onClick={closeModal}>
              <HiX />
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="editEmployeeDtrModal">
            <div className="flex flex-col w-full gap-5 px-5">
              <div className="flex flex-col w-full gap-0">
                {/* <AlertNotification
                  alertType={'info'}
                  notifMessage={
                    'When submitting Time Log Corrections, the fields Time In, Time Out, and Reason are required to be filled out. Lunch Out and Lunch In fields are optional.'
                  }
                  dismissible={false}
                /> */}

                {!rowData?.hasPendingDtrCorrection &&
                rowData?.dtrCorrection?.status !== DtrCorrectionStatus.APPROVED ? (
                  <AlertNotification
                    alertType={'info'}
                    notifMessage={
                      'When submitting Time Log Corrections, the fields Time In, Time Out, and Reason are required to be filled out. Lunch Out and Lunch In fields are optional.'
                    }
                    dismissible={false}
                  />
                ) : null}

                {/* {!rowData?.dtr?.timeIn && !rowData?.dtr?.timeOut ? (
                  <AlertNotification
                    alertType={'info'}
                    notifMessage={
                      'Cannot request for Time Log Correction since no Time In and Time Out logs were found.'
                    }
                    dismissible={false}
                  />
                ) : null} */}

                {rowData?.hasPendingDtrCorrection ? (
                  <AlertNotification
                    alertType={'warning'}
                    notifMessage={'You currently have a pending Time Log Correction application for this date.'}
                    dismissible={false}
                  />
                ) : null}

                {rowData?.dtrCorrection?.status === DtrCorrectionStatus.APPROVED ? (
                  <AlertNotification
                    alertType={'success'}
                    notifMessage={'Time Log Correction Approved.'}
                    dismissible={false}
                  />
                ) : null}

                {rowData?.dtrCorrection?.status === DtrCorrectionStatus.DISAPPROVED ? (
                  <AlertNotification
                    alertType={'error'}
                    notifMessage={'Time Log Correction Disapproved.'}
                    dismissible={false}
                  />
                ) : null}
              </div>

              <div className="">
                <LabelValue
                  label="Date"
                  value={DateFormatter(rowData.day, 'MMMM DD, YYYY')}
                  direction="top-to-bottom"
                  textSize="md"
                />
              </div>

              <hr />

              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 sm:pr-5 px-0.5 pb-3  ">
                  <div className="w-full ">
                    <LabelInput
                      textSize="sm"
                      required
                      id="timeIn"
                      label="Time In:"
                      step="any"
                      isDirty={dirtyFields.timeIn}
                      type="time"
                      controller={{
                        ...register('timeIn', {
                          onChange: (e) => {
                            setValue('timeIn', e.target.value, {
                              shouldValidate: true,
                            });
                            trigger(); // triggers all validations for inputs
                          },
                        }),
                      }}
                      isError={errors.timeIn ? true : false}
                      errorMessage={errors.timeIn?.message}
                      className={`
                        ${
                          dirtyFields.timeIn && !errors.timeIn
                            ? 'bg-green-300'
                            : errors.timeIn
                            ? 'bg-red-200'
                            : 'bg-inherit'
                        }
                      `}
                      disabled={rowData.dtr?.timeIn ? true : rowData?.dtrCorrection?.status ? true : false}
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 sm:pl-5 pb-3  ">
                  <div className="w-full">
                    <LabelInput
                      textSize="sm"
                      required={false}
                      id={'scheduleLunchOut'}
                      type="time"
                      label={'Lunch Out:'}
                      isDirty={dirtyFields.lunchOut}
                      controller={{
                        ...register('lunchOut', {
                          onChange: (e) => {
                            setValue('lunchOut', e.target.value, {
                              shouldValidate: true,
                            });
                            trigger(); // trigger all validations for inputs
                          },
                        }),
                      }}
                      isError={errors.lunchOut ? true : false}
                      errorMessage={errors.lunchOut?.message}
                      className={`
                        ${
                          dirtyFields.lunchOut && !errors.lunchOut
                            ? 'bg-green-300'
                            : errors.lunchOut
                            ? 'bg-red-200'
                            : 'bg-inherit'
                        }
                      `}
                      disabled={
                        getValues('withLunch') === true
                          ? rowData.dtr?.lunchOut
                            ? true
                            : rowData?.dtrCorrection?.status
                            ? true
                            : false
                          : true
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 sm:pr-5 pb-3  ">
                  <div className="w-full">
                    <LabelInput
                      textSize="sm"
                      required={false}
                      id={'scheduleLunchIn'}
                      type="time"
                      label={'Lunch In:'}
                      step="any"
                      isDirty={dirtyFields.lunchIn}
                      controller={{
                        ...register('lunchIn', {
                          onChange: (e) => {
                            setValue('lunchIn', e.target.value, {
                              shouldValidate: true,
                            });
                            trigger(); // trigger all validations for inputs
                          },
                        }),
                      }}
                      isError={errors.lunchIn ? true : false}
                      errorMessage={errors.lunchIn?.message}
                      className={`
                        ${
                          dirtyFields.lunchIn && !errors.lunchIn
                            ? 'bg-green-300'
                            : errors.lunchIn
                            ? 'bg-red-200'
                            : 'bg-inherit'
                        }
                      `}
                      disabled={
                        getValues('withLunch') === true
                          ? rowData.dtr?.lunchIn
                            ? true
                            : rowData?.dtrCorrection?.status
                            ? true
                            : false
                          : true
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 sm:pl-5 pb-3  ">
                  <div className="w-full">
                    <LabelInput
                      required
                      textSize="sm"
                      id="timeOut"
                      label="Time Out"
                      type="time"
                      isDirty={dirtyFields.timeOut}
                      step="any"
                      controller={{
                        ...register('timeOut', {
                          onChange: (e) => {
                            setValue('timeOut', e.target.value, {
                              shouldValidate: true,
                            });
                            trigger(); // trigger all validations for all inputs
                          },
                        }),
                      }}
                      isError={errors.timeOut ? true : false}
                      errorMessage={errors.timeOut?.message}
                      className={` 
                        ${
                          dirtyFields.timeOut && !errors.timeOut
                            ? 'bg-green-300'
                            : errors.timeOut
                            ? 'bg-red-200'
                            : 'bg-inherit'
                        }
                      `}
                      disabled={rowData?.dtr?.timeOut ? true : rowData?.dtrCorrection?.status ? true : false}
                    />
                  </div>
                </div>

                {rowData?.dtrCorrection?.status === DtrCorrectionStatus.DISAPPROVED ||
                rowData?.dtrCorrection?.status === DtrCorrectionStatus.PENDING ? (
                  <>
                    <hr className="w-full mt-2 mb-4"></hr>
                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 sm:pr-5 px-0.5 pb-3  ">
                      <div className="w-full ">
                        <LabelInput
                          textSize="sm"
                          required
                          id="updatedTimeIn"
                          label="Requested Time In Update:"
                          step="any"
                          type="time"
                          value={rowData?.dtrCorrection?.timeIn ?? ''}
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 sm:pl-5 pb-3  ">
                      <div className="w-full">
                        <LabelInput
                          textSize="sm"
                          required
                          id="updatedLunchOut"
                          label="Requested Lunch Out Update:"
                          step="any"
                          type="time"
                          value={rowData?.dtrCorrection?.lunchOut ?? ''}
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 sm:pr-5 pb-3  ">
                      <div className="w-full">
                        <LabelInput
                          textSize="sm"
                          required
                          id="updatedLunchIn"
                          label="Requested Lunch In Update:"
                          step="any"
                          type="time"
                          value={rowData?.dtrCorrection?.lunchIn ?? ''}
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 sm:pl-5 pb-3  ">
                      <div className="w-full">
                        <LabelInput
                          textSize="sm"
                          required
                          id="updatedTimeOut"
                          label="Requested Time Out Update:"
                          step="any"
                          type="time"
                          value={rowData?.dtrCorrection?.timeOut ?? ''}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                  {rowData?.dtrCorrection?.remarks ? (
                    <label className="font-medium text-gray-900 dark:text-gray-800 text-sm whitespace-nowrap pb-0.5 ">
                      Reason:
                    </label>
                  ) : null}

                  <div className="w-full">
                    {rowData?.dtrCorrection?.remarks ? (
                      <label className=" text-sm ml-5">{rowData?.dtrCorrection?.remarks ?? 'N/A'}</label>
                    ) : rowData?.dtr?.timeIn &&
                      rowData?.dtr?.lunchOut &&
                      rowData?.dtr?.lunchIn &&
                      rowData?.dtr?.timeOut ? null : (
                      <LabelInput
                        required
                        textSize="sm"
                        id="remarks"
                        label="Reason:"
                        type="textarea"
                        rows={3}
                        isDirty={dirtyFields.remarks}
                        step="any"
                        placeholder="Please enter reason for Time Log Correction"
                        controller={{
                          ...register('remarks', {
                            onChange: (e) => {
                              setValue('remarks', e.target.value, {
                                shouldValidate: true,
                              });
                              trigger(); // trigger all validations for all inputs
                            },
                          }),
                        }}
                        isError={errors.remarks ? true : false}
                        errorMessage={errors.remarks?.message}
                        className={`
                        ${
                          dirtyFields.remarks && !errors.remarks
                            ? 'bg-green-300'
                            : errors.remarks
                            ? 'bg-red-200'
                            : 'bg-inherit'
                        }
                      `}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="max-w-auto flex gap-2">
              {rowData?.hasPendingDtrCorrection ||
              (rowData?.dtr?.timeIn && rowData?.dtr?.lunchOut && rowData?.dtr?.lunchIn && rowData?.dtr?.timeOut) ||
              rowData?.dtrCorrection?.status === DtrCorrectionStatus.DISAPPROVED ? (
                <Button
                  variant={'default'}
                  size={'md'}
                  loading={false}
                  onClick={(e) => closeModalAction()}
                  type="submit"
                >
                  Close
                </Button>
              ) : (
                <Button
                  form="editEmployeeDtrModal"
                  variant={'primary'}
                  size={'md'}
                  loading={false}
                  type="submit"
                  disabled={
                    !watch('remarks') ||
                    !watch('timeIn') ||
                    !watch('timeOut') ||
                    // (!rowData?.dtr?.timeIn && !rowData?.dtr?.timeOut) ||
                    (watch('timeIn') === removeSeconds(rowData?.dtr?.timeIn) &&
                      watch('timeOut') === removeSeconds(rowData?.dtr?.timeOut) &&
                      watch('lunchOut') === removeSeconds(rowData?.dtr?.lunchOut) &&
                      watch('lunchIn') === removeSeconds(rowData?.dtr?.lunchIn))
                      ? true
                      : false
                  }
                >
                  Request Update
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateTimeLogModal;
