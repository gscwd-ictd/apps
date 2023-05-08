import Head from 'next/head'
import { NextPage, GetServerSideProps, InferGetServerSidePropsType, GetServerSidePropsContext } from 'next'
import dayjs from 'dayjs'
import axios from 'axios'
import { useWorkExpSheetStore, WorkExperienceSheet } from '../../../../../../store/work-experience-sheet.store'
import { WesDocument } from '../../../../../../components/work-experience-sheet/WesDocument'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { Applicant } from '../../../../../../types/data/wes.type'
import { useApplicantStore } from '../../../../../../store/applicant.store'
import useSWR from 'swr'
import { axiosFetcher } from '../../../../../../components/modular/fetcher/Fetcher'

const WorkExperienceSheetPdf: NextPage = ({ applicantWes }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const formatDate = (assignedDate: string) => {
    const date = new Date(assignedDate)
    return dayjs(date.toLocaleDateString()).format('MMMM DD, YYYY')
  }

  const workExperiencesSheet = useWorkExpSheetStore((state) => state.workExperiencesSheet)
  const setWorkExperiencesSheet = useWorkExpSheetStore((state) => state.setWorkExperiencesSheet)
  const [hasSubmittedWES, setHasSubmittedWES] = useState<boolean>(false)
  const [localWorkExperiencesSheet, setLocalWorkExperiencesSheet] = useState<Array<WorkExperienceSheet>>([])
  const [applicantData, setApplicantData] = useState({} as Applicant)

  const { data } = useSWR(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/name`, axiosFetcher)

  useEffect(() => {
    if (!isEmpty(applicantWes)) {
      localStorage.removeItem('workExperiencesSheet')

      setHasSubmittedWES(true)
      setWorkExperiencesSheet(applicantWes)
      // setApplicantData(applicantWes.personalInfo)
    } else if (isEmpty(applicantWes)) {
      setHasSubmittedWES(false)
      setLocalWorkExperiencesSheet(JSON.parse(localStorage.getItem('workExperiencesSheet')!))
    }
  }, [])

  // fetch applicant name
  useEffect(() => {
    if (!isEmpty(data)) {
      setApplicantData({
        ...applicantData,
        firstName: data.applicantFirstName,
        middleName: data.applicantMiddleName,
        lastName: data.applicantLastName,
        nameExtension: data.applicantNameExtension,
        fullName: data.fullName,
      })
    }
  }, [data])

  return (
    <>
      <Head>
        <title>Work Experience View</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-full w-full justify-center">
          <WesDocument
            formatDate={formatDate}
            workExperiencesSheet={hasSubmittedWES ? workExperiencesSheet : !hasSubmittedWES ? localWorkExperiencesSheet : []}
            applicant={applicantData}
            isSubmitted={hasSubmittedWES ? true : false}
          />
        </div>
      </main>
    </>
  )
}

export default WorkExperienceSheetPdf

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const applicantWes = await axios.get(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/pds/work-experience-sheet/${context.query}`)

    return {
      props: {
        applicantWes: applicantWes.data,
      },
    }
  } catch (error) {
    return { props: {} }
  }
}
