import { BiAnalyse, BiLike, BiRotateLeft, BiSend } from 'react-icons/bi';
import { PrfTrail } from '../../../pages/[id]/prf/[prf_id]';

type PrfTimelineProps = {
  prfTrail: PrfTrail;
};

type PrfTimelineNodeProps = {
  updatedAt?: Date;
  status: string;
  name: string;
  endName?: string;
  endStatus?: string;
  isEndNode?: boolean;
};

export const PrfTimeline = ({ prfTrail }: PrfTimelineProps): JSX.Element => {
  console.log(prfTrail);

  return (
    <>
      <div className="flex items-center justify-between">
        <PrfTimelineNode updatedAt={prfTrail.division.updatedAt} name={prfTrail.division.name} status={prfTrail.division.status} />

        <PrfTimelineNode updatedAt={prfTrail.division.updatedAt} name={prfTrail.department.name} status={prfTrail.department.status} />

        <PrfTimelineNode updatedAt={prfTrail.division.updatedAt} name={prfTrail.agm.name} status={prfTrail.agm.status} />

        <PrfTimelineNode
          updatedAt={prfTrail.division.updatedAt}
          endName={prfTrail.gm.name}
          name={prfTrail.admin.name}
          isEndNode
          status={prfTrail.admin.status}
          endStatus={prfTrail.gm.status}
        />
      </div>
    </>
  );
};

export const PrfTimelineNode = ({ updatedAt, name, endName = '', status, endStatus, isEndNode = false }: PrfTimelineNodeProps): JSX.Element => {
  if (!isEndNode) {
    return (
      <>
        <div className="flex flex-col justify-center flex-grow h-20 gap-3 w-96">
          <div className="flex items-center w-full">
            <div className="flex items-center justify-center w-10 h-10 border-2 border-indigo-100 rounded-full shrink-0 bg-indigo-50">
              {status === 'Sent' ? (
                <>
                  <BiSend className="text-indigo-500" />
                </>
              ) : status === 'Pending' ? (
                <>
                  <BiRotateLeft className="text-indigo-500" />
                </>
              ) : status === 'For approval' ? (
                <>
                  <BiAnalyse className="text-indigo-500" />
                </>
              ) : (
                <>
                  <BiLike className="text-indigo-500" />
                </>
              )}
            </div>
            <div className="mx-3 h-[0.10rem] w-full border-t border-dashed border-t-gray-300"></div>
          </div>
          <div>
            <p className="text-sm">{name}</p>
            <p className="text-xs text-gray-400">{status}</p>
            <p>{updatedAt && `${updatedAt}`}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col justify-center flex-grow h-20 gap-3 w-96">
      <div className="flex items-center w-full">
        <div className="flex items-center justify-center w-10 h-10 border-2 border-indigo-100 rounded-full shrink-0 bg-indigo-50">
          {status === 'Sent' ? (
            <>
              <BiSend className="text-indigo-500" />
            </>
          ) : status === 'Pending' ? (
            <>
              <BiRotateLeft className="text-indigo-500" />
            </>
          ) : status === 'For approval' ? (
            <>
              <BiAnalyse className="text-indigo-500" />
            </>
          ) : (
            <>
              <BiLike className="text-indigo-500" />
            </>
          )}
        </div>
        <div className="mx-3 h-[0.10rem] w-full border-t border-dashed border-t-gray-300"></div>
        <div className="flex items-center justify-center w-10 h-10 border-2 border-indigo-100 rounded-full shrink-0 bg-indigo-50">
          {status === 'Sent' ? (
            <>
              <BiSend className="text-indigo-500" />
            </>
          ) : status === 'Pending' ? (
            <>
              <BiRotateLeft className="text-indigo-500" />
            </>
          ) : status === 'For approval' ? (
            <>
              <BiAnalyse className="text-indigo-500" />
            </>
          ) : (
            <>
              <BiLike className="text-indigo-500" />
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-sm">{name}</p>
          <p className="text-xs text-gray-400">{status}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm">{endName}</p>
          <p className="text-xs text-gray-400">{endStatus}</p>
        </div>
      </div>
    </div>
  );
};
