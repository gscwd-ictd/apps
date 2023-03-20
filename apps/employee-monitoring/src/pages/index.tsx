import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';

export default function Index() {
  return (
    <>
      <div className="min-w-full min-h-[100%] h-full select-none">
        <div className="flex flex-col items-center justify-center h-full gap-1 ">
          {/** 404 */}
          <div className="flex items-center text-6xl font-bold text-blue-400">
            <span className="-tracking-tighter">Welcome!</span>
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {},
    redirect: { destination: '/dashboard', permanent: false },
  };
};
