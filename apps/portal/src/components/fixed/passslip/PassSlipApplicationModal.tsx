import { useEffect, useState } from 'react';
import { withSession } from '../../../utils/helpers/session';
import { Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { isEmpty, values } from 'lodash';
import { applyPassSlip } from '../../../../src/utils/helpers/passslip-requests';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PassSlip } from '../../../../src/types/passslip.type';
import { postPortal } from '../../../../src/utils/helpers/portal-axios-helper';
import { HiX } from 'react-icons/hi';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { format } from 'date-fns';

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

  //zustand initialization to access pass slip store
  const {
    passSlipToSubmit,
    setEmployeeId,
    setDateOfApplication,
    setNatureOfBusiness,
    setEstimateHours,
    setPurposeDestination,
    setIsCancelled,
    setObTransportation,
    applyPassSlipModalIsOpen,
    setApplyPassSlipModalIsOpen,
  } = usePassSlipStore((state) => ({
    passSlipToSubmit: state.passSlipToSubmit,
    setEmployeeId: state.setEmployeeId,
    setDateOfApplication: state.setDateOfApplication,
    setNatureOfBusiness: state.setNatureOfBusiness,
    setEstimateHours: state.setEstimateHours,
    setPurposeDestination: state.setPurposeDestination,
    setIsCancelled: state.setIsCancelled,
    setObTransportation: state.setObTransportation,
    applyPassSlipModalIsOpen: state.applyPassSlipModalIsOpen,
    setApplyPassSlipModalIsOpen: state.setApplyPassSlipModalIsOpen,
  }));

  //zustand initialization to access employee store
  const { employeeDetails } = useEmployeeStore((state) => ({
    employeeDetails: state.employeeDetails,
  }));

  // set state for employee store
  const [applicationSuccess, setApplicationSuccess] = useState<boolean>(false);

  // modal action button
  const modalAction = async (e) => {
    e.preventDefault();

    // if (isEmpty(passSlipToSubmit.natureOfBusiness)) {
    //   setNatureOfBusinessError(true);
    // } else if (
    //   isEmpty(passSlipToSubmit.estimateHours) &&
    //   passSlipToSubmit.natureOfBusiness != 'Undertime' &&
    //   passSlipToSubmit.natureOfBusiness != 'Half Day'
    // ) {
    //   setEstimateHoursError(true);
    // } else if (
    //   passSlipToSubmit.estimateHours <= 0 &&
    //   passSlipToSubmit.natureOfBusiness == 'Personal Business'
    // ) {
    //   setEstimateHoursError(true);
    // } else if (
    //   passSlipToSubmit.estimateHours <= 0 &&
    //   passSlipToSubmit.natureOfBusiness == 'Official Business'
    // ) {
    //   setEstimateHoursError(true);
    // } else if (isEmpty(passSlipToSubmit.purposeDestination)) {
    //   setPurposeDestinationError(true);
    // } else if (
    //   passSlipToSubmit.natureOfBusiness === 'Official Business' &&
    //   isEmpty(passSlipToSubmit.obTransportation)
    // ) {
    //   setObTransportationError(true);
    // } else {
    const data = applyPassSlip(
      employeeDetails.employmentDetails.userId,
      passSlipToSubmit.dateOfApplication,
      passSlipToSubmit.natureOfBusiness,
      passSlipToSubmit.estimateHours,
      passSlipToSubmit.purposeDestination,
      passSlipToSubmit.obTransportation
    );
    if (data) {
      setApplyPassSlipModalIsOpen(false);
      setApplicationSuccess(true);
    } else {
      console.log(data);
    }
    // }
  };

  // React hook form
  const { reset, register, handleSubmit, watch } = useForm<PassSlip>({
    mode: 'onChange',
    defaultValues: {
      employeeId: employeeDetails.employmentDetails.userId,
      dateOfApplication: '',
      natureOfBusiness: '',
      estimateHours: null,
      purposeDestination: '',
      isCancelled: false,
      obTransportation: '',
    },
  });

  const onSubmit: SubmitHandler<PassSlip> = (data: PassSlip) => {
    console.log(data);
    const passSlipData = applyPassSlip(
      employeeDetails.employmentDetails.userId,
      passSlipToSubmit.dateOfApplication,
      passSlipToSubmit.natureOfBusiness,
      passSlipToSubmit.estimateHours,
      passSlipToSubmit.purposeDestination,
      passSlipToSubmit.obTransportation
    );
    if (passSlipData) {
      setApplyPassSlipModalIsOpen(false);
      setApplicationSuccess(true);
    } else {
      console.log(data);
    }

    // // set loading to true
    // setIsLoading(true);

    // handlePostResult(data);

    // // empty the state to remove previous value
    // setErrorPostMessage('');

    // // empty the state to remove previous value
    // setResponsePost({});
  };

  const handlePostResult = async (data: PassSlip) => {
    const { error, result } = await postPortal('/holidays', data);

    // if (error) {
    //   // request is done so set loading to false
    //   setIsLoading(false);

    //   // set value for error message
    //   setErrorPostMessage(result);
    // } else {
    //   // request is done so set loading to false
    //   setIsLoading(false);

    //   // set value from returned response
    //   setResponsePost(result);

    //   reset();
    //   closeModalAction();
  };

  return (
    <>
      {applicationSuccess ? (
        <ToastNotification
          toastType="success"
          notifMessage="Pass Slip Application Successful! Please wait for supervisor's decision on this application."
        />
      ) : null}

      <Modal size={'lg'} open={modalState} setOpen={setModalState}>
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
          <form id="ApplyPassSlipForm">
            <div className="w-full h-full flex flex-col gap-2 ">
              <div className="w-full flex flex-col gap-2 p-4 rounded">
                <div className="w-full flex gap-2 justify-start items-center">
                  <span className="text-slate-500 text-lg font-medium">
                    Date:
                  </span>
                  <div className="text-slate-500 text-lg">
                    {passSlipToSubmit.dateOfApplication}
                  </div>
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

                <div
                  className={`${
                    watch('natureOfBusiness') === 'Official Business'
                      ? 'flex gap-3 justify-between items-center'
                      : 'hidden'
                  }`}
                >
                  <label className="text-slate-500 text-lg whitespace-nowrap font-medium">
                    Select Mode of Transportation:
                    <span className="text-red-600">*</span>
                  </label>
                  <div className="w-96">
                    <select
                      id="obTransportation"
                      className="text-slate-500 h-12 w-96 rounded text-lg border-slate-300"
                      required
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
                <div
                  className={`${
                    watch('natureOfBusiness') ? 'flex flex-col gap-2' : 'hidden'
                  }`}
                >
                  <div className="flex gap-2 justify-between items-center">
                    <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                      Estimated Hours:<span className="text-red-600">*</span>
                    </label>
                    <div className="w-96">
                      <input
                        type="number"
                        name="passSlip_estimatedHours"
                        id="estimateHours"
                        className="border-slate-300 text-slate-500 h-10 w-96"
                        placeholder="Enter number of hours "
                        required
                        value={
                          watch('natureOfBusiness') === 'Half Day' ||
                          watch('natureOfBusiness') === 'Undertime'
                            ? 0
                            : null
                        }
                        disabled={
                          watch('natureOfBusiness') === 'Half Day' ||
                          watch('natureOfBusiness') === 'Undertime'
                            ? true
                            : false
                        }
                        {...register('estimateHours')}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    watch('natureOfBusiness')
                      ? ' flex flex-col gap-2'
                      : 'hidden'
                  }`}
                >
                  <label className="text-slate-500 text-lg font-medium">
                    Purpose/Desination:<span className="text-red-600">*</span>
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
                onSubmit={handleSubmit(onSubmit)}
              >
                Apply Pass Slip
              </Button>

              {/* <Link
                href={`/${router.query.id}/pass-slip/${employeeDetail.employmentDetails.userId}`}
                target={'_blank'}
                className={`${modal.page == 3 ? '' : 'hidden'}`}
              >
                <Button variant={'primary'} size={'md'} loading={false}>
                  View
                </Button>
              </Link> */}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PassSlipApplicationModal;
