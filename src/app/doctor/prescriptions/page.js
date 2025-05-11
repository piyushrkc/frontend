'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DoctorPrescriptionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const successMessage = searchParams.get('success');

  // Mock data for prescriptions
  useEffect(() => {
    // In a real app, this would be an API call
    const mockPrescriptions = [
      {
        id: 'p1',
        patientName: 'John Smith',
        patientId: 'PAT001',
        date: '2025-05-01',
        diagnosis: 'Common Cold',
        medications: [
          { name: 'Paracetamol', dosage: '500mg', frequency: 'TID', duration: '5 days' },
          { name: 'Cetirizine', dosage: '10mg', frequency: 'OD', duration: '3 days' }
        ]
      },
      {
        id: 'p2',
        patientName: 'Sarah Johnson',
        patientId: 'PAT002',
        date: '2025-04-28',
        diagnosis: 'Hypertension',
        medications: [
          { name: 'Amlodipine', dosage: '5mg', frequency: 'OD', duration: '30 days' }
        ]
      },
      {
        id: 'p3',
        patientName: 'Michael Williams',
        patientId: 'PAT003',
        date: '2025-04-25',
        diagnosis: 'Bacterial Infection',
        medications: [
          { name: 'Amoxicillin', dosage: '500mg', frequency: 'BID', duration: '7 days' }
        ]
      }
    ];
    
    setTimeout(() => {
      setPrescriptions(mockPrescriptions);
      setLoading(false);
    }, 800); // Simulate network delay
  }, []);

  const viewPrescription = (id) => {
    // In a real app, navigate to prescription detail view
    router.push(`/doctor/prescriptions/${id}`);
  };

  const handleNewPrescription = () => {
    router.push('/doctor-dashboard/consultation');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and view all patient prescriptions
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleNewPrescription}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Prescription
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
                  Prescription was successfully created!
                </p>
              </div>
            </div>
          </div>
        )}

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
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {prescriptions.map((prescription) => (
                <li key={prescription.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">{prescription.patientName}</p>
                          <p className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            ID: {prescription.patientId}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <button
                            onClick={() => viewPrescription(prescription.id)}
                            className="px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Diagnosis: {prescription.diagnosis}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Medications: {prescription.medications.length}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <p>
                            {new Date(prescription.date).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}