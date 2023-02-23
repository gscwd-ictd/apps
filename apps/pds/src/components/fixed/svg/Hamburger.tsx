type HamburgerProps = {
  size?: number
}

export const Hamburger = ({ size = 6 }: HamburgerProps) => {
  return (
    <>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-${size} h-${size}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </span>
    </>
  )
}
