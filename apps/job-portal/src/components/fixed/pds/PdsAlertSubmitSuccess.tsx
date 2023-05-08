import { HiCheckCircle } from 'react-icons/hi'

type AlertProps = {
  text: string
}

export const PdsAlertSubmitSuccess = ({ text }: AlertProps) => {
  return (
    <>
      <div className="w-full px-5">
        <div className="flex place-items-center gap-2">
          <HiCheckCircle className="animate-pulse text-green-500" size={30} />
          <div className="text-3xl font-semibold text-indigo-800">Success</div>
        </div>
        <div className="text-md mt-2 bg-inherit font-light">
          <span className="text-lg font-light">You have successfully {text} your Personal Data Sheet.</span>
        </div>
      </div>
    </>
  )
}
