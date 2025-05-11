'use client';

import { useEffect, useState } from 'react';
import { getMedicalRecords } from '@/services/medicalService';
import { MedicalRecord } from '@/types/medical';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getMedicalRecords();
      setRecords(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Medical Records</h1>

      {loading ? (
        <p>Loading records...</p>
      ) : records.length === 0 ? (
        <p>No records uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {records.map((rec) => (
            <li key={rec.id} className="bg-white p-4 shadow rounded">
              <p className="font-semibold">{rec.title}</p>
              <p className="text-sm text-gray-600">{rec.description}</p>
              <p className="text-sm text-gray-500">Date: {rec.date}</p>
              <a
                href={rec.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 inline-block"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}