'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPendingPrescriptions, processPrescription } from '@/services/pharmacyService';
import { Prescription } from '@/types/pharmacy';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'filled' | 'cancelled'>('filled');
  const [processingNotes, setProcessingNotes] = useState('');

  useEffect(() => {
    async function loadPrescriptions() {
      try {
        setIsLoading(true);
        const data = await getPendingPrescriptions();
        setPrescriptions(data);
      } catch (error) {
        console.error('Error loading prescriptions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPrescriptions();
  }, []);

  // Filter prescriptions based on search
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const patientName = prescription.patient.name.toLowerCase();
    const doctorName = prescription.doctor.name.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return patientName.includes(searchLower) || 
           doctorName.includes(searchLower) || 
           prescription.id.includes(searchLower);
  });

  // Open the process modal for a prescription
  const openProcessModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setProcessingStatus('filled');
    setProcessingNotes('');
    setShowProcessModal(true);
  };

  // Handle prescription processing
  const handleProcessPrescription = async () => {
    if (!selectedPrescription) return;
    
    try {
      await processPrescription(selectedPrescription.id, {
        status: processingStatus,
        notes: processingNotes,
      });
      
      // Remove the processed prescription from the list
      setPrescriptions(prev => prev.filter(p => p.id !== selectedPrescription.id));
      
      setShowProcessModal(false);
      setSelectedPrescription(null);
    } catch (error) {
      console.error('Error processing prescription:', error);
      // Would add error notification in a real app
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pending Prescriptions</h1>
              <p className="text-gray-600">Review and dispense medications for pending prescriptions</p>
            </div>
          </div>
        </header>
        
        {/* Search Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Prescriptions
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by patient name, doctor, or prescription ID..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="px-4 py-2 border border-gray-300 rounded-md bg-blue-50 text-blue-800 font-medium">
                Pending ({prescriptions.length})
              </div>
            </div>
          </div>
        </div>
        
        {/* Prescriptions List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">Loading prescriptions...</p>
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No pending prescriptions found.</p>
            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <div key={prescription.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Prescription #{prescription.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(prescription.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Pending
                  </span>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Patient Information</h4>
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="font-medium">{prescription.patient.name}</p>
                      {prescription.patient.contactNumber && (
                        <p className="text-sm text-gray-600">{prescription.patient.contactNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Prescribing Doctor</h4>
                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="font-medium">{prescription.doctor.name}</p>
                      {prescription.doctor.specialization && (
                        <p className="text-sm text-gray-600">{prescription.doctor.specialization}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Prescribed Medications</h4>
                  <div className="bg-gray-50 rounded-md p-3 mb-4">
                    <ul className="divide-y divide-gray-200">
                      {prescription.medications.map((med, index) => (
                        <li key={index} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div>
                              <p className="font-medium">
                                {med.medication.name} {med.medication.strength}
                              </p>
                              <p className="text-sm text-gray-600">
                                {med.dosage}, {med.frequency}, for {med.duration}
                              </p>
                              {med.notes && (
                                <p className="text-sm text-gray-500 italic mt-1">
                                  Note: {med.notes}
                                </p>
                              )}
                            </div>
                            <div className="mt-2 md:mt-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Qty: {med.quantity}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap justify-end gap-3">
                    <Link 
                      href={`/pharmacy/prescriptions/${prescription.id}`}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => openProcessModal(prescription)}
                      className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Process Prescription
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <Link href="/pharmacy" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
            Back to Pharmacy Dashboard
          </Link>
        </div>
      </div>

      {/* Process Prescription Modal */}
      {showProcessModal && selectedPrescription && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Process Prescription #{selectedPrescription.id}
            </h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Patient Information</h4>
              <p className="text-sm">
                <span className="font-medium">Patient:</span> {selectedPrescription.patient.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Doctor:</span> {selectedPrescription.doctor.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Date:</span> {new Date(selectedPrescription.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Prescribed Medications</h4>
              <div className="bg-gray-50 rounded-md p-3">
                <ul className="divide-y divide-gray-200">
                  {selectedPrescription.medications.map((med, index) => (
                    <li key={index} className="py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {med.medication.name} {med.medication.strength}
                          </p>
                          <p className="text-sm text-gray-600">
                            {med.dosage}, {med.frequency}, for {med.duration}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Qty: {med.quantity}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processing Action
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600"
                        checked={processingStatus === 'filled'}
                        onChange={() => setProcessingStatus('filled')}
                      />
                      <span className="ml-2 text-sm text-gray-700">Dispense Medication</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-red-600"
                        checked={processingStatus === 'cancelled'}
                        onChange={() => setProcessingStatus('cancelled')}
                      />
                      <span className="ml-2 text-sm text-gray-700">Cancel Prescription</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="processingNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="processingNotes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add any notes about the dispensing or cancellation..."
                    value={processingNotes}
                    onChange={(e) => setProcessingNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowProcessModal(false);
                  setSelectedPrescription(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                  processingStatus === 'filled' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={handleProcessPrescription}
              >
                {processingStatus === 'filled' ? 'Complete Dispensing' : 'Cancel Prescription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}