import { Listbox } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

type SelectAsyncProps = {
  options: Array<any>;
  target: string;
  subTarget?: string;
};

export const SelectAsync = ({ options, target, subTarget = '' }: SelectAsyncProps): JSX.Element => {
  const [itemOptions, setItemOptions] = useState<any>(options);
  const [selectedOption, setSelectedOption] = useState<any>('');

  useEffect(() => {
    setItemOptions(options);
  }, [options]);


  return (
    <Listbox value={selectedOption} onChange={setItemOptions}>
      <div className="relative">
        <Listbox.Button className="flex w-full items-center justify-between rounded border px-3 py-2 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100">
          {selectedOption}
          <span>{/* <ChevronDownHi className="h-4 w-4" /> */}</span>
        </Listbox.Button>
        <Listbox.Options className="py-3focus:outline-none absolute mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white">
          {options.map((option: any, idx: number) => (
            /* Use the `active` state to conditionally style the active option. */
            /* Use the `selected` state to conditionally style the selected option. */
            <Listbox.Option key={idx} value={option} as={Fragment}>
              {({ active, selected }) => (
                <li className={`${active ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-black'} mb- cursor-pointer items-center py-1 px-3`}>
                  <p className={`${selected ? 'font-medium text-indigo-700' : null} ml-2`} onClick={() => setSelectedOption(option[target])}>
                    {option[target]}
                  </p>
                  <p className="px-2 text-sm text-gray-400" onClick={() => setSelectedOption(option[target])}>
                    {option[subTarget]}
                  </p>
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};
