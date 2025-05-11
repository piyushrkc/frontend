'use client';

import { useState, useEffect } from 'react';
import { getDoctors } from '@/services/doctorService';
import { Doctor } from '@/types/doctor';
import { createAppointment } from '@/services/appointmentService';

export default function AppointmentBookingPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [isTelemedicine, setIsTelemedicine] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getDoctors().then(setDoctors);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor || !date || !time || !reason) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const appointmentData = {
        doctorId: selectedDoctor,
        date,
        time,
        reason,
        type: isTelemedicine ? 'teleconsultation' : 'in-person',
        isTelemedicine: isTelemedicine
      };

      console.log('Creating appointment with data:', appointmentData);

      // Create the appointment
      const result = await createAppointment(appointmentData);

      console.log('Appointment created:', result);

      // If this is a telemedicine appointment, handle telemedicine session creation
      if (isTelemedicine && result?.id) {
        console.log('Creating telemedicine session for appointment', result.id);

        if (process.env.NODE_ENV === 'development') {
          // In development, create a mock session and store it in localStorage
          console.log('Development mode: Creating mock telemedicine session for appointment', result.id);

          // Get the selected doctor details
          const selectedDoctorObj = doctors.find(d => d.id === selectedDoctor);

          // Create a mock session
          const mockSession = {
            _id: 'session_' + Math.random().toString(36).substring(2, 10),
            status: 'scheduled',
            roomName: 'appointment-' + result.id + '-' + Date.now(),
            roomSid: 'RM' + Math.random().toString(36).substring(2, 10),
            scheduledStartTime: new Date(`${date}T${time}`).toISOString(),
            appointment: {
              _id: result.id,
              doctor: {
                user: {
                  firstName: selectedDoctorObj?.name.split(' ')[1] || 'Doctor',
                  lastName: selectedDoctorObj?.name.split(' ')[2] || 'Name'
                }
              },
              patient: {
                user: {
                  firstName: 'Current',
                  lastName: 'User'
                }
              },
              reason: reason,
              scheduledTime: new Date(`${date}T${time}`).toISOString()
            }
          };

          console.log('Created mock telemedicine session:', mockSession);

          // Store the session in localStorage to appear in the dashboard
          try {
            // Get existing appointments from localStorage
            const existingAppointments = localStorage.getItem('telemedicine_appointments');
            let appointments = [];

            if (existingAppointments) {
              appointments = JSON.parse(existingAppointments);
            }

            // Add the new appointment
            appointments.push(mockSession);

            // Save back to localStorage
            localStorage.setItem('telemedicine_appointments', JSON.stringify(appointments));

            console.log('Saved telemedicine appointment to localStorage');
          } catch (err) {
            console.error('Error saving to localStorage:', err);
          }
        } else {
          // Production code - make actual API call
          try {
            const telemedicineResponse = await fetch('/api/telemedicine/sessions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                appointmentId: result.id
              }),
            });

            if (!telemedicineResponse.ok) {
              throw new Error('Failed to create telemedicine session');
            }
          } catch (error) {
            console.error('Error creating telemedicine session:', error);
            // Continue anyway, as the appointment was created
          }
        }
      }

      // Show success message
      setSubmitted(true);
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>

      {submitted ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {isTelemedicine ? 'Telemedicine consultation' : 'Appointment'} successfully booked!
              </p>
              <div className="mt-4 flex space-x-3">
                <a href="/appointments" className="text-sm font-medium text-green-600 hover:text-green-500">
                  View My Appointments
                </a>
                {isTelemedicine && (
                  <a href="/telemedicine/dashboard" className="text-sm font-medium text-green-600 hover:text-green-500">
                    Go to Telemedicine Dashboard
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-white p-6 rounded-lg shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.specialty} {doc.supportsTeleconsultation ? "✓ Telemedicine" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Date
            </label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Time
            </label>
            <input
              type="time"
              className="w-full border p-2 rounded"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit
            </label>
            <textarea
              className="w-full border p-2 rounded"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe your symptoms or reason for visit"
              rows={3}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="telemedicine"
              name="telemedicine"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={isTelemedicine}
              onChange={(e) => setIsTelemedicine(e.target.checked)}
            />
            <label htmlFor="telemedicine" className="ml-2 block text-sm text-gray-700">
              This is a telemedicine (video) consultation
            </label>
          </div>

          {isTelemedicine && (
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
              <p className="font-medium">Telemedicine Consultation Information:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>You will receive a link to join the video consultation.</li>
                <li>Ensure you have a good internet connection and a quiet place.</li>
                <li>Test your camera and microphone before the appointment time.</li>
              </ul>
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Book {isTelemedicine ? 'Telemedicine Consultation' : 'Appointment'}
          </button>
        </form>
      )}
    </div>
  );
}