/* This function is used for rendering rest days */

import dayjs from 'dayjs';

function UseRenderDatePill(restDays: Array<string>) {
  const tempRestDays = restDays.map((restDay, index: number) => {
    return (
      <span
        key={index}
        className="bg-green-500 text-white text-xs font-medium  py-0.5 rounded w-[6rem] text-center "
      >
        {dayjs(restDay).format('MMMM DD, YYYY')}
      </span>
    );
  });
  return (
    <div className="flex flex-wrap w-full gap-1">
      {tempRestDays && tempRestDays.length > 0 ? (
        <>{tempRestDays}</>
      ) : (
        <span className="bg-gray-400 text-white text-xs font-medium px-2.5 py-0.5 min-w-[6rem] text-center rounded">
          No selected rest day
        </span>
      )}
    </div>
  );
}

export default UseRenderDatePill;
