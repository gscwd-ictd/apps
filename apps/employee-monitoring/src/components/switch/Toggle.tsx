import { Switch } from '@headlessui/react';

type ToggleProps = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  label: JSX.Element | string;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  disabled?: boolean;
};

export default function Toggle({
  enabled,
  setEnabled,
  label,
  labelPosition = 'right',
  disabled = false,
}: ToggleProps) {
  return (
    <Switch.Group>
      <div
        className={`${
          labelPosition === 'right'
            ? 'flex items-center'
            : labelPosition === 'left'
            ? 'flex flex-row-reverse justify-end items-center'
            : labelPosition === 'top'
            ? 'flex flex-col-reverse '
            : labelPosition === 'bottom'
            ? 'flex flex-col'
            : null
        }  gap-2`}
      >
        <Switch
          checked={enabled}
          onChange={setEnabled}
          disabled={disabled}
          className={`${
            enabled ? 'bg-blue-400 ' : 'hover:bg-blue-100 bg-gray-200'
          } relative inline-flex  h-6 w-11 items-center gap-2 rounded-full`}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }  inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <Switch.Label className="text-xs text-gray-700 hover:cursor-pointer">
          {label}
        </Switch.Label>
      </div>
    </Switch.Group>
  );
}
