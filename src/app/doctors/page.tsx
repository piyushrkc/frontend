'use client';

import { useEffect, useState } from 'react';
import { getDoctors } from '@/services/doctorService';
import { Doctor } from '@/types/doctor';
import DoctorCard from '@/components/DoctorCard';

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      const data = await getDoctors();
      setDoctors(data);
      setLoading(false);
    }

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Available Doctors</h1>

      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
}