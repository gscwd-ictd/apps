import { MyButtonProps } from './ButtonProps'

export const PrevButton = ({ action, type = 'submit', formId, ...props }: MyButtonProps) => {
  return (
    <>
      <div className="fixed right-[90%] bottom-[50%] top-[50%] z-50 pb-10">
        <button
          {...props}
          form={formId}
          className="cursor-pointer rounded-lg hover:scale-105 hover:bg-slate-300 focus:bg-slate-300 focus:outline-none"
          type={type}
          onClick={type === 'button' || type === 'reset' ? () => action!() : undefined}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 hover:animate-pulse hover:stroke-indigo-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="gray"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
    </>
  )
}
