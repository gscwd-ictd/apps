/* eslint-disable @nx/enforce-module-boundaries */
import { FunctionComponent, useEffect, useState } from 'react';
import useSWR from 'swr';
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  /** called after a successful add */
  onAdded: (fullName: string) => void;
};

/** pick an employee of the Recruitment and Personnel Welfare Division */
const AddHrPassSlipApproverModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction, onAdded }) => {
  const [employeeId, setEmployeeId] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { data, isLoading } = useSWR(modalState ? '/ems-settings/hr-pass-slip-approvers/options' : null, fetcherEMS, {
    revalidateOnFocus: false,
  });
  const options: { label: string; value: string }[] = data?.data ?? [];

  useEffect(() => {
    if (!modalState) {
      setEmployeeId('');
      setErrorMessage('');
    }
  }, [modalState]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      setErrorMessage('Employee Name is a required field');
      return;
    }
    setSubmitting(true);
    const { error, result } = await postEmpMonitoring('/ems-settings/hr-pass-slip-approvers', { employeeId });
    setSubmitting(false);
    if (error) {
      setErrorMessage(typeof result === 'string' && result ? result : 'An error occurred. Please try again later.');
    } else {
      onAdded(options.find((o) => o.value === employeeId)?.label ?? '');
      closeModalAction();
    }
  };

  return (
    <Modal open={modalState} setOpen={setModalState} steady size="sm">
      <Modal.Header>
        <div className="flex justify-between w-full">
          <span className="text-xl font-medium">New HR Pass Slip Approver</span>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center"
            onClick={closeModalAction}
          >
            <i className="bx bx-x"></i>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        {submitting ? (
          <AlertNotification logo={<LoadingSpinner size="xs" />} alertType="info" notifMessage="Submitting request" dismissible={false} />
        ) : null}

        <form onSubmit={onSubmit} id="addHrPassSlipApprover">
          <div className="flex flex-col w-full gap-2">
            <p className="text-sm text-gray-500">
              The approver is listed in every employee&apos;s pass slip supervisor list in the portal. Only employees of the
              Recruitment and Personnel Welfare Division can be selected.
            </p>
            {isLoading ? (
              <LoadingSpinner size="xs" />
            ) : (
              <div className="flex flex-col">
                <label htmlFor="employeeId" className="text-xs font-medium text-gray-900 h-7 flex items-center">
                  Employee Name
                </label>
                <select
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => {
                    setEmployeeId(e.target.value);
                    setErrorMessage('');
                  }}
                  className={`rounded-md bg-gray-50 border ${
                    errorMessage ? 'border-red-400' : 'border-gray-300'
                  } focus:ring-blue-500 focus:border-blue-500 outline-none text-xs text-gray-900 h-[2.5rem] py-2.5 pl-2.5 pr-9 hover:cursor-pointer`}
                >
                  <option value="" disabled>
                    {options.length ? 'Select employee' : 'All RPW employees are already approvers'}
                  </option>
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {errorMessage ? <span className="mt-1 text-xs text-red-500">{errorMessage}</span> : null}
              </div>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full">
          <Button variant="info" type="submit" form="addHrPassSlipApprover" className="disabled:cursor-not-allowed" disabled={submitting}>
            <span className="text-xs font-normal">Submit</span>
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AddHrPassSlipApproverModal;
