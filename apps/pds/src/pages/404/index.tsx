import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  return (
    <>
      <div className="min-w-full min-h-[100%] h-screen select-none">
        <div className="flex flex-col items-center justify-center h-full gap-1 ">
          {/** 404 */}
          <div className="flex items-center text-6xl font-bold text-blue-400">
            <span className="-tracking-tighter">404</span>
          </div>

          {/** Oops  */}
          <div className="flex items-center text-3xl font-semibold text-gray-400">
            <span className="tracking-tighter"> Oops! Page Not Found</span>
          </div>

          {/** Never existed  */}
          <div className="flex items-center text-lg font-medium ">
            <span className="text-gray-700 ">
              ...maybe the page you&apos;re looking for is not found or never
              existed.
            </span>
          </div>

          {/** Button */}
          <div className="flex items-center">
            <button
              className="px-3 py-2 bg-blue-300 text-white rounded"
              onClick={() => router.back()}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
