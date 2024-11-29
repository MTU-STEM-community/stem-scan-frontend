'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import { checkCameraAvailability } from '@/utils/cameraUtils';

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
}

const BarcodeScanner: FC<BarcodeScannerProps> = ({ onDetected }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initScanner = async () => {
      const isCameraAvailable = await checkCameraAvailability();
      if (!isCameraAvailable) {
        setError('No camera found or camera access denied.');
        return;
      }

      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              facingMode: 'environment', // Use the back camera if available
            },
            target: scannerRef.current,
          },
          decoder: {
            readers: ['code_128_reader'], // Add more barcode types if necessary
          },
        },
        (err: Error | null) => {
          if (err) {
            console.error('Quagga Initialization Error:', err);
            setError('Unable to initialize barcode scanner.');
            return;
          }
          Quagga.start();
        }
      );
    };

    initScanner();

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <div ref={scannerRef} style={{ width: '100%', height: '300px', position: 'relative' }} />
    </div>
  );
};

export default BarcodeScanner;
