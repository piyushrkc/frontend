'use client';

import { Doctor } from '@/types/doctor';

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="bg-white shadow-md rounded p-4 text-center">
      <img
        src={doctor.imageUrl || '/default-doctor.jpg'}
        alt={doctor.name}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-lg font-semibold">{doctor.name}</h3>
      <p className="text-sm text-gray-600">{doctor.specialty}</p>
      <p className="text-sm">Experience: {doctor.experience} yrs</p>
      <p className="text-sm text-gray-500">{doctor.location}</p>
    </div>
  );
}