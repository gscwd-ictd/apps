/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../store/leave.store';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { postPortal } from '../../../utils/helpers/portal-axios-helper';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { useEmployeeStore } from '../../../store/employee.store';

import { LeaveBenefitOptions } from '../../../../../../libs/utils/src/lib/types/leave-benefits.type';
import { CalendarDate, LeaveApplicationForm } from '../../../../../../libs/utils/src/lib/types/leave-application.type';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { OvertimeApplication, OvertimeDetails, useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { MySelectList } from '../../modular/inputs/SelectList';

const listOfEmployees: Array<SelectOption> = [
  { label: 'Ricardo Vicente Narvaiza', value: '0' },
  { label: 'Mikhail Sebua', value: '1' },
  { label: 'Jay Nosotros', value: '2' },
  { label: 'Eric Sison', value: '3' },
  { label: 'Allyn Joseph Cubero', value: '4' },
  { label: 'John Henry Alfeche', value: '5' },
  { label: 'Phyll Patrick Fragata', value: '6' },
  { label: 'Deo Del Rosario', value: '7' },
  { label: 'Cara Jade Reyes', value: '8' },
  { label: 'Rizza Baugbog', value: '9' },
  { label: 'Kumier Lou Arancon', value: '10' },
  { label: 'Roland Bacayo', value: '11' },
  { label: 'Alfred Perez', value: '12' },
  { label: 'Elea Glen Lacerna', value: '13' },
  { label: 'Ricky Libertad', value: '14' },
  { label: 'Deo Del Rosario 2', value: '15' },
];

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const OvertimeApplicationModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  //zustand initialization to access Leave store
  const { applyOvertimeModalIsOpen, loadingResponse, postOvertime, postOvertimeSuccess, postOvertimeFail } =
    useOvertimeStore((state) => ({
      applyOvertimeModalIsOpen: state.applyOvertimeModalIsOpen,
      loadingResponse: state.loading.loadingResponse,
      postOvertime: state.postOvertime,
      postOvertimeSuccess: state.postOvertimeSuccess,
      postOvertimeFail: state.postOvertimeFail,
    }));

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const [selectedEmployees, setSelectedEmployees] = useState<Array<SelectOption>>([]);

  // React hook form
  const { reset, register, handleSubmit, watch, setValue } = useForm<OvertimeApplication>({
    mode: 'onChange',
    defaultValues: {
      overtimeApplication: {
        overtimeSupervisorId: '',
        plannedDate: '',
        estimatedHours: 0,
        purpose: '',
      },
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

    console.log(employeeIdList);
  }, [selectedEmployees]);

  useEffect(() => {
    if (!applyOvertimeModalIsOpen) {
      reset();
      setSelectedEmployees([]);
    }
  }, [applyOvertimeModalIsOpen]);

  const onSubmit: SubmitHandler<OvertimeApplication> = (data: OvertimeApplication) => {
    handlePostResult(data);
    // postLeave();
  };

  const handlePostResult = async (data: OvertimeApplication) => {
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
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}
          <form id="ApplyOvertimeForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full h-full flex flex-col gap-2 ">
              <div className="w-full flex flex-col gap-2 p-4 rounded">
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
                      {...register('overtimeApplication.plannedDate')}
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
                      placeholder="Enter number of hours "
                      required
                      defaultValue={0}
                      max="8"
                      min="1"
                      {...register('overtimeApplication.estimatedHours')}
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
                    options={listOfEmployees}
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
                    {...register('overtimeApplication.purpose')}
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
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
