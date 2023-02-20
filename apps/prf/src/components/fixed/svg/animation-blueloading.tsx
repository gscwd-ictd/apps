type Svg = {
  width?: number;
  height?: number;
  fill?: string;
  className?: string;
};

const AnimationBlueLoading: React.FC<Svg> = ({ width = 20, height = 20, className = '', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="blueloading"
      width={width}
      height={height}
      className={className}
      viewBox="0 0 64 64"
    >
      <path
        fill="#88e2de"
        d="M50.287 32A18.287 18.287 0 1 1 32 13.713a1.5 1.5 0 1 1 0 3A15.287 15.287 0 1 0 47.287 32a1.5 1.5 0 0 1 3 0Z"
        data-name="Loading"
      />
    </svg>
  );
};

export default AnimationBlueLoading;
