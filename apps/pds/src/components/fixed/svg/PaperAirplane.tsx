type PaperAirplaneProps = {
  height?: number
  width?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  className?: string
}

export const PaperAirplaneSVG = ({ height = 6, width = 6, fill = 'none', stroke = 'white', strokeWidth = 2, className }: PaperAirplaneProps) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} h-${height} w-${width}`}
        fill={fill}
        viewBox="0 0 24 24"
        stroke={stroke}
        strokeWidth={strokeWidth}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </>
  )
}
