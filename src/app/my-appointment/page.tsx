'use client';

import { useEffect, useState } from 'react';
import { getMyAppointments } from '@/services/appointmentService';
import { AppointmentWithDoctor } from '@/types/appointment';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getMyAppointments();
      setAppointments(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt.id} className="bg-white p-4 shadow rounded">
              <p className="font-semibold">{appt.doctorName} ({appt.specialty})</p>
              <p>Date: {appt.date}</p>
              <p>Time: {appt.time}</p>
              <p>Status: <span className="text-blue-600">{appt.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}