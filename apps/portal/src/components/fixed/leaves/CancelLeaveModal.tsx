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
import { postPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';

type CancelLeaveModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const CancelLeaveModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: CancelLeaveModalProps) => {
  const {
    leaveIndividualDetail,
    leaveId,
    loadingLeaveDetails,
    errorLeaveDetails,
    cancelLeaveModalIsOpen,
    leaveDates,

    postLeave,
    postLeaveSuccess,
    postLeaveFail,
  } = useLeaveStore((state) => ({
    leaveIndividualDetail: state.leaveIndividualDetail,
    leaveId: state.leaveId,
    loadingLeaveDetails: state.loading.loadingIndividualLeave,
    errorLeaveDetails: state.error.errorIndividualLeave,
    cancelLeaveModalIsOpen: state.cancelLeaveModalIsOpen,
    leaveDates: state.leaveDates,

    postLeave: state.postLeave,
    postLeaveSuccess: state.postLeaveSuccess,
    postLeaveFail: state.postLeaveFail,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const [remarks, setRemarks] = useState<string>('');

  const handleCancel = async () => {
    // postLeave();
    // const { error, result } = await postPortal('/v1/leave-application', data);
    // if (error) {
    //   postLeaveFail(result);
    // } else {
    //   postLeaveSuccess(result);
    //   closeModalAction();
    // }
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal
        size={`${windowWidth > 1024 ? 'sm' : 'xl'}`}
        open={modalState}
        setOpen={setModalState}
      >
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
          <div className="flex flex-col w-full h-full px-2 gap-2 text-md ">
            {'Please indicate reason for cancelling application:'}
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
          <div className="flex justify-end">
            <div className="max-w-auto flex">
              <Button
                variant={'primary'}
                disabled={!isEmpty(remarks) ? false : true}
                onClick={(e) => handleCancel()}
              >
                Submit
              </Button>
              {/* <Button
                variant={'danger'}
                onClick={() => {
                  closeModalAction();
                }}
              >
                Cancel
              </Button> */}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CancelLeaveModal;
