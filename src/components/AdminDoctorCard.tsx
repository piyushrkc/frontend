'use client';

import { Doctor } from '@/types/doctor';

export default function AdminDoctorCard({
  doctor,
  onDelete,
}: {
  doctor: Doctor;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white p-4 shadow border rounded-lg flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
        <p className="text-sm text-gray-700">{doctor.specialty}</p>
      </div>
      <button
        onClick={() => onDelete(doctor.id)}
        className="text-red-600 hover:underline text-sm"
      >
        Delete
      </button>
    </div>
  );
}