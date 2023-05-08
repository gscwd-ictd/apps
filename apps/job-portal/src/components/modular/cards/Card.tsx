import React from 'react'

type CardProps = {
  title: string
  icon?: any
  subtitle: string
  children?: React.ReactNode
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  remarks?: any
  bgColor?: string
}

export const Card = ({
  title = 'Title Here',
  subtitle = 'Subtitle Here',
  icon,
  bgColor = 'white',
  children,
  className = '',
  titleClassName = 'w-full mt-5 text-2xl',
  subtitleClassName = '',
  remarks,
}: CardProps): JSX.Element => {
  return (
    <>
      <div className={` mt-3 rounded-xl bg-${bgColor} mx-[5%] px-[3%]  pt-2 pb-10 shadow-md ${className} `}>
        <header>
          <div className="xs:grid grid-cols-2 justify-between sm:grid md:flex lg:flex">
            <h3 className={`${titleClassName} col-span-1 flex select-none items-end hover:text-indigo-800`}>
              {icon}
              {title}
            </h3>
            <div className="lg:text-md md:text-md xs:text-xs mx-5 mt-3 pt-2 italic sm:text-xs ">{remarks}</div>
          </div>

          <span className={`${subtitleClassName} col-span-1 mt-5 w-full select-none text-sm font-light  hover:text-indigo-800`}>
            {subtitle}
          </span>
        </header>
        <main>{children}</main>
      </div>
    </>
  )
}
