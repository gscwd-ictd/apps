import { Popover } from '@headlessui/react';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { PrfStatus } from '../../../../types/prf.types';

type PrfNodePopoverProps = {
  children: React.ReactNode;
  position: string;
  designation: string;
  status: string;
  updatedAt?: Date;
  createdAt?: Date;
};

export const PrfNodePopover: FunctionComponent<PrfNodePopoverProps> = ({
  children,
  position,
  designation,
  status,
  createdAt,
  updatedAt,
}) => {
  return (
    <Popover className="relative">
      <Popover.Button>{children}</Popover.Button>

      <Popover.Panel
        className={`absolute -top-[10.5rem] -left-[8rem] z-50 rounded-lg border-2 border-gray-100 bg-white shadow-lg shadow-gray-200`}
      >
        <div className="w-80 p-4">
          <div className="border-b border-b-gray-100 pb-2">
            <h5 className="font-medium text-gray-700">{position}</h5>
            <p className="truncate text-sm text-gray-500">{designation}</p>
          </div>
          <div className="mt-5">
            {status === PrfStatus.SENT || status === PrfStatus.APPROVED ? (
              <>
                <p className="mb-1 text-sm text-gray-600">
                  {status === PrfStatus.SENT ? 'Requested at:' : 'Approved at:'}
                </p>
                <div className="flex gap-5 text-sm">
                  <div className="flex items-center gap-1">
                    <HiOutlineCalendar className="text-indigo-700" />
                    <p className="font-medium text-indigo-500">
                      {dayjs(`${status === PrfStatus.SENT ? createdAt : updatedAt}`).format('MMMM DD, YYYY')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <HiOutlineClock className="text-indigo-700" />
                    <p className="font-medium text-indigo-500">
                      {dayjs(`${status === PrfStatus.SENT ? createdAt : updatedAt}`).format('hh:mm A')}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="mb-1 text-sm text-gray-600">
                  {status === PrfStatus.DISAPPROVED ? 'Disapproved at' : 'Approved at:'}
                </p>
                <div className="flex gap-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <HiOutlineCalendar
                      className={`${
                        status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL
                          ? 'text-orange-500'
                          : 'text-rose-500'
                      }`}
                    />
                    <p
                      className={`font-medium ${
                        status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL
                          ? 'text-orange-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {status === PrfStatus.DISAPPROVED ? dayjs(updatedAt).format('MMMM DD, YYYY') : status}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <HiOutlineClock
                      className={`${
                        status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL
                          ? 'text-orange-500'
                          : 'text-rose-500'
                      }`}
                    />
                    <p
                      className={`font-medium ${
                        status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL
                          ? 'text-orange-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {status === PrfStatus.DISAPPROVED ? dayjs(updatedAt).format('hh:mm A') : status}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
};
