export const PrfModalLoading = (): JSX.Element => {
  return (
    <div className="grid h-[35rem] grid-cols-5 gap-3 overflow-y-auto bg-opacity-70">
      <div className="col-span-2 flex animate-pulse space-x-4">
        <div className="flex-1 space-y-6 py-1">
          <div className="h-16 space-y-3 rounded bg-slate-100 p-5">
            <div className="col-span-1 h-2 w-80 rounded bg-slate-300"></div>
            <div className="col-span-1 h-2 w-40 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 space-y-3 rounded bg-slate-100 p-5">
            <div className="col-span-1 h-2 w-80 rounded bg-slate-300"></div>
            <div className="col-span-1 h-2 w-40 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 space-y-3 rounded bg-slate-100 p-5">
            <div className="col-span-1 h-2 w-80 rounded bg-slate-300"></div>
            <div className="col-span-1 h-2 w-40 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 space-y-3 rounded bg-slate-100 p-5">
            <div className="col-span-1 h-2 w-80 rounded bg-slate-300"></div>
            <div className="col-span-1 h-2 w-40 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 space-y-3 rounded bg-slate-100 p-5">
            <div className="col-span-1 h-2 w-80 rounded bg-slate-300"></div>
            <div className="col-span-1 h-2 w-40 rounded bg-slate-200"></div>
          </div>
          <div className="h-16 space-y-3 rounded bg-slate-100 p-5">
            <div className="col-span-1 h-2 w-80 rounded bg-slate-300"></div>
            <div className="col-span-1 h-2 w-40 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
      <div className="col-span-3 mt-1 animate-pulse">
        <div className="mb-5 h-36 w-full rounded bg-slate-100 p-5">
          <div className="flex gap-5">
            <div className="h-12 w-14 rounded bg-slate-200"></div>
            <div className="w-full">
              <div className="mb-3 h-5 w-full rounded bg-slate-200"></div>
              <div className="h-3 w-[calc(100%-5rem)] rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="mt-4 h-10 w-full rounded bg-slate-200"></div>
        </div>
        <div className="mb-5 h-36 w-full rounded bg-slate-100 p-5">
          <div className="flex gap-5">
            <div className="h-12 w-14 rounded bg-slate-200"></div>
            <div className="w-full">
              <div className="mb-3 h-5 w-full rounded bg-slate-200"></div>
              <div className="h-3 w-[calc(100%-5rem)] rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="mt-4 h-10 w-full rounded bg-slate-200"></div>
        </div>

        <div className="mb-5 h-36 w-full rounded bg-slate-100 p-5">
          <div className="flex gap-5">
            <div className="h-12 w-14 rounded bg-slate-200"></div>
            <div className="w-full">
              <div className="mb-3 h-5 w-full rounded bg-slate-200"></div>
              <div className="h-3 w-[calc(100%-5rem)] rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="mt-4 h-10 w-full rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};
