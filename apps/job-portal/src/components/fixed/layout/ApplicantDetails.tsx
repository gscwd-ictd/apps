import { CardContainer } from '../../modular/cards/CardContainer'
import { ApplicantEmail } from '../forms/ApplicantEmail'
import { ApplicantForm } from '../forms/ApplicantForm'
import { ApplicantFormPane } from './ApplicantFormPane'

type ApplicantDetailsProps = {
  page: number
}

export const ApplicantDetails = ({ page }: ApplicantDetailsProps) => {
  return (
    <>
      <div className="w-[52rem]">
        <CardContainer
          bgColor="bg-white"
          className="rounded-xl shadow ring-1 ring-black ring-opacity-5 "
          remarks=""
          subtitle=""
          title=""
          subtitleClassName=""
        >
          <div className="flex w-full grid-cols-2">
            <div className={`w-[35%] ${page === 1 ? 'h-[28rem]' : page === 2 ? 'h-[44rem]' : null}`}>
              <ApplicantFormPane page={page} />
            </div>
            <div className={`w-[65%] ${page === 1 ? 'h-[28rem]' : page === 2 ? 'h-[44rem]' : null} overflow-y-auto`}>
              {page === 1 && <ApplicantEmail />}
              {page === 2 && <ApplicantForm />}
            </div>
          </div>
        </CardContainer>
      </div>
    </>
  )
}
