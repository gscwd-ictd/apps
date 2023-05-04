import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full ">
      <div className="text-gray-500 xs:text-lg sm:text-xl md:text-5xl lg:text-5xl px-[5%]">
        Welcome to <span className="text-cyan-600">Learning & Development</span>{' '}
        Dashboard
      </div>
    </div>
  );
}
