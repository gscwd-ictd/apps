import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, MouseEventHandler, ReactChild, ReactChildren, SetStateAction, useRef, useState } from 'react';
import { MyButtonComponentVariant } from '../../../types/components/attributes';
import { Button } from '../../modular/buttons/Button';

type ModalRemoveActionProps = {
  actionLabel?: string;
  cancelLabel?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  action: MouseEventHandler<HTMLButtonElement>;
  verticalCenter?: boolean;
  modalChildren?: React.ReactNode | React.ReactNode[];
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl' | 'xxxxxl' | 'xxxxxxl' | 'xxxxxxxl' | 'full';
  title?: string;
  subtitle?: string;
  btnSubmitVariant?: MyButtonComponentVariant;
  btnCancelColor?: MyButtonComponentVariant;
  titleColor?: string;
  className?: string;
};

const size = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  xxl: 'max-w-2xl',
  xxxl: 'max-w-3xl',
  xxxxl: 'max-w-4xl',
  xxxxxl: 'max-w-5xl',
  xxxxxxl: 'max-w-6xl',
  xxxxxxxl: 'max-w-7xl',
  full: 'max-w-full',
};

export const ModalAction = ({
  actionLabel = 'Yes',
  cancelLabel = 'No',
  isOpen = false,
  setIsOpen,
  action,
  modalSize = 'lg',
  verticalCenter = true,
  modalChildren,
  title = 'Remove',
  titleColor = 'text-red-800',
  subtitle = 'Are you sure you want to remove this? This action cannot be undone.',
  btnSubmitVariant = 'danger',
  btnCancelColor = 'light',
  className = 'transition-all',
}: ModalRemoveActionProps): JSX.Element => {
  const actionBtnRef = useRef<any>(null);

  return (
    <>
      <Transition.Root appear show={isOpen} as={Fragment}>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className={`fixed inset-0 z-50 overflow-y-auto ${className}`}>
          <Dialog.Panel>
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className={`pointer-events-none fixed inset-0 bg-black bg-opacity-25 transition-opacity`} />
              </Transition.Child>
              {verticalCenter ? (
                <>
                  <span className="inline-block h-screen align-middle" aria-hidden="true">
                    &#8203;
                  </span>
                </>
              ) : null}
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div
                  className={`${size[modalSize]} z-50 my-8 inline-block w-full transform overflow-visible rounded-lg bg-white p-10 text-left align-middle shadow-xl transition-all`}
                >
                  <header className="mb-3 px-5 ">
                    <section className="flex items-center justify-between">
                      <Dialog.Title as="h3" className={`text-2xl font-medium leading-6 ${titleColor}`}>
                        {title}
                      </Dialog.Title>
                    </section>

                    <section>
                      <Dialog.Title as="p" className={`mt-2 rounded-sm  border-gray-200  px-5 text-sm leading-6 text-gray-500`}>
                        {subtitle}
                      </Dialog.Title>
                    </section>
                  </header>

                  <main>
                    <div className="">{modalChildren}</div>
                  </main>

                  <footer>
                    <div className="gap-4 px-4 py-3 sm:flex sm:px-6">
                      {/* <button
                        tabIndex={1}
                        type="button"
                        className={`w-full cursor-pointer select-none rounded-md ${btnCancelColor} p-2 text-gray-600 transition-colors hover:scale-110 hover:bg-indigo-200 hover:text-white focus:outline-0 focus:ring focus:ring-indigo-400 active:ring active:ring-indigo-300`}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-gray-500 ">{cancelLabel}</span>
                      </button> */}
                      <Button btnLabel="No" variant={btnCancelColor} onClick={() => setIsOpen(false)} type="button" tabIndex={1} />

                      <Button
                        className="text-center "
                        btnLabel={actionLabel}
                        tabIndex={1}
                        variant={btnSubmitVariant}
                        innerRef={actionBtnRef}
                        type="button"
                        onClick={action}
                      />

                      {/* {withCancelBtn ? <Button btnLabel={cancelLabel} variant="light" type="button" onClick={() => onClose()} /> : null} */}
                    </div>
                  </footer>
                </div>
              </Transition.Child>
            </div>
          </Dialog.Panel>
        </Dialog>
      </Transition.Root>
    </>
  );
};
