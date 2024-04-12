/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { postPortal } from '../../../utils/helpers/portal-axios-helper';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { MySelectList } from '../../modular/inputs/SelectList';
import { OvertimeForm } from 'libs/utils/src/lib/types/overtime.type';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeApplicationModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  //zustand initialization to access Leave store
  const {
    applyOvertimeModalIsOpen,
    loadingResponse,
    employeeList,
    postOvertime,
    postOvertimeSuccess,
    postOvertimeFail,
  } = useOvertimeStore((state) => ({
    applyOvertimeModalIsOpen: state.applyOvertimeModalIsOpen,
    loadingResponse: state.loading.loadingResponse,
    employeeList: state.employeeList,
    postOvertime: state.postOvertime,
    postOvertimeSuccess: state.postOvertimeSuccess,
    postOvertimeFail: state.postOvertimeFail,
  }));

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [selectedEmployees, setSelectedEmployees] = useState<Array<SelectOption>>([]);

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<OvertimeForm>({
    mode: 'onChange',
    defaultValues: {
      overtimeImmediateSupervisorId: employeeDetails.employmentDetails.overtimeImmediateSupervisorId,
      plannedDate: '',
      estimatedHours: 0,
      purpose: '',
      employees: [],
    },
  });

  useEffect(() => {
    let employeeIdList = [];
    if (selectedEmployees.length >= 1) {
      for (let i = 0; i < selectedEmployees.length; i++) {
        employeeIdList.push(selectedEmployees[i]?.value);
      }
    }
    setValue('employees', employeeIdList);
    setValue('overtimeImmediateSupervisorId', employeeDetails.employmentDetails.overtimeImmediateSupervisorId);
  }, [selectedEmployees]);

  useEffect(() => {
    if (!applyOvertimeModalIsOpen) {
      reset();
      setSelectedEmployees([]);
    }
  }, [applyOvertimeModalIsOpen]);

  const onSubmit: SubmitHandler<OvertimeForm> = (data: OvertimeForm) => {
    handlePostResult(data);
  };

  const handlePostResult = async (data: OvertimeForm) => {
    postOvertime();
    const { error, result } = await postPortal('/v1/overtime/', data);
    if (error) {
      postOvertimeFail(result);
    } else {
      postOvertimeSuccess(result);
      reset();
      closeModalAction();
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'md' : 'full'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Overtime Application</span>
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
          {/* Notifications */}
          {loadingResponse ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting Request"
              dismissible={true}
            />
          ) : null}
          <form id="ApplyOvertimeForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full h-full flex flex-col gap-2 ">
              <div className="w-full flex flex-col gap-2 px-4 rounded">
                <div className={`md:flex-row md:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}>
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                    Date:
                    <span className="text-red-600">*</span>
                  </label>
                  <div className="w-full md:w-60">
                    <input
                      required
                      type="date"
                      className="border-slate-300 text-slate-500 h-12 text-md w-full md:w-60 rounded"
                      {...register('plannedDate')}
                    />
                  </div>
                </div>

                <div className={`md:flex-row md:items-center flex-col items-start flex gap-0 md:gap-3 justify-between`}>
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap">
                    Estimated Hours:
                    <span className="text-red-600">*</span>
                  </label>
                  <div className="w-full md:w-60">
                    <input
                      type="number"
                      className="border-slate-300 text-slate-500 h-12 text-md w-full md:w-60 rounded"
                      placeholder="Enter number of hours"
                      required
                      defaultValue={0}
                      max="23"
                      step={0.1}
                      {...register('estimatedHours')}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 md:pt-3">
                  <label className="text-slate-500 text-md font-medium">
                    Employees:
                    <span className="text-red-600">*</span>
                  </label>
                  <MySelectList
                    id="employees"
                    label=""
                    multiple
                    options={employeeList}
                    onChange={(o) => setSelectedEmployees(o)}
                    value={selectedEmployees}
                  />
                </div>

                <div className="flex flex-col gap-2 md:pt-3">
                  <label className="text-slate-500 text-md font-medium">
                    Purpose:
                    <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`Enter Purpose of Overtime`}
                    className="resize-none w-full p-2 rounded text-slate-500 text-md border-slate-300"
                    required
                    {...register('purpose')}
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto">
              <Button variant={'primary'} size={'md'} loading={false} form="ApplyOvertimeForm" type="submit">
                Apply Overtime
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
