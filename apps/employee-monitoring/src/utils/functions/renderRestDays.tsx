function UseRenderRestDays(restDays: Array<string>) {
  const tempRestDays = restDays.map((restDay, index: number) => {
    if (restDay === 'Sunday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded "
        >
          Sunday
        </span>
      );
    } else if (restDay === 'Monday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded "
        >
          Monday
        </span>
      );
    } else if (restDay === 'Tuesday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded "
        >
          Tuesday
        </span>
      );
    } else if (restDay === 'Wednesday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded "
        >
          Wednesday
        </span>
      );
    } else if (restDay === 'Thursday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded "
        >
          Thursday
        </span>
      );
    } else if (restDay === 'Friday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded "
        >
          Friday
        </span>
      );
    } else if (restDay === 'Saturday') {
      return (
        <span
          key={index}
          className="bg-blue-400 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded "
        >
          Saturday
        </span>
      );
    } else {
      return (
        <span
          key={index}
          className="bg-green-500 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded "
        >
          N/A
        </span>
      );
    }
  });
  return <div className="flex flex-wrap w-[6rem] gap-1">{tempRestDays}</div>;
}

export default UseRenderRestDays;
