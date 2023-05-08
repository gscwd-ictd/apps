import { HiExclamationCircle } from 'react-icons/hi'
import { useApplicantStore } from '../../../store/applicant.store'

type PdsAlertSubmitConfirmationProps = {}

export const PdsAlertSubmitConfirmation = () => {
  const isExistingApplicant = useApplicantStore((state) => state.isExistingApplicant)
  return (
    <>
      <div className="h-auto w-full flex-row items-center p-5">
        <div className="w-full text-left text-lg font-normal text-slate-700 ">
          <div className="flex place-items-center gap-2">
            <HiExclamationCircle size={30} className="text-yellow-400" />
            <div className="text-3xl font-semibold text-gray-700">Action</div>
          </div>
          <div className="text-md flex gap-2 text-left font-light">
            <div>
              Are you sure you want to {isExistingApplicant ? 'update' : 'submit'} your Personal Data Sheet? This action cannot be undone.
            </div>
          </div>
        </div>
        <div className="mt-5 w-full text-left text-lg font-light text-slate-700 ">Do you want to proceed?</div>
      </div>
    </>
  )
}
