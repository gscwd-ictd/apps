import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SuccessSVG } from '../../../components/fixed/svg/Success'
import { Button } from '../../../components/modular/buttons/Button'
import { useEmployeeStore } from '../../../store/employee.store'

type SubmitSuccessProps = {
  userId: string
}

export default function SubmitSuccess({ userId }: SubmitSuccessProps): JSX.Element {
  // initialize router
  const router = useRouter()

  // random number
  let randomNumber = Math.floor(Math.random() * 7) + 1
  return (
    <>
      <Head>
        <title>Success!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-screen flex-col items-center justify-center">
          <SuccessSVG />
          <h1 className={`mt-10 select-none text-3xl font-medium text-indigo-600 `}>Submit successful!</h1>
          <p className="select-none text-2xl">Thank you for submitting your Personal Data Sheet</p>

          <div className="flex items-center">
            <a href={`${process.env.NEXT_PUBLIC_PERSONAL_DATA_SHEET}/pds/${userId}/view`} target="_blank" className="mt-5 rounded-xl bg-indigo-600 px-3 py-2 text-4xl text-white">
              Click here to view PDS
            </a>
          </div>
        </div>
      </main>
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  return { props: { userId: context.query.id } }
}