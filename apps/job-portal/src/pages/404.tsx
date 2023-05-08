import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import TopNavigation from '../components/page-header/TopNavigation';
import { Button } from '@gscwd-apps/oneui';

const Page404: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <TopNavigation />
      <div className="text-center m-9 flex w-full justify-center h-[44rem] flex-col">
        <div className="text-4xl font-semibold drop-shadow-xl">Oops!</div>
        <div className="text-xl font-base">Something went wrong</div>
        <div>
          <Button variant="warning" onClick={() => router.back()}>
            Go back to the previous page
          </Button>
        </div>
      </div>
    </>
  );
};

export default Page404;
