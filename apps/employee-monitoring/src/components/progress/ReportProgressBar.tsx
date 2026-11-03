import { useEffect, useState } from 'react';

type ReportProgressBarProps = {
  /** true while the report data is being fetched */
  isLoading: boolean;
  label?: string;
};

/**
 * Progress bar shown while a report loads. The server does not report its progress, so the bar is an
 * estimate: it moves quickly at first and slows down near 90%, then jumps to 100% when the data arrives.
 */
export const ReportProgressBar = ({ isLoading, label = 'Generating report' }: ReportProgressBarProps) => {
  const [progress, setProgress] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      return;
    }
    setProgress(0);
    setSeconds(0);
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      setSeconds(Math.floor(elapsed));
      setProgress(Math.min(95, 95 * (1 - Math.exp(-elapsed / 6))));
    }, 200);
    return () => clearInterval(timer);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="w-full py-10 px-6"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>{label}…</span>
        <span>
          {Math.round(progress)}% · {seconds}s
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-3 bg-indigo-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ReportProgressBar;
