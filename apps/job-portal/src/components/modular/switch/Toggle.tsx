import { Switch } from '@headlessui/react'
import { useState } from 'react'

type ToggleProps = {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  label: JSX.Element | string
}

export default function Toggle({ enabled, setEnabled, label }: ToggleProps) {
  return (
    <Switch.Group>
      <div className="flex items-center gap-2">
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${enabled ? 'bg-emerald-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center gap-2 rounded-full`}
        >
          <span
            className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <Switch.Label className="hover:cursor-pointer">{label}</Switch.Label>
      </div>
    </Switch.Group>
  )
}
