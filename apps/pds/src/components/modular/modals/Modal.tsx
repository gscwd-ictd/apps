import { Dialog, Transition } from '@headlessui/react';
import React, { Dispatch, FormEvent, Fragment, MouseEventHandler, MutableRefObject, ReactNode, SetStateAction, useRef } from 'react';
import { Button } from '../buttons/Button';

type ModalProps = {
  formId: string;
  title?: string;
  subtitle?: string | JSX.Element;
  modalChildren?: ReactNode | ReactNode[];
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' | 'xxxxl' | 'xxxxxl' | 'xxxxxxl' | 'xxxxxxxl' | 'full';
  isOpen: boolean;
  verticalCenter?: boolean;
  isStatic?: boolean;
  actionLabel?: string;
  withCancelBtn?: boolean;
  cancelLabel?: string;
  onClose?: MouseEventHandler<HTMLButtonElement> | any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  action: MouseEventHandler<HTMLButtonElement> | FormEvent<HTMLFormElement> | any;
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

export const Modal = ({
  formId,
  title = 'Modal Title',
  subtitle = 'You may include a subtitle for this modal',
  modalChildren,
  modalSize = 'lg',
  isOpen,
  verticalCenter = false,
  isStatic = false,
  actionLabel = 'Confirm',
  withCancelBtn = false,
  setIsOpen,
  cancelLabel = 'Cancel',
  onClose,
  action,
}: ModalProps): JSX.Element => {
  const actionBtnRef = useRef(null) as unknown as MutableRefObject<any>;
  const closeBtnRef = useRef(null) as unknown as MutableRefObject<any>;

  return (
    <>
      <Transition.Root appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" static={isStatic} onClose={isStatic ? () => null : () => setIsOpen(false)}>
          <form onSubmit={action} id={formId} className="form min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              static={isStatic}
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
                <header className="mb-3 px-5">
                  <section className="flex items-center justify-between">
                    <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-indigo-800">
                      {title}
                    </Dialog.Title>
                  </section>

                  <section>
                    <Dialog.Title as="p" className="text-sm leading-6 text-gray-500">
                      {subtitle}
                    </Dialog.Title>
                  </section>
                </header>

                <main>
                  <div className="">
                    <hr className="border" />
                    {modalChildren}
                    {/* <hr className="border" /> */}
                  </div>
                </main>

                <footer>
                  <div className="gap-4 px-4 py-3 sm:flex sm:px-6">
                    {withCancelBtn ? <Button btnLabel="Cancel" variant={'light'} onClick={onClose} type="button" tabIndex={-1} /> : null}
                    <Button className="text-center " btnLabel={actionLabel} variant="theme" innerRef={actionBtnRef} type="submit" onClick={action} />
                  </div>
                </footer>
              </div>
            </Transition.Child>
          </form>
        </Dialog>
      </Transition.Root>
    </>
  );
};
