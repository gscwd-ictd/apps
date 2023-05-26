import { Dialog, Transition } from '@headlessui/react';
import { Fragment, FunctionComponent } from 'react';
import { Button } from '../forms/buttons/Button';
import { CloseButton } from '../forms/buttons/CloseButton';

type ModalProps = {
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  child: JSX.Element;
  isCancelDisabled?: boolean;
  isConfirmDisabled?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  setIsOpen: (state: boolean) => void;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export const Modal: FunctionComponent<ModalProps> = ({
  isOpen,
  title,
  subtitle,
  size = 'sm',
  child,
  isCancelDisabled = false,
  isConfirmDisabled = false,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  setIsOpen,
  onClose,
  onCancel,
  onConfirm,
}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          onClose={() => setIsOpen(false)}
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
            {/* set vertical placement and height of the modal here */}
            <div
              className={`${
                size === 'sm'
                  ? 'h-[40%] my-5'
                  : size === 'md'
                  ? 'h-[55%] my-5'
                  : size === 'lg'
                  ? 'h-[75%] my-5'
                  : size === 'xl'
                  ? 'h-[90%] my-5'
                  : 'h-[100%]'
              } flex justify-center p-4 text-center`}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/** this is where you adjust the width of the modal */}
                <Dialog.Panel
                  className={`${
                    size === 'sm'
                      ? 'max-w-[35%]'
                      : size === 'md'
                      ? 'max-w-[45%]'
                      : size === 'lg'
                      ? 'max-w-[60%]'
                      : size === 'xl'
                      ? 'max-w-[80%]'
                      : 'max-w-[100%]'
                  } w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all`}
                >
                  <div className="w-full h-full">
                    {/** Modal title goes here */}
                    <header
                      className={`${
                        title && subtitle ? 'h-[8rem]' : 'h-[5rem]'
                      } px-10 pt-10 flex justify-between`}
                    >
                      <section>
                        <h3 className="text-lg font-semibold text-gray-600">
                          {title}
                        </h3>
                        <p className="text-sm text-gray-600">{subtitle}</p>
                      </section>

                      <section>
                        <CloseButton
                          onClick={() => {
                            setIsOpen(false);
                            onClose();
                          }}
                        />
                      </section>
                    </header>

                    {/** Modal content goes here */}
                    <main
                      className={`${
                        title && subtitle
                          ? 'h-[calc(100%-14rem)]'
                          : 'h-[calc(100%-11rem)]'
                      } px-5 overflow-hidden`}
                    >
                      {child}
                    </main>

                    {/** Modal actions go here */}
                    <footer className="h-[6rem] flex justify-end items-center px-10 gap-2">
                      <Button
                        isDisabled={isCancelDisabled}
                        btnLabel={cancelLabel}
                        variant="white"
                        onClick={onCancel}
                      />
                      <Button
                        isDisabled={isConfirmDisabled}
                        btnLabel={confirmLabel}
                        onClick={onConfirm}
                      />
                    </footer>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
