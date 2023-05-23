/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PassSlipApplicationForm } from '../../../../../../libs/utils/src/lib/types/pass-slip.type';
import { postPortal } from '../../../../src/utils/helpers/portal-axios-helper';
import { HiX } from 'react-icons/hi';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { format } from 'date-fns';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

type PassSlipApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type Item = {
  label: string;
  value: any;
};

const natureOfBusiness: Array<SelectOption> = [
  { label: 'Personal Business', value: 'Personal Business' },
  { label: 'Half Day', value: 'Half Day' },
  { label: 'Undertime', value: 'Undertime' },
  { label: 'Official Business', value: 'Official Business' },
];

const obTransportation: Array<SelectOption> = [
  { label: 'Office Vehicle', value: 'Office Vehicle' },
  { label: 'Private/Personal Vehicle', value: 'Private/Personal Vehicle' },
  { label: 'Public Vehicle', value: 'Public Vehicle' },
];

export const PassSlipApplicationModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipApplicationModalProps) => {
  //get current date for dateOfApplication
  const today = new Date();
  const dateToday = format(today, 'yyyy-MM-dd');

  //zustand initialization to access employee store
  const { employeeDetails } = useEmployeeStore((state) => ({
    employeeDetails: state.employeeDetails,
  }));

  //zustand initialization to access pass slip store
  const {
    loadingResponse,

    postPassSlipList,
    postPassSlipListSuccess,
    postPassSlipListFail,
  } = usePassSlipStore((state) => ({
    loadingResponse: state.loading.loadingResponse,

    postPassSlipList: state.postPassSlipList,
    postPassSlipListSuccess: state.postPassSlipListSuccess,
    postPassSlipListFail: state.postPassSlipListFail,
  }));

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } =
    useForm<PassSlipApplicationForm>({
      mode: 'onChange',
      defaultValues: {
        employeeId: '',
        dateOfApplication: dateToday,
        natureOfBusiness: null,
        estimateHours: 0,
        purposeDestination: '',
        isCancelled: false,
        obTransportation: null,
      },
    });

  useEffect(() => {
    if (
      watch('natureOfBusiness') === 'Half Day' ||
      watch('natureOfBusiness') === 'Undertime'
    ) {
      setValue('estimateHours', 0);
    }

    if (watch('natureOfBusiness') !== 'Official Business') {
      setValue('obTransportation', null);
    }
    setValue('employeeId', employeeDetails.employmentDetails.userId);
  }, [watch('natureOfBusiness')]);

  const onSubmit: SubmitHandler<PassSlipApplicationForm> = (
    data: PassSlipApplicationForm
  ) => {
    handlePostResult(data);
    postPassSlipList();
  };

  const handlePostResult = async (data: PassSlipApplicationForm) => {
    const { error, result } = await postPortal('/v1/pass-slip', data);

    if (error) {
      postPassSlipListFail(result);
    } else {
      postPassSlipListSuccess(result);

      reset();
      closeModalAction();
    }
  };
  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal
        size={windowWidth > 1024 ? 'lg' : 'full'}
        open={modalState}
        setOpen={setModalState}
      >
        <Modal.Header>
          <h3 className="font-semibold text-2xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Pass Slip Authorization</span>
              <button
                className="hover:bg-slate-100 px-1 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          {/* Notifications */}
          {loadingResponse ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}
          <form id="ApplyPassSlipForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full h-full flex flex-col gap-2 ">
              <div className="w-full flex flex-col gap-2 p-4 rounded">
                <div className="w-full flex gap-2 justify-start items-center">
                  <span className="text-slate-500 text-lg font-medium">
                    Date:
                  </span>
                  <div className="text-slate-500 text-lg">{dateToday}</div>
                </div>

                <div className="flex gap-2 justify-between items-center">
                  <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                    Select Nature of Business:
                    <span className="text-red-600">*</span>
                  </label>

                  <div className="w-96">
                    <select
                      id="natureOfBusiness"
                      className="text-slate-500 h-12 w-96 rounded text-lg border-slate-300"
                      required
                      {...register('natureOfBusiness')}
                    >
                      <option value="" disabled>
                        Select Nature of Business
                      </option>
                      {natureOfBusiness.map((item: Item, idx: number) => (
                        <option value={item.value} key={idx}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {watch('natureOfBusiness') === 'Official Business' ? (
                  <>
                    <div className={`flex gap-3 justify-between items-center`}>
                      <label className="text-slate-500 text-lg whitespace-nowrap font-medium">
                        Select Mode of Transportation:
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="w-96">
                        <select
                          id="obTransportation"
                          required
                          className="text-slate-500 h-12 w-96 rounded text-lg border-slate-300"
                          {...register('obTransportation')}
                        >
                          <option value="" disabled>
                            Select Mode of Transportation
                          </option>
                          {obTransportation.map((item: Item, idx: number) => (
                            <option value={item.value} key={idx}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : null}

                {watch('natureOfBusiness') !== 'Half Day' &&
                watch('natureOfBusiness') !== 'Undertime' &&
                watch('natureOfBusiness') ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2 justify-between items-center">
                        <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                          Estimated Hours:
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="w-96">
                          <input
                            type="number"
                            name="passSlip_estimatedHours"
                            id="estimateHours"
                            className="border-slate-300 text-slate-500 h-12 text-lg w-96 rounded"
                            placeholder="Enter number of hours "
                            required
                            defaultValue={0}
                            max="8"
                            min={
                              watch('natureOfBusiness') != 'Half Day' &&
                              watch('natureOfBusiness') != 'Undertime'
                                ? '1'
                                : '0'
                            }
                            {...register('estimateHours')}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}

                {watch('natureOfBusiness') ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-500 text-lg font-medium">
                        Purpose/Desination:
                        <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder={`Enter Purpose of Pass Slip`}
                        name="passSlip_purpose"
                        id="purposeDestination"
                        className="resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300"
                        required
                        {...register('purposeDestination')}
                      ></textarea>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                // onClick={(e) => modalAction(e)}
                form="ApplyPassSlipForm"
                type="submit"
              >
                Apply Pass Slip
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PassSlipApplicationModal;
