'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PatientDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated - but only in production
    // In development, we'll allow access with mock user
    if (process.env.NODE_ENV !== 'development' && !isLoading && !user) {
      router.push('/login');
      return;
    }
    
    // In development, if user object doesn't exist, we'll create one
    if (process.env.NODE_ENV === 'development' && !isLoading && !user) {
      console.log('PatientDashboard: Using mock patient user for development');
      // No need to redirect - the AuthContext will handle creating a mock user
    }
    
    // Verify user is a patient - skip this check in development
    if (process.env.NODE_ENV !== 'development' && !isLoading && user && user.role !== 'patient') {
      // If user is not a patient, redirect to appropriate dashboard
      if (user.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else if (user.role === 'admin') {
        router.push('/dashboard/admin');
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // For development - continue showing the dashboard even without a user
  if (!user && process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Mock data for dashboard
  const appointments = [
    {
      id: 'appt1',
      doctorName: 'Dr. Sarah Johnson',
      department: 'Internal Medicine',
      date: '2025-04-30',
      time: '10:00 AM',
      status: 'upcoming'
    },
    {
      id: 'appt2',
      doctorName: 'Dr. James Wilson',
      department: 'Cardiology',
      date: '2025-05-15',
      time: '2:30 PM',
      status: 'upcoming'
    }
  ];

  const prescriptions = [
    {
      id: 'pres1',
      doctorName: 'Dr. Sarah Johnson',
      issuedDate: '2025-04-15',
      medications: ['Amoxicillin 500mg', 'Paracetamol 650mg']
    },
    {
      id: 'pres2',
      doctorName: 'Dr. James Wilson',
      issuedDate: '2025-03-20',
      medications: ['Atorvastatin 20mg', 'Aspirin 75mg']
    }
  ];

  const labResults = [
    {
      id: 'lab1',
      testName: 'Complete Blood Count',
      orderedDate: '2025-04-15',
      resultDate: '2025-04-17',
      status: 'completed'
    },
    {
      id: 'lab2',
      testName: 'Lipid Profile',
      orderedDate: '2025-04-15',
      resultDate: null,
      status: 'processing'
    }
  ];

  const medicalRecords = [
    {
      id: 'med1',
      title: 'Annual Checkup',
      type: 'Examination',
      date: '2025-04-15',
      doctorName: 'Dr. Sarah Johnson'
    },
    {
      id: 'med2',
      title: 'Chest X-Ray',
      type: 'Radiology',
      date: '2025-04-16',
      doctorName: 'Dr. Michael Brown'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Patient Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.firstName} {user.lastName}</p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Patient ID</p>
              <p className="text-base font-medium text-gray-800">UHID-{Math.floor(10000 + Math.random() * 90000)}</p>
            </div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
              <div className="flex space-x-2">
                <Link href="/appointments" className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm">
                  Book Appointment
                </Link>
                <Link href="/telemedicine/book" className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  </svg>
                  Book Video Call
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{appointment.doctorName}</h3>
                        <p className="text-sm text-gray-500">{appointment.department}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                        View Details
                      </button>
                      <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Appointments
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Prescriptions Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Active Prescriptions</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {prescriptions.map(prescription => (
                  <div key={prescription.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">Prescribed by {prescription.doctorName}</h3>
                        <p className="text-sm text-gray-500">
                          Issued on {new Date(prescription.issuedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Medications:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                        {prescription.medications.map((med, index) => (
                          <li key={index}>{med}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-3">
                      <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                        View Full Prescription
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Prescriptions
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Lab Results Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Lab Results</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {labResults.map(result => (
                  <div key={result.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{result.testName}</h3>
                        <p className="text-sm text-gray-500">
                          Ordered on {new Date(result.orderedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {result.status === 'completed' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : result.status === 'processing' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Ordered
                          </span>
                        )}
                      </div>
                    </div>
                    {result.resultDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        Results available since {new Date(result.resultDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="mt-3">
                      {result.status === 'completed' ? (
                        <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                          View Results
                        </button>
                      ) : (
                        <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs" disabled>
                          {result.status === 'processing' ? 'Processing' : 'Pending'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Lab Results
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Medical Records Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Medical Records</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {medicalRecords.map(record => (
                  <div key={record.id} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{record.title}</h3>
                        <p className="text-sm text-gray-500">{record.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">{record.doctorName}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-1 px-3 rounded text-xs">
                        View Record
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Medical Records
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Access Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link href="/appointments" className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-700 text-center">Appointments</span>
            </Link>

            <Link href="/telemedicine/dashboard" className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-700 text-center">Telemedicine</span>
            </Link>

            <Link href="/prescriptions" className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-700 text-center">Prescriptions</span>
            </Link>

            <Link href="/labs" className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-sm text-gray-700 text-center">Lab Results</span>
            </Link>

            <Link href="/medical-records" className="flex flex-col items-center justify-center bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-700 text-center">Medical Records</span>
            </Link>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}