/* This function is used for rendering rest days */

function UseRenderRestDays(restDays: Array<string>) {
  const tempRestDays = restDays.map((restDay, index: number) => {
    if (restDay === 'Sunday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium  py-0.5 w-[6rem] text-center rounded "
        >
          Sunday
        </span>
      );
    } else if (restDay === 'Monday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium  py-0.5 w-[6rem] text-center rounded "
        >
          Monday
        </span>
      );
    } else if (restDay === 'Tuesday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium  py-0.5 rounded w-[6rem] text-center "
        >
          Tuesday
        </span>
      );
    } else if (restDay === 'Wednesday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium  py-0.5 rounded w-[6rem] text-center "
        >
          Wednesday
        </span>
      );
    } else if (restDay === 'Thursday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium  py-0.5 rounded w-[6rem] text-center "
        >
          Thursday
        </span>
      );
    } else if (restDay === 'Friday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium  py-0.5 rounded w-[6rem] text-center "
        >
          Friday
        </span>
      );
    } else if (restDay === 'Saturday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium  py-0.5 rounded w-[6rem] text-center "
        >
          Saturday
        </span>
      );
    } else {
      return (
        <span
          key={index}
          className="bg-green-500 text-white text-xs font-medium  py-0.5 rounded w-[6rem] text-center "
        >
          N/A
        </span>
      );
    }
  });
  return (
    <div className="flex flex-wrap w-full gap-1">
      {tempRestDays && tempRestDays.length > 0 ? (
        tempRestDays
      ) : (
        <span className="bg-gray-400 text-white text-xs font-medium px-2.5 py-0.5 w-[6rem] text-center rounded">
          No rest day
        </span>
      )}
    </div>
  );
}

export default UseRenderRestDays;
