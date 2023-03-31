import { Button } from '@gscwd-apps/oneui';
import styles from './index.module.css';

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <>
      <div className="w-screen h-screen flex justify-center item-center">
        <Button variant={'primary'} size={'md'} loading={false}>
          Print PDF
        </Button>
      </div>
    </>
  );
}

export default Index;
