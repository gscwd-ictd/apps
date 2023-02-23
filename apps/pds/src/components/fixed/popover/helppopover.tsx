import { Popover } from '@headlessui/react'

type PopoverProps = {
  label?: string
  text?: string
}

export const MyPopover = ({ text }: PopoverProps) => {
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Panel className="absolute z-40 -mt-[7%] -ml-20 cursor-pointer rounded-xl border-4 border-dotted bg-white p-5 shadow-xl">
            {
              <>
                <span className="font-light break-words">{text}</span>
              </>
            }
          </Popover.Panel>
          <Popover.Button className="cursor-help" tabIndex={-1}>
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute z-0 w-5 h-5 -mt-4 " viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </Popover.Button>
          {/* <Popover.Overlay className="fixed inset-0 bg-black opacity-30" /> */}
        </>
      )}
    </Popover>
  )
}
