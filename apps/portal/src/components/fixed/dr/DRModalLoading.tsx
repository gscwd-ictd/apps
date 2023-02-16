export const DRModalLoading = (): JSX.Element => {
  return (
    <div className="grid h-[35rem] grid-cols-5 gap-3 overflow-y-auto bg-opacity-70">
      <div className="flex col-span-2 space-x-4 animate-pulse">
        <div className="flex-1 py-1 space-y-6">
          <div className="h-16 p-5 space-y-3 rounded bg-slate-100">
            <div className="h-2 col-span-1 rounded w-80 bg-slate-300"></div>
            <div className="w-40 h-2 col-span-1 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 p-5 space-y-3 rounded bg-slate-100">
            <div className="h-2 col-span-1 rounded w-80 bg-slate-300"></div>
            <div className="w-40 h-2 col-span-1 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 p-5 space-y-3 rounded bg-slate-100">
            <div className="h-2 col-span-1 rounded w-80 bg-slate-300"></div>
            <div className="w-40 h-2 col-span-1 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 p-5 space-y-3 rounded bg-slate-100">
            <div className="h-2 col-span-1 rounded w-80 bg-slate-300"></div>
            <div className="w-40 h-2 col-span-1 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 p-5 space-y-3 rounded bg-slate-100">
            <div className="h-2 col-span-1 rounded w-80 bg-slate-300"></div>
            <div className="w-40 h-2 col-span-1 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 p-5 space-y-3 rounded bg-slate-100">
            <div className="h-2 col-span-1 rounded w-80 bg-slate-300"></div>
            <div className="w-40 h-2 col-span-1 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
      <div className="col-span-3 mt-1 animate-pulse">
        <div className="w-full p-5 mb-5 rounded h-36 bg-slate-100">
          <div className="flex gap-5">
            <div className="h-12 rounded w-14 bg-slate-200"></div>
            <div className="w-full">
              <div className="w-full h-5 mb-3 rounded bg-slate-200"></div>
              <div className="h-3 w-[calc(100%-5rem)] rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="w-full h-10 mt-4 rounded bg-slate-200"></div>
        </div>
        <div className="w-full p-5 mb-5 rounded h-36 bg-slate-100">
          <div className="flex gap-5">
            <div className="h-12 rounded w-14 bg-slate-200"></div>
            <div className="w-full">
              <div className="w-full h-5 mb-3 rounded bg-slate-200"></div>
              <div className="h-3 w-[calc(100%-5rem)] rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="w-full h-10 mt-4 rounded bg-slate-200"></div>
        </div>

        <div className="w-full p-5 mb-5 rounded h-36 bg-slate-100">
          <div className="flex gap-5">
            <div className="h-12 rounded w-14 bg-slate-200"></div>
            <div className="w-full">
              <div className="w-full h-5 mb-3 rounded bg-slate-200"></div>
              <div className="h-3 w-[calc(100%-5rem)] rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="w-full h-10 mt-4 rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};
