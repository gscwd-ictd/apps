import { ReactNode } from 'react'

type CardContainerProps = {
  bgColor: string
  className?: string
  titleClassName?: string
  title: string
  icon?: any
  remarks: string | JSX.Element
  remarksClassName?: string
  subtitle: string
  subtitleClassName?: string
  children: React.ReactNode
}

export const CardContainer = ({
  bgColor = 'bg-white',
  className,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  icon,
  remarksClassName,
  remarks,
  children,
}: CardContainerProps) => {
  return (
    <>
      <div className={` mt-3  ${bgColor} shadow-md ${className} `}>
        <header className="w-full">
          <div className="xs:grid grid-cols-2 justify-between sm:grid md:flex lg:flex">
            {title ? (
              <h3 className={`${titleClassName} col-span-1 flex select-none items-end hover:text-indigo-800`}>
                {title}
                {icon}
              </h3>
            ) : null}
            {remarks ? (
              <div className={`lg:text-md md:text-md xs:text-xs mx-5 mt-3 pt-2 italic sm:text-xs ${remarksClassName}`}>{remarks}</div>
            ) : null}
          </div>

          {subtitle ? <p className={`${subtitleClassName} col-span-1 select-none hover:text-indigo-800`}>{subtitle}</p> : null}
        </header>
        <main>{children}</main>
      </div>
    </>
  )
}
