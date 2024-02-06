/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../store/leave.store';
import { HiX } from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';
import { useEmployeeStore } from '../../../store/employee.store';
import axios from 'axios';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';
import Calendar from './LeaveCalendar';
import CancelLeaveCalendar from './CancelLeaveCalendar';
import { LeaveApplicationForm } from 'libs/utils/src/lib/types/leave-application.type';
import { patchPortal, postPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { MySelectList } from '../../modular/inputs/SelectList';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';

type CancelLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const CancelLeaveModal = ({ modalState, setModalState, closeModalAction }: CancelLeaveModalProps) => {
  const {
    leaveIndividualDetail,
    leaveId,
    loadingLeaveDetails,
    errorLeaveDetails,
    cancelLeaveModalIsOpen,
    setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen,
    patchLeave,
    patchLeaveSuccess,
    patchLeaveFail,
    emptyResponseAndError,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    cancelLeaveModalIsOpen: state.cancelLeaveModalIsOpen,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen: state.setCompletedLeaveModalIsOpen,
    patchLeave: state.patchLeave,
    patchLeaveSuccess: state.patchLeaveSuccess,
    patchLeaveFail: state.patchLeaveFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [remarks, setRemarks] = useState<string>('');
  const [selectedDatesToCancel, setSelectedDatesToCancel] = useState<Array<SelectOption>>([]);
  const [leaveDates, setLeaveDates] = useState<Array<SelectOption>>([]);

  useEffect(() => {
    let leaveDates = [];
    if (leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates.length >= 1) {
      for (let i = 0; i < leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates.length; i++) {
        leaveDates.push({
          label: leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i],
          value: leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates[i],
        });
      }
    }
    setLeaveDates(leaveDates);
  }, [leaveIndividualDetail?.leaveApplicationBasicInfo?.leaveDates]);

  const handleCancel = async () => {
    const data = {
      id: leaveIndividualDetail.leaveApplicationBasicInfo.id,
      cancelReason: remarks,
    };
    patchLeave();
    const { error, result } = await patchPortal('/v1/leave/employee', data);
    if (error) {
      patchLeaveFail(result);
    } else {
      patchLeaveSuccess(result);
      closeModalAction();
      setTimeout(() => {
        setPendingLeaveModalIsOpen(false); //then close LEAVE modal
        setCompletedLeaveModalIsOpen(false); //then close LEAVE modal
      }, 200);
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    }
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={`${windowWidth > 1024 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-700">
            <div className="flex justify-between px-2">
              <span>Cancel Leave Application</span>
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
          <div className="flex flex-col w-full h-full px-2 gap-1 text-md ">
            <label>Select dates possible for cancellation:</label>
            <MySelectList
              id="employees"
              label=""
              multiple
              options={leaveDates}
              onChange={(o) => setSelectedDatesToCancel(o)}
              value={selectedDatesToCancel}
            />

            <label className="pt-3">Indicate reason for cancelling application:</label>

            <textarea
              required
              placeholder="Reason for decline"
              className={`w-full h-32 p-2 border resize-none rounded-lg border-gray-300/90 `}
              onChange={(e) => setRemarks(e.target.value as unknown as string)}
              value={remarks}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end">
            <div className="max-w-auto flex">
              <Button
                variant={'primary'}
                disabled={!isEmpty(remarks) && selectedDatesToCancel.length > 0 ? false : true}
                onClick={(e) => handleCancel()}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelLeaveModal;
