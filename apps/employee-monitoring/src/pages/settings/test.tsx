import { useEffect, useState } from 'react';

export default function Test() {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimer((prev) => prev + 1);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [timer]);

  return <>{timer}</>;
}
