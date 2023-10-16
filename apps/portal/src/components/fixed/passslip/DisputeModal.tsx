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

type DisputeApplicationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  action: PassSlipStatus; // disapprove or cancel
  tokenId: string; //like pass Slip Id, leave Id etc.
  title: string;
};

export const DisputeApplicationModal = ({
  modalState,
  setModalState,
  closeModalAction,
  action,
  tokenId,
  title,
}: DisputeApplicationModalProps) => {
  const { setPendingPassSlipModalIsOpen, disputePassSlipModalIsOpen, setDisputePassSlipModalIsOpen } = usePassSlipStore(
    (state) => ({
      disputePassSlipModalIsOpen: state.disputePassSlipModalIsOpen,
      setDisputePassSlipModalIsOpen: state.setDisputePassSlipModalIsOpen,
      setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    })
  );
  // const [remarks, setRemarks] = useState<string>('');
  // const [timeIn, setTimeIn] = useState<string>('');

  // React hook form
  const { reset, register, handleSubmit, trigger, watch, setValue } = useForm<{ remarks: string; timeIn: any }>({
    mode: 'onChange',
    defaultValues: {
      remarks: '',
      timeIn: '',
    },
  });

  const onSubmit: SubmitHandler<{ remarks: string; timeIn: string }> = (data: { remarks: string; timeIn: any }) => {
    handlePatchResult(data);
    // postPassSlipList();
  };

  const handlePatchResult = async (data: { remarks: string; timeIn: any }) => {
    console.log(data);
    const { error, result } = await patchPortal('/v1/pass-slip', data);
    if (error) {
      // cancelPassSlipFail(result);
    } else {
      console.log(data);
      // cancelPassSlipSuccess(result);
      closeModalAction(); // close dispute modal
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
                      id={'timeIn'}
                      type={'time'}
                      label={''}
                      className="w-full text-slate-400 font-medium cursor-pointer"
                      textSize="md"
                      controller={{
                        ...register('timeIn', {
                          onChange: (e) => {
                            setValue('timeIn', e.target.value, {
                              shouldValidate: true,
                            });
                            trigger(); // triggers all validations for inputs
                          },
                        }),
                      }}
                      // onChange={(e) => setTimeIn(e.target.value as unknown as string)}
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
                {...register('remarks')}
                // onChange={(e) => setRemarks(e.target.value as unknown as string)}
                // value={watch('remarks')}
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
