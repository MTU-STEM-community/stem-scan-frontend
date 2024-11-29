'use client';

import { useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';
import { saveMatricNumber } from '@/lib/api';

const ScanPage = () => {
  const [matricNum, setMatricNum] = useState('');
  const [message, setMessage] = useState('');

  const handleDetected = async (code: string) => {
    setMatricNum(code);
    try {
      const result = await saveMatricNumber(code);
      setMessage(`Matric number ${result.matricNum} saved successfully!`);
    } catch (error) {
      setMessage('Failed to save matric number. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Scan Barcode</h1>
      {matricNum ? (
        <div>
          <p>Scanned Matric Number: {matricNum}</p>
          <p>{message}</p>
        </div>
      ) : (
        <BarcodeScanner onDetected={handleDetected} />
      )}
      <button
        onClick={() => {
          setMatricNum('');
          setMessage('');
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Scan Again
      </button>
    </div>
  );
};

export default ScanPage;
