import QrScanner from 'qr-scanner';
import WebcamCapture from './camera';

function Scan() {
  //   const qrScanner = new QrScanner(
  //     video,
  //     (result) => console.log('decoded qr code:', result),

  //     {
  //       /* your options or returnDetailedScanResult: true if you're not specifying any other options */
  //       returnDetailedScanResult: true,
  //     }
  //   );
  //   qrScanner.start();

  console.log(QrScanner.listCameras());

  return (
    <video>
      <WebcamCapture />;
    </video>
  );
}

export default Scan;
