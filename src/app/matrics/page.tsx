'use client';

import { useEffect, useState } from 'react';
import { getMatricNumbers } from '@/lib/api';

const MatricsPage = () => {
  const [matrics, setMatrics] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatrics = async () => {
      try {
        const data = await getMatricNumbers();
        setMatrics(data);
      } catch (err) {
        setError('Failed to load matric numbers.');
      }
    };

    fetchMatrics();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Stored Matric Numbers</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {matrics.map((matric) => (
          <li key={matric.id} className="mb-2">
            {matric.matricNum} (Added: {new Date(matric.createdAt).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatricsPage;
