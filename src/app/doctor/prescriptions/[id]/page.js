'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrescriptionDetailPage({ params }) {
  const router = useRouter();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call to fetch prescription details
    // In a real app, this would be an API fetch based on params.id
    setTimeout(() => {
      const mockPrescription = {
        id: params.id,
        patientName: 'John Smith',
        patientId: 'PAT001',
        age: 45,
        gender: 'Male',
        date: '2025-05-01',
        diagnosis: 'Common Cold',
        chiefComplaints: 'Fever, Headache, Running nose for 2 days',
        signsAndSymptoms: 'Temperature: 100°F, Mild pharyngeal congestion',
        medications: [
          { name: 'Paracetamol', dosage: '500mg', frequency: 'TID', duration: '5 days', instructions: 'After food' },
          { name: 'Cetirizine', dosage: '10mg', frequency: 'OD', duration: '3 days', instructions: 'At night' }
        ],
        notes: 'Plenty of fluids, Rest advised for 3 days',
        labTests: 'Complete Blood Count if fever persists for more than 3 days',
        followUpDate: '2025-05-08',
        doctorName: 'Dr. Robert Miller',
        doctorSpecialty: 'General Medicine'
      };
      
      setPrescription(mockPrescription);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Prescription not found</h3>
          <p className="mt-1 text-sm text-gray-500">The prescription you're looking for doesn't exist or has been removed.</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/doctor/prescriptions')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Go back to prescriptions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    router.push('/doctor/prescriptions');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prescription Details</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and print prescription information
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Print
              </button>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Prescription #{prescription.id}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Issued on {new Date(prescription.date).toLocaleDateString()}</p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {/* Hospital/Clinic Header */}
            <div className="border-b border-gray-300 pb-4 mb-4">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">City General Hospital</h2>
                  <p className="text-sm text-gray-700">123 Main Street, Cityville</p>
                  <p className="text-sm text-gray-700">Phone: (123) 456-7890</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{prescription.doctorName}</p>
                  <p className="text-xs text-gray-700">MBBS, MD - {prescription.doctorSpecialty}</p>
                  <p className="text-xs text-gray-700">Reg No: MED12345</p>
                </div>
              </div>
            </div>
            
            {/* Patient Details */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700">Patient Name:</p>
                <p className="text-sm font-medium text-gray-900">{prescription.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Patient ID:</p>
                <p className="text-sm font-medium text-gray-900">{prescription.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Age/Gender:</p>
                <p className="text-sm font-medium text-gray-900">{prescription.age} years / {prescription.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">Date:</p>
                <p className="text-sm font-medium text-gray-900">{new Date(prescription.date).toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Chief Complaints */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800">Chief Complaints:</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{prescription.chiefComplaints}</p>
            </div>
            
            {/* Signs and Symptoms */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800">Signs and Symptoms:</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{prescription.signsAndSymptoms}</p>
            </div>
            
            {/* Diagnosis */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800">Diagnosis:</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{prescription.diagnosis}</p>
            </div>
            
            {/* Prescription Content */}
            <div className="mt-6">
              <div className="flex items-start">
                <span className="text-2xl font-bold text-gray-700 mr-2">Rx</span>
                <div className="flex-1">
                  <div className="space-y-4">
                    {prescription.medications.map((med, idx) => (
                      <div key={idx} className="pb-2 border-b border-gray-200">
                        <div className="flex items-baseline">
                          <span className="text-sm font-medium text-gray-900 w-6">{idx + 1}.</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{med.name} {med.dosage}</p>
                            <p className="text-sm text-gray-700 ml-2">
                              {med.frequency}, for {med.duration}
                              {med.instructions && ` (${med.instructions})`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lab Tests */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-800">Lab Tests:</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{prescription.labTests}</p>
            </div>
            
            {/* Additional Notes */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-800">Additional Notes:</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{prescription.notes}</p>
            </div>
            
            {/* Follow-up */}
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-800">Follow-up Date:</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
            </div>
            
            {/* Doctor Signature */}
            <div className="mt-10 flex justify-end">
              <div className="text-right">
                <div className="h-10 mb-1">
                  {/* Space for digital signature */}
                </div>
                <p className="text-sm font-medium text-gray-900">{prescription.doctorName}</p>
                <p className="text-xs text-gray-700">MBBS, MD - {prescription.doctorSpecialty}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}