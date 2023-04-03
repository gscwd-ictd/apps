import { Button } from '@gscwd-apps/oneui';
import styles from './index.module.css';
import Link from 'next/link';
import Webcam from 'react-webcam';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center bg-red-200">
        <div className="flex gap-10">
          <Link href={`/pass-slip/`}>
            <Button variant={'primary'} size={'md'} loading={false}>
              PASS SLIP
            </Button>
          </Link>
          <Link href={`/coffee/`}>
            <Button variant={'primary'} size={'md'} loading={false}>
              COFFEE BREAK
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Index;
