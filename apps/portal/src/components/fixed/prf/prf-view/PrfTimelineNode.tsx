import { FunctionComponent } from 'react';
import { PrfStatus } from '../../../../types/prf.types';
import { PrfNodePopover } from './PrfNodePopover';

type PrfTimelineNodeProps = {
  status: string;
  name: string;
  photoUrl: string;
  position: string;
  updatedAt: Date;
  createdAt?: Date;
  designation: string;
};

export const PrfTimelineNode: FunctionComponent<PrfTimelineNodeProps> = ({
  status,
  name,
  photoUrl,
  position,
  designation,
  createdAt,
  updatedAt,
}) => {
  return (
    <>
      <div className="w-full h-32">
        <div className="flex items-center justify-center flex-grow w-full h-20">
          <div
            className={`h-[0.10rem] w-full border-t-[3px] border-dashed ${
              status === PrfStatus.SENT
                ? 'border-t-indigo-500'
                : status === PrfStatus.APPROVED
                ? 'border-t-indigo-500'
                : status === PrfStatus.DISAPPROVED
                ? 'border-t-rose-400'
                : status === PrfStatus.CANCELLED
                ? 'border-t-red-600'
                : 'border-t-gray-300'
            } `}
          ></div>

          <div
            className={`mx-3 flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-4 bg-white ${
              status === PrfStatus.SENT || status === PrfStatus.APPROVED
                ? 'border-indigo-400 ring-1 ring-indigo-400'
                : status === PrfStatus.DISAPPROVED
                ? 'border-rose-400 transition-colors ease-in-out hover:border-rose-500 hover:ring-1 hover:ring-rose-500'
                : status === PrfStatus.CANCELLED
                ? 'border-red-600 transition-colors ease-in-out hover:border-red-700 hover:ring-1 hover:ring-red-500'
                : status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL
                ? 'border-gray-300 ring-1 ring-gray-300 transition-colors ease-in-out'
                : ''
            }`}
          >
            <PrfNodePopover
              status={status}
              createdAt={createdAt}
              updatedAt={updatedAt}
              position={position}
              designation={designation}
            >
              <img className="inline-block rounded-full h-14 w-14 ring-2 ring-white" src={photoUrl} alt=""></img>
            </PrfNodePopover>
          </div>

          <div
            className={`h-[0.10rem] w-full border-t-[3px] border-dashed ${
              status === PrfStatus.SENT
                ? 'border-t-indigo-500'
                : status === PrfStatus.APPROVED
                ? 'border-t-indigo-500'
                : status === PrfStatus.DISAPPROVED
                ? 'border-t-rose-400'
                : status === PrfStatus.CANCELLED
                ? 'border-t-red-600'
                : 'border-t-gray-300'
            } `}
          ></div>
        </div>
        <div className="flex justify-center mt-2">
          <div className="font-medium">
            <h5 className="text-center text-gray-700 w-[10rem] truncate">{name}</h5>
            <p
              className={`text-center text-sm ${status === PrfStatus.SENT && 'text-indigo-700'} ${
                status === PrfStatus.APPROVED && 'text-indigo-700'
              } ${status === PrfStatus.FOR_APPROVAL && 'text-gray-500'} ${
                status === PrfStatus.PENDING && 'text-gray-500'
              } ${status === PrfStatus.DISAPPROVED && 'text-rose-500'} ${
                status === PrfStatus.CANCELLED && 'text-red-600'
              }`}
            >
              {status}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
