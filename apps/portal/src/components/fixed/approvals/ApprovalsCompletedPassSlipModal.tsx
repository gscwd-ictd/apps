/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useApprovalStore } from '../../../store/approvals.store';
import { SelectOption } from '../../../../../../libs/utils/src/lib/types/select.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { patchPortal } from '../../../utils/helpers/portal-axios-helper';

type PassSlipCompletedModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ApprovalsPendingPassSlipModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipCompletedModalProps) => {
  const { passSlip } = useApprovalStore((state) => ({
    passSlip: state.passSlipIndividualDetail,
  }));

  return (
    <>
      <Modal size={'lg'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-2xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Pass Slip for Approval</span>
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
              <AlertNotification
                alertType="info"
                notifMessage={`This Pass Slip is ${passSlip.status}`}
                dismissible={false}
              />

              <div className="flex gap-2 justify-between items-center">
                <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                  Employee Name:
                </label>

                <div className="w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {passSlip.employeeName}
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-between items-center">
                <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                  Date of Application:
                </label>

                <div className="w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {passSlip.dateOfApplication}
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-between items-center">
                <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                  Nature of Business:
                </label>

                <div className="w-96">
                  <label className="text-slate-500 h-12 w-96  text-lg ">
                    {passSlip.natureOfBusiness}
                  </label>
                </div>
              </div>

              {passSlip.natureOfBusiness === 'Official Business' ? (
                <div className="flex gap-3 justify-between items-center">
                  <label
                    className={`text-slate-500 text-lg whitespace-nowrap font-medium`}
                  >
                    Mode of Transportation:
                  </label>
                  <div className="w-96">
                    <label className="text-slate-500 h-12 w-96  text-lg ">
                      {passSlip.obTransportation}
                    </label>
                  </div>
                </div>
              ) : null}

              <div className={` flex flex-col gap-2`}>
                <div className="flex gap-2 justify-between items-center">
                  <label className="text-slate-500 text-lg font-medium whitespace-nowrap">
                    Estimated Hours:
                  </label>
                  <div className="w-96">
                    <label className="text-slate-500 h-12 w-96  text-lg ">
                      {passSlip.estimateHours}
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
                  value={passSlip.purposeDestination}
                  rows={3}
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
                onClick={(e) => closeModalAction()}
                type="submit"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApprovalsPendingPassSlipModal;
