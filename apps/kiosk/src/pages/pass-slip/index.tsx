import { Button } from '@gscwd-apps/oneui';
import styles from './index.module.css';
import Link from 'next/link';
import Scan from '../../components/qrscanner/scan';
import WebcamCapture from '../../components/qrscanner/camera';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <>
      <div className="w-screen h-screen flex flex-row justify-center items-center">
        <div className="w-1/2 h-full bg-blue-100">s</div>
        <div className="w-1/2 h-full bg-green-100">
          <WebcamCapture />
        </div>
      </div>
    </>
  );
}

export default Index;
