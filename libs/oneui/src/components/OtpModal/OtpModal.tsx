/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, FunctionComponent, ReactNode } from 'react';

export type OtpProps = {
  className?: string;
  children: ReactNode | ReactNode[];
};

export type OtpModalProps = OtpProps & {
  modalState: boolean;
  setModalState: (state: boolean) => void;
  title: string;
};

export const OtpModal: FunctionComponent<OtpModalProps> = (props) => {
  const { modalState, setModalState, title, children } = props;

  const onClose = () => setModalState(false);

  return (
    <Transition appear show={modalState}>
      <Dialog
        as="div"
        onClose={() => {
          onClose;
        }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl z-50">
                <div className={`w-100 relative bg-white rounded max-w-sm`}>
                  <Dialog.Title className="flex items-center justify-center w-full h-12 px-10 py-8 font-bold text-center text-white bg-indigo-600">
                    {title}
                  </Dialog.Title>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
