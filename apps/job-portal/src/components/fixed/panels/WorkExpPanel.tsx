import { useTabStore } from '../../../store/tab.store'
import { Page } from '../../modular/pages/Page'
import { HeadContainer } from '../head/Head'
import { NextButton } from '../navigation/button/NextButton'
import { PrevButton } from '../navigation/button/PrevButton'
import { WorkExp } from './work-experience/WorkExperience'

export default function WorkExpPanel(): JSX.Element {
  // set tab state from tab store
  const handleNextTab = useTabStore((state) => state.handleNextTab)
  const handlePrevTab = useTabStore((state) => state.handlePrevTab)

  return (
    <>
      <HeadContainer title='PDS - Work Experience' />
      <Page
        title="Work Experience"
        subtitle=""
        children={
          <>
            <WorkExp />
          </>
        }
      />
      <PrevButton action={() => handlePrevTab()} type="button" />
      <NextButton action={() => handleNextTab()} type="button" />
    </>
  )
}
