import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { Switch } from '@headlessui/react';

type ToggleProps = {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
};

export const Toggle: FunctionComponent<ToggleProps> = ({ enabled, setEnabled }) => {
  return (
    <div className="py-16">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-green-600' : 'bg-gray-300'}
          relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
};
