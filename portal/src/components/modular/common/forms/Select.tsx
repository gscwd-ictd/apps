import { Listbox } from '@headlessui/react';
import { Fragment, useState } from 'react';

type SelectProps = {
  options: Array<string | object>;
};

export const Select = ({ options }: SelectProps): JSX.Element => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  return (
    <Listbox value={selectedOption} onChange={setSelectedOption}>
      <div className="relative">
        <Listbox.Button className="flex w-full items-center justify-between rounded border px-3 py-2 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100">
          <>{selectedOption}</>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 w-full rounded border bg-white py-3 shadow-lg shadow-gray-100 focus:outline-none">
          {options.map((option: any, idx: number) => (
            /* Use the `active` state to conditionally style the active option. */
            /* Use the `selected` state to conditionally style the selected option. */
            <Listbox.Option key={idx} value={option} as={Fragment}>
              {({ active, selected }) => (
                <li className={`${active ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-black'} cursor-pointer items-center py-1 px-3`}>
                  <p className={`${selected ? 'font-medium text-indigo-700' : null} ml-2`}>{option}</p>
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};
