'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PatientAppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const successMessage = searchParams.get('success');

  // Mock data for appointments
  useEffect(() => {
    // In a real app, this would be an API call
    const mockAppointments = [
      {
        id: 'apt1',
        doctor: 'Dr. Robert Miller',
        specialty: 'General Medicine',
        date: '2025-05-10',
        time: '10:00 AM',
        status: 'upcoming',
        address: 'City General Hospital, 123 Main St, Cityville'
      },
      {
        id: 'apt2',
        doctor: 'Dr. Jennifer Lee',
        specialty: 'Dermatology',
        date: '2025-04-20',
        time: '2:30 PM',
        status: 'completed',
        address: 'City General Hospital, 123 Main St, Cityville'
      },
      {
        id: 'apt3',
        doctor: 'Dr. Michael Brown',
        specialty: 'Cardiology',
        date: '2025-05-15',
        time: '11:15 AM',
        status: 'upcoming',
        address: 'Heart Center, 456 Health Ave, Cityville'
      }
    ];
    
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 800); // Simulate network delay
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewAppointment = () => {
    router.push('/appointments/book');
  };

  const cancelAppointment = (id) => {
    // In a real app, this would make an API call
    alert(`Appointment ${id} would be cancelled. This would typically connect to a backend API.`);
    // Update local state to reflect the change
    setAppointments(appointments.map(apt => 
      apt.id === id ? {...apt, status: 'cancelled'} : apt
    ));
  };

  const rescheduleAppointment = (id) => {
    // In a real app, this would navigate to a reschedule form
    router.push(`/appointments/reschedule?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage your upcoming and past appointments
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleNewAppointment}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Book New Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Your appointment was successfully booked!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
        </div>

        {loading ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {appointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
                  appointments
                    .filter(apt => apt.status === 'upcoming')
                    .map((appointment) => (
                      <li key={appointment.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-600">{appointment.doctor}</p>
                              <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {appointment.address}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <p>
                                {new Date(appointment.date).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })} at {appointment.time}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex space-x-3 justify-end">
                            <button
                              onClick={() => rescheduleAppointment(appointment.id)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => cancelAppointment(appointment.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                ) : (
                  <li className="px-4 py-6 sm:px-6 text-center text-gray-500">
                    No upcoming appointments. Click "Book New Appointment" to schedule one.
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-8 mb-6">
              <h2 className="text-lg font-medium text-gray-900">Past Appointments</h2>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {appointments.filter(apt => apt.status === 'completed').length > 0 ? (
                  appointments
                    .filter(apt => apt.status === 'completed')
                    .map((appointment) => (
                      <li key={appointment.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-600">{appointment.doctor}</p>
                              <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {appointment.address}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <p>
                                {new Date(appointment.date).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })} at {appointment.time}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex space-x-3 justify-end">
                            <button
                              onClick={() => router.push(`/patient/medical-records?appointment=${appointment.id}`)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              View Records
                            </button>
                            <button
                              onClick={() => router.push('/appointments/book')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                            >
                              Book Similar
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                ) : (
                  <li className="px-4 py-6 sm:px-6 text-center text-gray-500">
                    No past appointments found.
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}