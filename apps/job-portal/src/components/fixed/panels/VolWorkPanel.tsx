import Head from 'next/head'
import { useTabStore } from '../../../store/tab.store'
import { Page } from '../../modular/pages/Page'
import { HeadContainer } from '../head/Head'
import { NextButton } from '../navigation/button/NextButton'
import { PrevButton } from '../navigation/button/PrevButton'
import { VolWorkExp } from './voluntary-experience/VolWorkExp'

export default function VolWorkPanel(): JSX.Element {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab)
  const handleNextTab = useTabStore((state) => state.handleNextTab)
  const handlePrevTab = useTabStore((state) => state.handlePrevTab)


  return (
    <>
      <HeadContainer title='PDS - Voluntary Work' />

      <Page
        title="Voluntary Work Experience"
        subtitle=""
        children={
          <>
            <VolWorkExp />
          </>
        }
      />
      <PrevButton action={handlePrevTab} type="button" />
      <NextButton action={handleNextTab} type="button" />
    </>
  )
}
