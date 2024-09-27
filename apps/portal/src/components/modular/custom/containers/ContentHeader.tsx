import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { HiArrowSmLeft } from 'react-icons/hi';

type ContentHeaderProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
  backUrl: string;
};

export const ContentHeader: React.FC<ContentHeaderProps> = ({ title, subtitle, children, backUrl }): JSX.Element => {
  const router = useRouter();

  return (
    <>
      <button
        className="flex items-center gap-2 mb-5 text-gray-500 transition-colors ease-in-out hover:text-gray-700"
        onClick={() => router.back()}
        // onClick={() => router.push(`${backUrl}`, undefined, { shallow: true })}
      >
        <HiArrowSmLeft className="w-5 h-5" />
        <span className="font-medium">Go Back</span>
      </button>
      <header className="flex items-center justify-between">
        <section className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </section>
        {children}
      </header>
    </>
  );
};
