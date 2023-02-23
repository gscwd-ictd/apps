import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
type MyRadioGroupProps = {
  value: any
  setValue: Dispatch<SetStateAction<any>>
}

export default function MyRadioGroup({ value, setValue }: MyRadioGroupProps) {
  // const { officeRelation, setOfficeRelation } = useContext(PDSContext)

  const handleChane = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, withinThirdDegree: e.target.checked })
  }

  return (
    <RadioGroup value={value} onChange={setValue}>
      <RadioGroup.Label>a. Within the third degree?</RadioGroup.Label>
      <div className="flex gap-10 px-5">
        <RadioGroup.Option value={value} onChange={(e: any) => handleChane(e)}>
          {({ checked }) => (
            <div className="flex items-center gap-1">
              <div className={`h-5 w-5 cursor-pointer rounded-full border ${checked ? 'bg-indigo-500' : 'bg-white'}`}></div>
              <label htmlFor="yes" className="cursor-pointer">
                Yes
              </label>
            </div>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={value} onChange={(e: any) => handleChane(e)}>
          {({ checked }) => (
            <div className="flex items-center gap-1">
              <div className={`h-5 w-5 cursor-pointer rounded-full border ${checked ? 'bg-indigo-500' : 'bg-white'}`}></div>
              <label htmlFor="no" className="cursor-pointer">
                No
              </label>
            </div>
          )}
        </RadioGroup.Option>
      </div>
    </RadioGroup>
  )
}
