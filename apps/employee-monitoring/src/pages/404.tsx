import Link from 'next/link';

export default function Page404() {
  return (
    <>
      <div className="min-w-full min-h-[100%] h-full select-none">
        <div className="flex flex-col items-center justify-center h-full gap-1 ">
          {/** 404 */}
          <div className="flex items-center text-6xl font-bold text-blue-400">
            <span className="-tracking-tighter">404</span>
          </div>

          {/** Oops  */}
          <div className="flex items-center text-3xl font-semibold text-gray-400">
            <span className="tracking-tighter">
              {' '}
              Oops! The requested resource is not found
            </span>
          </div>

          {/** Never existed  */}
          <div className="flex items-center text-lg font-medium ">
            <span className="text-gray-700 ">
              ...maybe the resource you&apos;re looking for is not found or
              never existed.
            </span>
          </div>

          {/** Button */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-white bg-blue-400 rounded-full"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
