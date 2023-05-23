import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();

  return (
    <>
      <div className="min-w-full min-h-[100%] h-screen select-none">
        <div className="flex flex-col items-center justify-center h-full gap-1">
          {/** 404 */}
          <div className="flex items-center font-bold text-red-500 text-7xl animate-bounce">
            <span className="uppercase -tracking-tighter">Closed</span>
          </div>

          {/** Oops  */}
          <div className="flex items-center text-3xl font-semibold text-gray-400">
            <span className="tracking-tighter">
              Encoding of Personal Data Sheet is now closed!
            </span>
          </div>

          {/** Never existed  */}
          <div className="flex flex-col items-center text-lg font-medium">
            <span className="text-gray-700 ">
              ...if you have concerns, please contact the{' '}
              <span className="font-bold">HR Department</span> for more details
            </span>
          </div>

          {/** Button */}
          <div className="flex items-center">
            <button
              className="px-3 py-2 text-white bg-blue-300 rounded"
              onClick={() =>
                router.push(`${process.env.NEXT_PUBLIC_PORTAL_FE_URL}`)
              }
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
