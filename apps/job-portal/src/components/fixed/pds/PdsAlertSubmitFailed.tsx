import { HiStop } from 'react-icons/hi'

export const PdsAlertSubmitFailed = () => {
  return (
    <>
      <div className="w-full px-5">
        <div className="flex place-items-center gap-2">
          <HiStop className="animate-pulse text-red-500" size={30} />
          <div className="text-3xl font-semibold text-indigo-800">Error</div>
        </div>
        <div className="text-md mt-2 bg-inherit font-light">
          There is a problem in submitting your Pds. Please try again later. Do not refresh the page.
        </div>
      </div>
    </>
  )
}
