/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { useRouter } from 'next/router';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

type PassSlipCompletedModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const PassSlipCompletedModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: PassSlipCompletedModalProps) => {
  const { passSlip } = usePassSlipStore((state) => ({
    passSlip: state.passSlip,
  }));

  const router = useRouter();
  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal
        size={windowWidth > 1024 ? 'lg' : 'full'}
        open={modalState}
        setOpen={setModalState}
      >
        <Modal.Header>
          <h3 className="font-semibold text-2xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Completed Pass Slip</span>
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
              {passSlip.status === 'approved' ? (
                <AlertNotification
                  alertType="info"
                  notifMessage="Approved"
                  dismissible={false}
                />
              ) : null}

              {passSlip.status === 'disapproved' ? (
                <AlertNotification
                  alertType="error"
                  notifMessage="Disapproved"
                  dismissible={false}
                />
              ) : null}

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Date of Application:
                </label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">
                    {passSlip.dateOfApplication}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Nature of Business:
                </label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">
                    {passSlip.natureOfBusiness}
                  </label>
                </div>
              </div>

              {passSlip.natureOfBusiness === 'Official Business' ? (
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center ">
                  <label
                    className={`text-slate-500 text-md whitespace-nowrap font-medium sm:w-80`}
                  >
                    Mode of Transportation:
                  </label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">
                      {passSlip.obTransportation}
                    </label>
                  </div>
                </div>
              ) : null}
              <div
                className={` flex flex-col gap-2
            `}
              >
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                    Estimated Hours:
                  </label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">
                      {passSlip.estimateHours}
                    </label>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col gap-2
            `}
              >
                <label className="text-slate-500 text-md font-medium">
                  Purpose/Desination:
                </label>
                <textarea
                  className={
                    'resize-none w-full p-2 rounded text-slate-500 text-md border-slate-300'
                  }
                  value={passSlip.purposeDestination}
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
              {passSlip.status === 'approved' ? (
                <Link
                  href={`/${router.query.id}/pass-slip/${passSlip.id}`}
                  target={'_blank'}
                >
                  <Button variant={'primary'} size={'md'} loading={false}>
                    Print PDF
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  variant={'primary'}
                  size={'md'}
                  loading={false}
                >
                  Print PDF
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PassSlipCompletedModal;
