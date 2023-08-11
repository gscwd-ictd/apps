import Link from 'next/link';

export default function ComingSoon() {
  return (
    <>
      <div className="min-w-full min-h-[100%] h-full select-none">
        <div className="flex flex-col items-center justify-center h-full gap-1 ">
          {/** 404 */}
          <div className="flex items-center text-6xl font-bold text-blue-400">
            <span className="-tracking-tighter">Coming Soon</span>
          </div>

          {/** Oops  */}
          <div className="flex items-center text-3xl font-semibold text-gray-400">
            <span className="tracking-tighter"> This page is on-going!</span>
          </div>

          {/** Never existed  */}
          <div className="flex items-center text-lg font-medium ">
            <span className="text-gray-700 ">
              Please bear with us. Thank you!
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
