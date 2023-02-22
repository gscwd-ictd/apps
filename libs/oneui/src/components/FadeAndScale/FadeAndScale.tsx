import { Transition } from '@headlessui/react';
import React, { Fragment, FunctionComponent, ReactNode } from 'react';

type FadeAndScaleProps = {
  children: ReactNode | Array<ReactNode>;
};

export const FadeAndScale: FunctionComponent<FadeAndScaleProps> = ({ children }) => {
  return (
    <>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {children}
      </Transition.Child>
    </>
  );
};
