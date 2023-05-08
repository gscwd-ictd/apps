type ArrowCircleUpProps = {
  width?: number | string
  height?: number | string
  stroke?: string
  strokeWidth?: number
  className?: string
}

export const ArrowCircleUpSVG = ({ height = 6, width = 6, stroke = 'white', strokeWidth = 2, className }: ArrowCircleUpProps) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`sm:h-full sm:w-full lg:w-${width} lg:h-${height} ${className}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke={stroke}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
      </svg>
    </>
  )
}
