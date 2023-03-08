import { useEffect, useState } from 'react';
import { withSession } from '../../../utils/helpers/session';
import { Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { applyPassSlip } from '../../../utils/helpers/passslip-requests';
import { useEmployeeStore } from '../../../store/employee.store';
import { usePassSlipStore } from '../../../store/passslip.store';

type PassSlipApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const PassSlipApplicationModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipApplicationModalProps) => {
  const { pendingPassSlipModalIsOpen, setPendingPassSlipModalIsOpen } =
    usePassSlipStore((state) => ({
      pendingPassSlipModalIsOpen: state.pendingPassSlipModalIsOpen,
      setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    }));

  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const selectedPassSlip = usePassSlipStore((state) => state.selectedPassSlip);

  // modal action button
  const modalAction = async (e) => {
    e.preventDefault();
  };

  return (
    <>
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
          <div className="w-full h-full flex flex-col gap-2 ">
            <div className="w-full flex flex-col gap-2 p-4 rounded">
              <div className="w-full flex gap-2 justify-start items-center">
                <span className="text-slate-500 text-lg font-medium">
                  Date:
                </span>
                <div className="text-slate-500 text-lg">
                  {/* {selectedPassSlip.dateOfApplication} */}
                </div>
              </div>

              <div className="flex gap-2 justify-between items-center">
                <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                  Nature of Business:
                </label>

                <div className="w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {/* {selectedPassSlip.natureOfBusiness} */}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-between items-center">
                {/* <label
              className={`${
                selectedPassSlip.natureOfBusiness === 'Official Business'
                  ? 'text-slate-500 text-lg whitespace-nowrap font-medium'
                  : 'hidden'
              }`}
            >
              Mode of Transportation:
            </label> */}
                <div className="w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {selectedPassSlip.obTransportation}
                  </label>
                </div>
              </div>
              <div
                className={` flex flex-col gap-2
            `}
              >
                <div className="flex gap-2 justify-between items-center">
                  <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                    Estimated Hours:
                  </label>
                  <div className="w-96">
                    <label className="text-slate-500 h-12 w-96  text-lg ">
                      {selectedPassSlip.estimateHours}
                    </label>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col gap-2
            `}
              >
                <label className="text-slate-500 text-lg font-medium">
                  Purpose/Desination:
                </label>
                <textarea
                  className={
                    'resize-none w-full p-2 rounded text-slate-500 text-lg border-slate-300'
                  }
                  value={selectedPassSlip.purposeDestination}
                  rows={4}
                  disabled={true}
                ></textarea>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto">
              <Button
                variant={'primary'}
                size={'md'}
                loading={false}
                onClick={(e) => modalAction(e)}
                form="ApplyPassSlipForm"
                type="submit"
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
