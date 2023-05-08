import { useTabStore } from '../../../store/tab.store'
import { Page } from '../../modular/pages/Page'
import { HeadContainer } from '../head/Head'
import { NextButton } from '../navigation/button/NextButton'
import { PrevButton } from '../navigation/button/PrevButton'
import { LearningNDevt } from './learning-and-devt/LND'

export default function LNDPanel(): JSX.Element {
  // set tab state from misc context
  const selectedTab = useTabStore((state) => state.selectedTab)
  const handleNextTab = useTabStore((state) => state.handleNextTab)
  const handlePrevTab = useTabStore((state) => state.handlePrevTab)


  return (
    <>
      <HeadContainer title="PDS - Learning & Dev't" />
      <Page
        title="Learning & Development"
        subtitle=""
        children={
          <>
            <LearningNDevt />
          </>
        }
      />
      <PrevButton action={() => handlePrevTab()} type="button" />

      <NextButton action={() => handleNextTab()} type="button" />
    </>
  )
}
