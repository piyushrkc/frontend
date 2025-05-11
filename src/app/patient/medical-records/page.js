'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PatientMedicalRecordsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Mock data for medical records
  useEffect(() => {
    // In a real app, this would be an API call
    const mockRecords = [
      {
        id: 'rec1',
        type: 'Prescription',
        date: '2025-04-20',
        doctor: 'Dr. Jennifer Lee',
        specialty: 'Dermatology',
        facility: 'City General Hospital',
        description: 'Prescription for skin condition',
        files: ['prescription.pdf'],
        details: {
          diagnosis: 'Contact Dermatitis',
          medications: [
            { name: 'Hydrocortisone Cream', dosage: '1%', frequency: 'BID', duration: '7 days' },
            { name: 'Cetirizine', dosage: '10mg', frequency: 'OD', duration: '10 days' }
          ],
          notes: 'Apply cream to affected areas. Avoid contact with allergens.'
        }
      },
      {
        id: 'rec2',
        type: 'Lab Report',
        date: '2025-04-18',
        doctor: 'Dr. Michael Brown',
        specialty: 'Cardiology',
        facility: 'Heart Center',
        description: 'Cholesterol panel results',
        files: ['lipid_panel.pdf'],
        details: {
          tests: [
            { name: 'Total Cholesterol', value: '210 mg/dL', reference: '< 200 mg/dL', flag: 'High' },
            { name: 'HDL Cholesterol', value: '55 mg/dL', reference: '> 40 mg/dL', flag: 'Normal' },
            { name: 'LDL Cholesterol', value: '130 mg/dL', reference: '< 100 mg/dL', flag: 'High' },
            { name: 'Triglycerides', value: '150 mg/dL', reference: '< 150 mg/dL', flag: 'Normal' }
          ],
          interpretation: 'Elevated cholesterol levels. Dietary changes recommended.'
        }
      },
      {
        id: 'rec3',
        type: 'Clinical Notes',
        date: '2025-04-15',
        doctor: 'Dr. Robert Miller',
        specialty: 'General Medicine',
        facility: 'City General Hospital',
        description: 'Follow-up visit notes',
        files: ['clinical_notes.pdf'],
        details: {
          chiefComplaint: 'Follow-up for hypertension',
          vitalSigns: {
            bloodPressure: '138/85 mmHg',
            heartRate: '72 bpm',
            temperature: '98.6°F',
            respiratoryRate: '16/min'
          },
          assessment: 'Hypertension - controlled with current medication',
          plan: 'Continue current medication. Follow up in 3 months. Monitor blood pressure at home.'
        }
      }
    ];
    
    setTimeout(() => {
      setRecords(mockRecords);
      // If an appointment ID was provided, find a related record
      if (appointmentId) {
        const record = mockRecords.find(rec => rec.date === '2025-04-20'); // Mock relationship
        if (record) {
          setSelectedRecord(record);
          setShowPreview(true);
        }
      }
      setLoading(false);
    }, 800); // Simulate network delay
  }, [appointmentId]);

  const viewRecord = (record) => {
    setSelectedRecord(record);
    setShowPreview(true);
  };

  const downloadRecord = (fileId) => {
    // In a real app, this would initiate a file download
    alert(`Downloading file ${fileId}. This would be an actual download in a real application.`);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedRecord(null);
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case 'Prescription':
        return (
          <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'Lab Report':
        return (
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'Clinical Notes':
        return (
          <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
              <p className="mt-1 text-sm text-gray-600">
                View your medical records and documents
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Records List */}
          <div className={`lg:col-span-${showPreview ? '1' : '3'}`}>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Records</h3>
                  <p className="mt-1 text-sm text-gray-500">Your medical history and documents</p>
                </div>
                <div>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue="all"
                  >
                    <option value="all">All Types</option>
                    <option value="prescription">Prescriptions</option>
                    <option value="lab">Lab Reports</option>
                    <option value="clinical">Clinical Notes</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="px-4 py-5 sm:p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {records.map((record) => (
                    <li 
                      key={record.id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedRecord?.id === record.id ? 'bg-blue-50' : ''}`}
                      onClick={() => viewRecord(record)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getRecordIcon(record.type)}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">{record.type}</p>
                              <p className="ml-2 flex-shrink-0 flex">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {new Date(record.date).toLocaleDateString()}
                                </span>
                              </p>
                            </div>
                            <div className="mt-2 flex justify-between">
                              <div>
                                <p className="flex items-center text-sm text-gray-500">
                                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                  {record.doctor}
                                </p>
                                <p className="mt-1 flex items-center text-sm text-gray-500">
                                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  {record.facility}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Record Preview */}
          {showPreview && selectedRecord && (
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{selectedRecord.type} Details</h3>
                    <p className="mt-1 text-sm text-gray-500">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button
                      onClick={closePreview}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedRecord.doctor}</p>
                      <p className="text-sm text-gray-500">{selectedRecord.specialty}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Facility</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedRecord.facility}</p>
                    </div>
                  </div>

                  {/* Prescription Details */}
                  {selectedRecord.type === 'Prescription' && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800">Diagnosis:</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.details.diagnosis}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800">Medications:</h4>
                        <div className="mt-2 space-y-2">
                          {selectedRecord.details.medications.map((med, idx) => (
                            <div key={idx} className="flex items-start">
                              <span className="text-sm font-medium text-gray-500 w-6">{idx + 1}.</span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{med.name} {med.dosage}</p>
                                <p className="text-sm text-gray-700">{med.frequency}, for {med.duration}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {selectedRecord.details.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800">Notes:</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedRecord.details.notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lab Report Details */}
                  {selectedRecord.type === 'Lab Report' && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800">Test Results:</h4>
                        <div className="mt-2 overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Range</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedRecord.details.tests.map((test, idx) => (
                                <tr key={idx}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.name}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.value}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.reference}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${test.flag === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {test.flag}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {selectedRecord.details.interpretation && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800">Interpretation:</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedRecord.details.interpretation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Clinical Notes Details */}
                  {selectedRecord.type === 'Clinical Notes' && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800">Chief Complaint:</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.details.chiefComplaint}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800">Vital Signs:</h4>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Blood Pressure</p>
                            <p className="text-sm text-gray-900">{selectedRecord.details.vitalSigns.bloodPressure}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Heart Rate</p>
                            <p className="text-sm text-gray-900">{selectedRecord.details.vitalSigns.heartRate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Temperature</p>
                            <p className="text-sm text-gray-900">{selectedRecord.details.vitalSigns.temperature}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Respiratory Rate</p>
                            <p className="text-sm text-gray-900">{selectedRecord.details.vitalSigns.respiratoryRate}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800">Assessment:</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.details.assessment}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800">Plan:</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedRecord.details.plan}</p>
                      </div>
                    </div>
                  )}

                  {/* Document Downloads */}
                  {selectedRecord.files && selectedRecord.files.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-800">Documents:</h4>
                      <ul className="mt-2 divide-y divide-gray-200">
                        {selectedRecord.files.map((file, idx) => (
                          <li key={idx} className="py-2 flex justify-between items-center">
                            <div className="flex items-center">
                              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                              <span className="ml-2 flex-1 w-0 truncate text-sm text-gray-500">{file}</span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <button
                                onClick={() => downloadRecord(file)}
                                className="font-medium text-blue-600 hover:text-blue-500 text-sm"
                              >
                                Download
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => downloadRecord(selectedRecord.files[0])}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={() => alert('Share functionality would go here. This would typically open a sharing dialog.')}
                      className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share with Doctor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}