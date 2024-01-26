/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PassSlipStatus } from 'libs/utils/src/lib/enums/pass-slip.enum';
import { usePassSlipStore } from 'apps/portal/src/store/passslip.store';
import { passSlipAction } from 'apps/portal/src/types/approvals.type';
import { patchPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { LabelInput } from 'libs/oneui/src/components/Inputs/LabelInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { stat } from 'fs';

type DisputeApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  action: PassSlipStatus; // for dispute
  tokenId: string; //like pass Slip Id, leave Id etc.
  title: string;
};

type DisputeForm = {
  disputeRemarks: string;
  encodedTimeIn: string;
  status: PassSlipStatus;
  passSlipId: string;
};
export const DisputeApplicationModal = ({
  modalState,
  setModalState,
  closeModalAction,
  action,
  tokenId,
  title,
}: DisputeApplicationModalProps) => {
  const {
    setCompletedPassSlipModalIsOpen,
    disputePassSlipModalIsOpen,
    patchPassSlip,
    patchPassSlipSuccess,
    patchPassSlipFail,
  } = usePassSlipStore((state) => ({
    disputePassSlipModalIsOpen: state.disputePassSlipModalIsOpen,
    setCompletedPassSlipModalIsOpen: state.setCompletedPassSlipModalIsOpen,
    patchPassSlip: state.patchPassSlip,
    patchPassSlipSuccess: state.patchPassSlipSuccess,
    patchPassSlipFail: state.patchPassSlipFail,
  }));

  // React hook form
  const { reset, register, handleSubmit, trigger, watch, setValue } = useForm<DisputeForm>({
    mode: 'onChange',
    defaultValues: {
      disputeRemarks: '',
      encodedTimeIn: '',
      status: PassSlipStatus.FOR_DISPUTE,
      passSlipId: tokenId,
    },
  });

  const onSubmit: SubmitHandler<DisputeForm> = (data: DisputeForm) => {
    handlePatchResult(data);
    patchPassSlip();
  };

  const handlePatchResult = async (data: DisputeForm) => {
    const { error, result } = await patchPortal('/v1/pass-slip', data);
    if (error) {
      patchPassSlipFail(result);
    } else {
      patchPassSlipSuccess(result);
      closeModalAction(); // close dispute modal
      setTimeout(() => {
        setCompletedPassSlipModalIsOpen(false); // close main pass slip info modal
      }, 200);
    }
  };

  useEffect(() => {
    if (!disputePassSlipModalIsOpen) {
      reset();
    }
  }, [disputePassSlipModalIsOpen]);

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>{title}</span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <form id="DisputePassSlipForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full h-full px-2 gap-2 text-md ">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                <label className="text-slate-500 text-md font-medium">Update Time In:</label>

                <div className="w-full md:w-1/2 flex flex-row gap-2 items-center justify-between">
                  <label className="text-slate-500 w-full text-md ">
                    <LabelInput
                      required
                      id={'encodedTimeIn'}
                      type={'time'}
                      label={''}
                      className="w-full text-slate-400 font-medium cursor-pointer"
                      textSize="md"
                      controller={{
                        ...register('encodedTimeIn', {
                          onChange: (e) => {
                            setValue('encodedTimeIn', e.target.value, {
                              shouldValidate: true,
                            });
                            trigger(); // triggers all validations for inputs
                          },
                        }),
                      }}
                    />
                  </label>
                </div>
              </div>
              <label className="text-slate-500 text-md font-medium pt-2">
                Please indicate reason for dispute and provide proof of claim:
              </label>

              <textarea
                required
                placeholder="Reason for Dispute"
                minLength={15}
                className={`w-full h-32 p-2 border resize-none text-slate-500`}
                {...register('disputeRemarks')}
              ></textarea>
              <span className="text-slate-400 text-xs">Minimum of 15 characters required for Reason of Dispute</span>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto flex gap-2">
              <Button variant={'primary'} size={'md'} loading={false} form="DisputePassSlipForm" type="submit">
                Submit
              </Button>
              <Button variant={'danger'} size={'md'} loading={false} onClick={closeModalAction}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
