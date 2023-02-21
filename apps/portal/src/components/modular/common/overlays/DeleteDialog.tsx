import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, MouseEventHandler, SetStateAction } from 'react';
import { Button } from '../forms/Button';

export type AlertDialogProps = {
  title?: string;
  message?: string;
  isOpen: boolean;
  verticalCenter?: boolean;
  isStatic?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  action: MouseEventHandler<HTMLButtonElement>;
};

export const DeleteDialog = ({
  title = 'Delete',
  message = 'Are you sure you want to remove this item?',
  isOpen,
  verticalCenter = true,
  isStatic = true,
  setIsOpen,
  action,
}: AlertDialogProps): JSX.Element => {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={isStatic ? () => null : closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Dialog.Overlay className={`fixed inset-0 bg-black bg-opacity-60 transition-opacity`} />
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
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-600">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button btnLabel="Cancel" btnVariant="white" onClick={closeModal} />
                  <Button btnLabel="Delete" btnVariant="danger" onClick={action} />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
