/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { useEmployeeStore } from '../../../store/employee.store';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { patchPortal, postPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';
import { useState } from 'react';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const InputAccomplishmentModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    overtimeAccomplishmentDetails,
    confirmOvertimeAccomplishmentModalIsOpen,
    pendingOvertimeAccomplishmentModalIsOpen,
    setConfirmOvertimeAccomplishmentModalIsOpen,
    setOvertimeAccomplishmentPatchDetails,
  } = useOvertimeAccomplishmentStore((state) => ({
    overtimeAccomplishmentDetails: state.overtimeAccomplishmentDetails,
    confirmOvertimeAccomplishmentModalIsOpen: state.confirmOvertimeAccomplishmentModalIsOpen,
    pendingOvertimeAccomplishmentModalIsOpen: state.pendingOvertimeAccomplishmentModalIsOpen,
    setConfirmOvertimeAccomplishmentModalIsOpen: state.setConfirmOvertimeAccomplishmentModalIsOpen,
    setOvertimeAccomplishmentPatchDetails: state.setOvertimeAccomplishmentPatchDetails,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [remarks, setRemarks] = useState<string>('');

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-700">
            <div className="flex justify-between px-2">
              <span>Add Overtime Accomplishment</span>
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
          <div className="flex flex-col w-full h-full px-4 gap-2 text-md ">
            {'Please enter accomplishment'}
            <textarea
              required
              placeholder="Reason for decline"
              className={`w-full h-32 p-2 border resize-none`}
              onChange={(e) => setRemarks(e.target.value as unknown as string)}
              value={remarks}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end px-4">
            <div className="max-w-auto flex">
              {/* <Button
                variant={'primary'}
                disabled={!isEmpty(remarks) ? false : true}
                onClick={(e) => addAccomplishments(remarks)}
              >
                Submit
              </Button> */}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InputAccomplishmentModal;
