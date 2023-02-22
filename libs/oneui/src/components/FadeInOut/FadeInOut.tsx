import { Transition } from '@headlessui/react';
import React, { Fragment, FunctionComponent, ReactNode } from 'react';

type FadeInOutProps = {
  children?: ReactNode | Array<ReactNode>;
};

export const FadeInOut: FunctionComponent<FadeInOutProps> = ({ children }) => {
  return (
    <>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {children}
      </Transition.Child>
    </>
  );
};
