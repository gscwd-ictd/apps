import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { HiDocumentSearch, HiOutlineCalendar, HiOutlineDocumentDuplicate, HiOutlinePencil } from 'react-icons/hi';
import { Prf } from '../../../types/prf.type';

type PrfItem = {
  prf: Prf;
};

export const PrfItem = ({ prf }: PrfItem): JSX.Element => {
  const router = useRouter();

  return (
    <>
      <div className="flex shrink-0 gap-5 px-5 pb-7">
        <div
          onClick={() => router.push(`/${router.query.id}/prf/${prf._id}?render_type=view`)}
          className="group flex h-60 w-48 cursor-pointer items-center justify-center rounded border transition-shadow ease-in-out hover:shadow-xl hover:shadow-slate-200"
        >
          <HiDocumentSearch className="h-16 w-16 text-gray-200 transition-all ease-in-out group-hover:scale-125 group-hover:text-indigo-500" />
        </div>
        <div>
          <header>
            <h5
              className="cursor-pointer text-xl font-medium text-gray-600 hover:text-indigo-800"
              onClick={() => router.push(`/${router.query.id}/prf/${prf._id}?render_type=view`)}
            >
              {prf.prfNo}
            </h5>
            <p className="text-sm text-gray-400">Requested last {dayjs(prf.dateRequested).format('MMMM DD, YYYY')}</p>
          </header>
          <main className="mt-10">
            <ul className="text-gray-700">
              <li className="mb-3 flex cursor-default items-center gap-3 pb-2 transition-transform ease-in-out hover:scale-105">
                <HiOutlineDocumentDuplicate className="h-5 w-5 text-indigo-500" />
                <p>{prf.prfPositions.length === 1 ? `${prf.prfPositions.length} position` : `${prf.prfPositions.length} positions`} requested</p>
              </li>
              <li className="mb-3 flex cursor-default items-center gap-3 pb-2 transition-transform ease-in-out hover:scale-105">
                <HiOutlineCalendar className="h-5 w-5 text-indigo-500" />
                <p>Needed on {dayjs(prf.dateNeeded).format('MMMM DD, YYYY')}</p>
              </li>
              <li className="mb-3 flex cursor-default items-center gap-3 pb-2 transition-transform ease-in-out hover:scale-105">
                <HiOutlinePencil className="h-[1.18rem] w-[1.18rem] text-indigo-500 " />
                <p>{prf.withExam ? 'Examination is required' : 'No examination required'}</p>
              </li>
            </ul>
          </main>
        </div>
      </div>
    </>
  );
};
