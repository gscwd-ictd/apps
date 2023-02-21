import { Popover } from '@headlessui/react';
import { useState } from 'react';
import { HiEye, HiXCircle } from 'react-icons/hi';

type PopoverProps = {
    data?: any;
    icon?: any;
};

export const RankingPopover = ({ data, icon }: PopoverProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <Popover className="" as='nav'>
            {({ open }) => (
                <>
                    <Popover.Button className="hover:cursor-pointer" tabIndex={-1}>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="absolute z-0 w-5 h-5 -mt-4 " viewBox="0 0 20 20" fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                    />
                </svg> */}
                        <HiEye className={open ? 'text-indigo-500' : 'text-black'} />
                    </Popover.Button>
                    {open && (
                        <div>
                            <Popover.Panel static className="absolute z-40 top-52 bottom-52 right-52 left-52 cursor-pointer rounded-xl border-4 border-dotted bg-white p-5 shadow-xl">
                                <>
                                    <div className='w-full'>
                                        {/* <HiXCircle onClick={() => setIsOpen(false)} onBlur={() => setIsOpen(false)} className='-right-0 top-1 absolute' /> */}
                                        <div >{data.applicantName}</div>
                                        <div>Average: {data.average}</div>

                                    </div>
                                </>
                            </Popover.Panel>
                        </div>
                    )}
                </>
            )}
        </Popover>
    );
};
