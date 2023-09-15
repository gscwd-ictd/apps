/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import { LabelInput } from 'libs/oneui/src/components/Inputs/LabelInput';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeSupervisorAccomplishmentModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeDetails,
    confirmOvertimeAccomplishmentModalIsOpen,
    pendingOvertimeAccomplishmentModalIsOpen,
    setConfirmOvertimeAccomplishmentModalIsOpen,
  } = useOvertimeAccomplishmentStore((state) => ({
    overtimeDetails: state.overtimeDetails,
    confirmOvertimeAccomplishmentModalIsOpen: state.confirmOvertimeAccomplishmentModalIsOpen,
    pendingOvertimeAccomplishmentModalIsOpen: state.pendingOvertimeAccomplishmentModalIsOpen,
    setConfirmOvertimeAccomplishmentModalIsOpen: state.setConfirmOvertimeAccomplishmentModalIsOpen,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const { windowWidth } = UseWindowDimensions();

  const closeConfirmOvertimeAccomplishmentModal = async () => {
    setConfirmOvertimeAccomplishmentModalIsOpen(false);
  };

  const {
    setValue,
    register,
    trigger,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isValid },
  } = useForm<any>({
    // resolver: yupResolver(OfficeSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    reset();
  }, [pendingOvertimeAccomplishmentModalIsOpen]);

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'lg' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Accomplishment Report</span>
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
          {!overtimeDetails ? (
            <>
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col  ">
              <div className="w-full h-full flex flex-col gap-2 ">
                <div className="w-full flex flex-col gap-2 p-4 rounded">
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Name:</label>

                      <div className="md:w-1/2">
                        <label className="text-slate-500 w-full text-md ">{'Test Name'}</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">IVMS In & Out:</label>

                      <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'ivmsTimeIn'}
                            type="time"
                            label={''}
                            className="w-full  text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            controller={{
                              ...register('ivmsTimeIn', {
                                value: '17:00:00',
                                onChange: (e) => {
                                  setValue('ivmsTimeIn', e.target.value, {
                                    shouldValidate: true,
                                  });
                                  trigger(); // triggers all validations for inputs
                                },
                              }),
                            }}
                          />
                        </label>
                        <label className="text-slate-500 w-auto text-lg">-</label>
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'ivmsTimeOut'}
                            type="time"
                            label={''}
                            className="w-full text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            controller={{
                              ...register('ivmsTimeOut', {
                                value: '19:00:00',
                                onChange: (e) => {
                                  setValue('ivmsTimeOut', e.target.value, {
                                    shouldValidate: true,
                                  });
                                  trigger(); // triggers all validations for inputs
                                },
                              }),
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                        Encode Time In & Out:
                      </label>

                      <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'encodeTimeIn'}
                            type="time"
                            label={''}
                            className="w-full  text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            controller={{
                              value: '17:00:00',
                              ...register('encodeTimeIn', {
                                onChange: (e) => {
                                  setValue('encodeTimeIn', e.target.value, {
                                    shouldValidate: true,
                                  });
                                  trigger(); // triggers all validations for inputs
                                },
                              }),
                            }}
                          />
                        </label>
                        <label className="text-slate-500 w-auto text-lg">-</label>
                        <label className="text-slate-500 w-full text-md ">
                          <LabelInput
                            id={'encodeTimeOut'}
                            type="time"
                            label={''}
                            className="w-full text-slate-400 font-medium"
                            textSize="md"
                            disabled
                            controller={{
                              value: '19:00:00',
                              ...register('encodeTimeOut', {
                                onChange: (e) => {
                                  setValue('encodeTimeOut', e.target.value, {
                                    shouldValidate: true,
                                  });
                                  trigger(); // triggers all validations for inputs
                                },
                              }),
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex flex-row justify-between items-center w-full">
                      <label className="text-slate-500 text-md font-medium whitespace-nowrap">Accomplishment:</label>
                    </div>
                    <textarea
                      required
                      rows={3}
                      className="resize-none w-full p-2 mt-1 rounded text-slate-500 text-md border-slate-300"
                      placeholder="Accomplishments"
                      {...register('accomplishments')}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => closeModalAction()} type="submit">
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OvertimeSupervisorAccomplishmentModal;
