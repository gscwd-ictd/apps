import { Disclosure } from '@headlessui/react';
import { title } from 'process';
import { ReactChild, ReactChildren } from 'react';

type AccordionProps = {
  title: string;
  children: ReactChild | ReactChildren;
};

export const Accordion = ({ title: children }: AccordionProps): JSX.Element => {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>{title}</span>
              </Disclosure.Button>

              <Disclosure.Panel className="mt-2 rounded border px-4 pt-4 pb-2 text-sm text-gray-500">{children}</Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};
