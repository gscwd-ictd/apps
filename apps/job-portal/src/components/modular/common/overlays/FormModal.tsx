import { Transition, Dialog } from '@headlessui/react';

import { Dispatch, Fragment, MouseEventHandler, SetStateAction } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { StyledButton } from '../../buttons/StyledButton';

type FormModalProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  modalSize?:
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | 'xxxl'
    | 'xxxxl'
    | 'xxxxxl'
    | 'xxxxxxl'
    | 'xxxxxxxl'
    | 'full';
  isOpen: boolean;
  verticalCenter?: boolean;
  isStatic?: boolean;
  disableActionBtn?: boolean;
  disableCancelBtn?: boolean;
  actionLabel?: React.ReactNode;
  withActionBtn?: boolean;
  withCancelBtn?: boolean;
  withCloseBtn?: boolean;
  cancelLabel?: React.ReactNode;
  actionBtnClassName?: string;
  cancelBtnClassName?: string;
  actionBtnVariant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'light'
    | 'dark'
    | 'theme';
  cancelBtnVariant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'light'
    | 'dark'
    | 'theme';
  btnTypeState?: 'button' | 'submit' | 'reset' | undefined;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onAction: MouseEventHandler<HTMLButtonElement>;
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

export const FormModal = ({
  title = 'Modal Title',
  subtitle = 'You may include a subtitle for this modal',
  children,
  modalSize = 'lg',
  isOpen,
  verticalCenter = false,
  isStatic = false,
  disableActionBtn = false,
  disableCancelBtn = false,
  actionLabel = 'Confirm',
  withActionBtn = true,
  withCancelBtn = false,
  withCloseBtn = true,
  cancelLabel = 'Cancel',
  actionBtnClassName,
  cancelBtnClassName,
  btnTypeState = 'button',
  actionBtnVariant = 'theme',
  cancelBtnVariant = 'light',
  onClose,
  onCancel,
  setIsOpen,
  onAction,
}: FormModalProps): JSX.Element => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <form>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={isStatic ? () => null : () => setIsOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
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
                <Dialog.Overlay
                  className={`fixed inset-0 bg-black bg-opacity-20 transition-opacity`}
                />
              </Transition.Child>

              {verticalCenter ? (
                <>
                  <span
                    className="inline-block h-screen align-middle"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                </>
              ) : null}

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div
                  className={`${size[modalSize]} z-50 my-4 inline-block w-full transform overflow-visible rounded-lg bg-white p-10 text-left align-middle shadow-xl transition-all`}
                >
                  <header className="mb-3">
                    <section className="flex items-center justify-between">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-medium leading-6 text-gray-600"
                      >
                        {title}
                      </Dialog.Title>

                      {withCloseBtn && (
                        <button onClick={onClose}>
                          <HiOutlineX className="p-2 text-gray-600 transition-colors rounded-full cursor-pointer h-9 w-9 hover:bg-slate-100" />
                        </button>
                      )}
                    </section>

                    <section>
                      <Dialog.Title
                        as="p"
                        className="text-sm leading-6 text-gray-500"
                      >
                        {subtitle}
                      </Dialog.Title>
                    </section>
                  </header>

                  <main>
                    <div className="w-full">{children}</div>
                  </main>

                  <footer>
                    <div className="flex justify-end gap-2 mt-2">
                      {withCancelBtn && (
                        <>
                          <div className={`${cancelBtnClassName} w-[4rem]`}>
                            <StyledButton
                              disabled={disableCancelBtn}
                              variant={cancelBtnVariant}
                              onClick={onCancel}
                              fluid
                            >
                              {cancelLabel}
                            </StyledButton>
                          </div>
                        </>
                      )}
                      {withActionBtn && (
                        <div className={`${actionBtnClassName} min-w-[4rem]`}>
                          <StyledButton
                            fluid
                            disabled={disableActionBtn}
                            onClick={onAction}
                            type={btnTypeState}
                            variant={actionBtnVariant}
                          >
                            {actionLabel}
                          </StyledButton>
                        </div>
                      )}
                    </div>
                  </footer>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </form>
      </Transition>
    </>
  );
};
