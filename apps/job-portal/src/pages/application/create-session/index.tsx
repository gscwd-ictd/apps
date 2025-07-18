import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';
import { HiCheckCircle, HiShieldExclamation } from 'react-icons/hi';
import { fetchWithToken } from '../../../../utils/hoc/fetcher';
import { CardContainer } from '../../../components/modular/cards/CardContainer';
import { LoadingSpinner } from '@gscwd-apps/oneui';
import { useTabStore } from 'apps/job-portal/src/store/tab.store';

type Loading = {
  state: boolean;
  level: number;
};

type UserDetails = {
  login: 'success' | 'failed';
  details: {
    externalApplicantId: string;
    vppId: string;
  };
};

type CreateSessionProps = {
  token: string;
};

export default function CreateSession({ token }: CreateSessionProps) {
  const router = useRouter();

  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const [isLoading, setIsLoading] = useState<Loading>({
    state: false,
    level: 1,
  });
  const [userDetails, setUserDetails] = useState<UserDetails>({} as UserDetails);

  const getData = async () => {
    try {
      const details = await fetchWithToken(
        'POST',
        `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/login`,
        token
      );

      return setUserDetails(details);
    } catch (error) {
      return {};
    }
  };

  useEffect(() => {
    if (isLoading.state === false && isLoading.level === 1) {
      setIsLoading({ state: true, level: 1 });
    }
    getData();
  }, []);

  useEffect(() => {
    if (isLoading.state === true && isLoading.level === 1) {
      setTimeout(() => {
        setIsLoading({ state: true, level: 2 });
      }, 1000);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading?.level === 2 && userDetails?.login === 'success') {
      setTimeout(async () => {
        setIsLoading({ state: true, level: 3 });

        await router.push(`${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${userDetails?.details?.vppId}/checklist`);

        router.reload();
      }, 1500);
    } else if (isLoading?.level === 2 && userDetails?.login !== 'success') {
      setTimeout(() => {
        setIsLoading({ state: true, level: 3 });
      }, 1500);
    }
  }, [isLoading?.level, userDetails]);

  return (
    <>
      <div className="min-h-screen bg-white">
        <header className="shadow ">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              {isLoading?.level === 1
                ? 'Please wait'
                : isLoading?.level === 2
                ? 'Almost there'
                : isLoading?.level === 3 && userDetails?.login !== 'success'
                ? 'Oops! Something went wrong.'
                : 'Redirecting'}
            </h1>
          </div>
        </header>
        <main>
          <div className="h-[44rem] w-full">
            <div className="flex flex-col items-center justify-center w-full h-full text-3xl">
              <CardContainer bgColor={'bg-slate-50'} title={''} remarks={''} subtitle={''} className="">
                <div className="flex h-full w-full p-10 flex-col place-items-center items-center justify-center rounded shadow transition-all">
                  {isLoading?.level <= 2 ? (
                    <>
                      <LoadingSpinner size={'lg'} />
                    </>
                  ) : (
                    <>
                      {userDetails?.login === 'success' ? (
                        <div className="flex items-center justify-center w-full h-full transition-all animate-pulse ">
                          <HiCheckCircle size={100} color="indigo" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full transition-all animate-pulse ">
                          <HiShieldExclamation size={100} color="red" />
                        </div>
                      )}
                    </>
                  )}
                  {isLoading?.state === true && isLoading?.level === 1 ? (
                    <div className="pb-5">Loading resources...</div>
                  ) : isLoading?.state === true && isLoading?.level === 2 ? (
                    <div className="pb-5">Loading Application Checklist...</div>
                  ) : (
                    <div className="">
                      {userDetails?.login === 'success' ? (
                        <div className="pb-5">Success!</div>
                      ) : (
                        <div className="pb-5">The link may have expired.</div>
                      )}
                    </div>
                  )}
                </div>
              </CardContainer>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const token = context.query.token;

    return { props: { token } };
  } catch (error) {
    return { props: {} };
  }
};
