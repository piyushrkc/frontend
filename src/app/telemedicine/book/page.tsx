'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function BookTelemedicine() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available doctors
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);

        // For development, we'll use mock data since the API endpoint might not be ready yet
        if (process.env.NODE_ENV === 'development') {
          // Mock doctor data
          const mockDoctors = [
            {
              _id: "doctor1",
              user: {
                firstName: "John",
                lastName: "Smith",
                email: "doctor@test.com"
              },
              specialization: "Cardiology",
              licenseNumber: "MED12345",
              availability: { monday: { start: "09:00", end: "17:00" }}
            },
            {
              _id: "doctor2",
              user: {
                firstName: "Sarah",
                lastName: "Johnson",
                email: "sarah@hospital.com"
              },
              specialization: "Neurology",
              licenseNumber: "MED67890",
              availability: { monday: { start: "10:00", end: "18:00" }}
            },
            {
              _id: "doctor3",
              user: {
                firstName: "OPD",
                lastName: "Doctor",
                email: "doctor@opd.com"
              },
              specialization: "General Medicine",
              licenseNumber: "DOC98765",
              availability: { monday: { start: "08:00", end: "16:00" }}
            }
          ];

          setTimeout(() => {
            setDoctors(mockDoctors);
            setIsLoading(false);
          }, 500);
          return;
        }

        // Production code - fetch from real API
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data.data || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again later.');
        toast.error('Failed to load doctors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentDate || !appointmentTime || !reason) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // In development, we'll simulate successful API calls
      if (process.env.NODE_ENV === 'development') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Get the selected doctor details
        const doctor = doctors.find(d => d._id === selectedDoctor);

        // Create a mock session
        const mockSession = {
          _id: 'session_' + Math.random().toString(36).substring(2, 10),
          status: 'scheduled',
          roomName: 'appointment-mock-' + Date.now(),
          roomSid: 'RM' + Math.random().toString(36).substring(2, 10),
          scheduledStartTime: new Date(`${appointmentDate}T${appointmentTime}`).toISOString(),
          appointment: {
            _id: 'appt_' + Math.random().toString(36).substring(2, 10),
            doctor: {
              user: {
                firstName: doctor?.user.firstName || 'Doctor',
                lastName: doctor?.user.lastName || 'Name'
              }
            },
            patient: {
              user: {
                firstName: user?.firstName || 'Current',
                lastName: user?.lastName || 'User'
              }
            },
            reason: reason,
            scheduledTime: new Date(`${appointmentDate}T${appointmentTime}`).toISOString()
          }
        };

        console.log('Development mode: Creating mock telemedicine session', mockSession);

        // Store the session in localStorage so it appears in the dashboard
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

        setSuccessMessage('Telemedicine consultation booked successfully!');
        toast.success('Telemedicine consultation booked!');

        // Clear form
        setSelectedDoctor('');
        setAppointmentDate('');
        setAppointmentTime('');
        setReason('');

        // Redirect to telemedicine dashboard after a short delay
        setTimeout(() => {
          router.push('/telemedicine/dashboard');
        }, 2000);

        return;
      }

      // Production code - actual API calls
      // First create an appointment with type 'teleconsultation'
      const appointmentResponse = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          scheduledDate: appointmentDate,
          scheduledTime: appointmentTime,
          reason: reason,
          type: 'teleconsultation',
          isTelemedicine: true
        }),
      });

      if (!appointmentResponse.ok) {
        throw new Error('Failed to create appointment');
      }

      const appointmentData = await appointmentResponse.json();

      // Now create a telemedicine session for this appointment
      const telemedicineResponse = await fetch('/api/telemedicine/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: appointmentData.data._id
        }),
      });

      if (!telemedicineResponse.ok) {
        throw new Error('Failed to create telemedicine session');
      }

      setSuccessMessage('Telemedicine consultation booked successfully!');
      toast.success('Telemedicine consultation booked!');

      // Clear form
      setSelectedDoctor('');
      setAppointmentDate('');
      setAppointmentTime('');
      setReason('');

      // Redirect to telemedicine dashboard after a short delay
      setTimeout(() => {
        router.push('/telemedicine/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error booking telemedicine consultation:', error);
      setError(error.message || 'Failed to book telemedicine consultation');
      toast.error('Failed to book telemedicine consultation');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Book Telemedicine Consultation</h1>
              <p className="text-gray-600 mt-1">Schedule a video consultation with a doctor</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/telemedicine/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            {successMessage ? (
              <div className="text-center py-8">
                <div className="mb-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{successMessage}</h2>
                <p className="text-gray-600 mb-4">You will be redirected to your telemedicine dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Doctor
                  </label>
                  <div className="relative">
                    {isLoading ? (
                      <div className="mt-1 flex items-center text-gray-500">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading doctors...
                      </div>
                    ) : (
                      <select
                        id="doctor"
                        name="doctor"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                      >
                        <option value="">Select a doctor</option>
                        {doctors.length === 0 ? (
                          <option value="" disabled>No doctors available</option>
                        ) : (
                          doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                              Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialization}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      min={today}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Consultation
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Please describe your symptoms or reason for consultation"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-3 pt-4">
                  <Link
                    href="/telemedicine/dashboard"
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Book Consultation'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">How Telemedicine Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-md font-medium">Step 1: Schedule</h3>
              </div>
              <p className="text-sm text-gray-600">
                Book a telemedicine appointment with your preferred doctor at a time that works for you.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-md font-medium">Step 2: Connect</h3>
              </div>
              <p className="text-sm text-gray-600">
                Join your video consultation through our secure platform at your scheduled time.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-md font-medium">Step 3: Receive Care</h3>
              </div>
              <p className="text-sm text-gray-600">
                Get diagnosis, treatment plans, prescriptions, and follow-up care from the comfort of your home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}