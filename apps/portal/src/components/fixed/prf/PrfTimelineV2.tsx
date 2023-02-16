import { PrfTrail } from '../../../pages/[id]/prf/[prf_id]';
import { Popover } from '@headlessui/react';
import { ReactChild, ReactChildren, ReactNode } from 'react';
import dayjs from 'dayjs';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { PrfStatus } from '../../../types/prf.type';

type PrfTimelineProps = {
  prfTrail: PrfTrail;
  createdAt?: Date;
};

type PrfTimelineNodeProps = {
  status: string;
  name: string;
  photoUrl: string;
  position: string;
  updatedAt: Date;
  createdAt?: Date;
  designation: string;
};

type PrfTimelineNodePopoverProps = {
  children: ReactNode | ReactNode[];
  position: string;
  designation: string;
  status: string;
  updatedAt?: Date;
  createdAt?: Date;
};

export const PrfTimelineV2 = ({ prfTrail, createdAt }: PrfTimelineProps): JSX.Element => {
  const { division, department, agm, admin, gm } = prfTrail;

  console.log(prfTrail);

  return (
    <>
      <div className="flex gap-1">
        {division.name !== 'N/A' && (
          <PrfTimelineNode
            status={division.status}
            name={division.name}
            position={division.position}
            createdAt={createdAt}
            updatedAt={division.updatedAt}
            designation={division.designation}
            photoUrl="https://cdn.lorem.space/images/face/.cache/500x0/pexels-alena-darmel-7710127.jpg"
          />
        )}

        {department.name !== 'N/A' && (
          <PrfTimelineNode
            status={department.status}
            name={department.name}
            designation={department.designation}
            createdAt={createdAt}
            updatedAt={department.updatedAt}
            position={department.position}
            photoUrl="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        )}

        {agm.name !== 'N/A' && (
          <PrfTimelineNode
            status={agm.status}
            name={agm.name}
            position={agm.position}
            designation={agm.designation}
            createdAt={createdAt}
            updatedAt={agm.updatedAt}
            photoUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
          />
        )}

        {admin.name !== 'N/A' && (
          <PrfTimelineNode
            status={admin.status}
            name={admin.name}
            position={admin.position}
            designation={admin.designation}
            createdAt={createdAt}
            updatedAt={admin.updatedAt}
            photoUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        )}

        <PrfTimelineNode
          status={gm.status}
          name={gm.name}
          position={gm.position}
          designation={gm.designation}
          updatedAt={gm.updatedAt}
          photoUrl="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        />
      </div>
    </>
  );
};

const PrfTimelineNode = ({ status, name, photoUrl, position, designation, createdAt, updatedAt }: PrfTimelineNodeProps): JSX.Element => {
  return (
    <>
      <div className="h-32 w-full">
        <div className="flex h-20 w-full flex-grow items-center justify-center">
          <div
            className={`h-[0.10rem] w-full border-t-[3px] border-dashed ${
              status === PrfStatus.SENT
                ? 'border-t-indigo-500'
                : status === PrfStatus.APPROVED
                ? 'border-t-indigo-500'
                : status === PrfStatus.DISAPPROVED
                ? 'border-t-rose-400'
                : 'border-t-gray-300'
            } `}
          ></div>

          <div
            className={`mx-3 flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border-4 bg-white ${
              status === PrfStatus.SENT || status === PrfStatus.APPROVED
                ? 'border-indigo-400 ring-1 ring-indigo-400'
                : status === PrfStatus.DISAPPROVED
                ? 'border-rose-400 transition-colors ease-in-out hover:border-rose-500 hover:ring-1 hover:ring-rose-500'
                : status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL
                ? 'border-gray-300 ring-1 ring-gray-300 transition-colors ease-in-out'
                : ''
            }`}
          >
            <PrfTimelineNodePopover
              status={status}
              createdAt={createdAt}
              updatedAt={updatedAt}
              position={position}
              designation={designation}
            >
              <img className="inline-block h-14 w-14 rounded-full ring-2 ring-white" src={photoUrl} alt=""></img>
            </PrfTimelineNodePopover>
          </div>

          <div
            className={`h-[0.10rem] w-full border-t-[3px] border-dashed ${
              status === PrfStatus.SENT
                ? 'border-t-indigo-500'
                : status === PrfStatus.APPROVED
                ? 'border-t-indigo-500'
                : status === PrfStatus.DISAPPROVED
                ? 'border-t-rose-400'
                : 'border-t-gray-300'
            } `}
          ></div>
        </div>
        <div className="mt-2 flex justify-center">
          <div className="font-medium">
            <h5 className="text-center text-gray-700">{name}</h5>
            <p
              className={`text-center text-sm ${status === PrfStatus.SENT && 'text-indigo-700'} ${
                status === PrfStatus.APPROVED && 'text-indigo-700'
              } ${status === PrfStatus.FOR_APPROVAL && 'text-gray-500'} ${status === PrfStatus.PENDING && 'text-gray-500'} ${
                status === PrfStatus.DISAPPROVED && 'text-rose-500'
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

const PrfTimelineNodePopover = ({ children, position, designation, status, createdAt, updatedAt }: PrfTimelineNodePopoverProps) => {
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
                <p className="mb-1 text-sm text-gray-600">{status === PrfStatus.SENT ? 'Requested at:' : 'Approved at:'}</p>
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
                <p className="mb-1 text-sm text-gray-600">{status === PrfStatus.DISAPPROVED ? 'Disapproved at' : 'Approved at:'}</p>
                <div className="flex gap-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <HiOutlineCalendar
                      className={`${
                        status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL ? 'text-orange-500' : 'text-rose-500'
                      }`}
                    />
                    <p
                      className={`font-medium ${
                        status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL ? 'text-orange-500' : 'text-rose-500'
                      }`}
                    >
                      {status === PrfStatus.DISAPPROVED ? dayjs(updatedAt).format('MMMM DD, YYYY') : status}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <HiOutlineClock
                      className={`${
                        status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL ? 'text-orange-500' : 'text-rose-500'
                      }`}
                    />
                    <p
                      className={`font-medium ${
                        status === PrfStatus.PENDING || status === PrfStatus.FOR_APPROVAL ? 'text-orange-500' : 'text-rose-500'
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
