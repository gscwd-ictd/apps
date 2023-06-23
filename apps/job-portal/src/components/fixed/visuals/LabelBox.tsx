type LabelBoxType = {
  title: string
  titleClassName?: string
}

export const LabelBox = ({ title = 'Default Title', titleClassName = 'text-2xl font-medium' }: LabelBoxType) => {
  return (
    <>
      <div className="w-full px-6">
        <div className="flex space-x-4 rounded-lg bg-gray-50">
          <div className="flex-1 space-y-6 ">
            <div className={`col-span-4 flex select-none justify-center  ${titleClassName} hover:animate-pulse`}>{title}</div>
          </div>
        </div>
      </div>
    </>
  )
}
