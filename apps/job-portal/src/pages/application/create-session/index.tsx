import axios from 'axios'
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useState } from 'react'
import { HiCheckCircle, HiShieldExclamation } from 'react-icons/hi'
import { SpinnerDotted } from 'spinners-react'
import { fetchWithToken, serverSideFetch } from '../../../../utils/hoc/fetcher'
import { CardContainer } from '../../../components/modular/cards/CardContainer'
import TopNavigation from '../../../components/page-header/TopNavigation'

type Loading = {
  state: boolean
  level: number
}

type UserDetails = {
  login: 'success' | 'failed'
  details: {
    externalApplicantId: string
    vppId: string
  }
}

type CreateSessionProps = {
  token: string
}

export default function CreateSession({ token }: CreateSessionProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<Loading>({ state: false, level: 1 })
  const [userDetails, setUserDetails] = useState<UserDetails>({} as UserDetails)

  const getData = async () => {
    try {
      console.log(token)
      const userDetails = await fetchWithToken('POST', `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/login`, token)
      return setUserDetails(userDetails)
    } catch (error) {
      return {}
    }
  }

  useEffect(() => {
    if (isLoading.state === false && isLoading.level === 1) {
      setIsLoading({ state: true, level: 1 })
    }
    getData()
  }, [])

  useEffect(() => {
    if (isLoading.state === true && isLoading.level === 1) {
      setTimeout(() => {
        setIsLoading({ state: true, level: 2 })
      }, 500)
    }
  }, [isLoading])

  useEffect(() => {
    if (isLoading.level === 2 && userDetails.login === 'success') {
      setTimeout(async () => {
        setIsLoading({ state: true, level: 3 })
        await router.push(`${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${userDetails.details.vppId}/checklist`)
      }, 1000)
    } else if (isLoading.level === 2 && userDetails.login !== 'success') {
      setTimeout(() => {
        setIsLoading({ state: true, level: 3 })
      }, 500)
    }
  }, [isLoading.level])

  return (
    <>
      <div className="min-h-screen bg-white">
        <TopNavigation />
        <header className="shadow ">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              {isLoading.level === 1
                ? 'Please wait'
                : isLoading.level === 2
                ? 'Almost there'
                : isLoading.level === 3 && userDetails.login !== 'success'
                ? 'Oops! Something went wrong.'
                : 'Redirecting'}
            </h1>
          </div>
        </header>
        <main>
          <div className="h-[44rem] w-full">
            <div className="flex h-full w-full flex-col items-center justify-center text-3xl">
              <CardContainer bgColor={'bg-slate-50'} title={''} remarks={''} subtitle={''}>
                <div className="static flex h-[20rem] w-[44rem] flex-col place-items-center items-center justify-items-center rounded shadow transition-all">
                  {isLoading.level <= 2 ? (
                    <>
                      <SpinnerDotted
                        speed={150}
                        thickness={120}
                        className="flex h-full w-full animate-pulse transition-all "
                        color={isLoading.level === 1 ? 'slateblue' : isLoading.level === 2 ? 'indigo' : 'green'}
                        size={100}
                      />
                    </>
                  ) : (
                    <>
                      {userDetails.login === 'success' ? (
                        <div className="flex h-full w-full animate-pulse items-center justify-center transition-all ">
                          <HiCheckCircle size={100} color="indigo" />
                        </div>
                      ) : (
                        <div className="flex h-full w-full animate-pulse items-center justify-center transition-all ">
                          <HiShieldExclamation size={100} color="red" />
                        </div>
                      )}
                    </>
                  )}
                  {isLoading.state === true && isLoading.level === 1 ? (
                    <div className="pb-5">Loading resources...</div>
                  ) : isLoading.state === true && isLoading.level === 2 ? (
                    <div className="pb-5">Loading Application Checklist...</div>
                  ) : (
                    <div className="">
                      {userDetails.login === 'success' ? (
                        <div className="pb-5">Success!</div>
                      ) : (
                        <div className="pb-5">The link may have expired.</div>
                      )}
                    </div>
                  )}
                </div>
              </CardContainer>
              {/* <div className="flex w-full justify-center">
                {isLoading.level === 3 && userDetails.login !== 'success' && (
                  <Link href={''}>
                    <span className="pt-5 text-xl underline">Click here to resend email verification</span>
                  </Link>
                )}
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const token = context.query.token

    return { props: { token } }
  } catch (error) {
    return { props: {} }
  }
}
