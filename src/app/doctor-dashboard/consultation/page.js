'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MedicationAutocomplete from '@/components/pharmacy/MedicationAutocomplete';
import { prescriptionTemplates } from '@/services/drugDatabaseUtils';

export default function ConsultationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const patientId = searchParams.get('patientId');
  const patientName = searchParams.get('name');
  const patientAge = searchParams.get('age');
  const patientGender = searchParams.get('gender');
  const patientReason = searchParams.get('reason');
  const reportId = searchParams.get('reportId');
  
  const [loading, setLoading] = useState(true);
  const [labReportData, setLabReportData] = useState(null);
  const [vitals, setVitals] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: ''
  });
  const [patientHistory, setPatientHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chiefComplaints, setChiefComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [labTests, setLabTests] = useState([]);

  // Fetch patient data and lab report
  useEffect(() => {
    // Simulated API call to fetch patient data
    setTimeout(() => {
      // Mock patient history data
      if (patientId) {
        // Check if we should fetch past medical history
        setPatientHistory('Patient has history of hypertension (diagnosed 2020) and Type 2 Diabetes (diagnosed 2018). Father had history of coronary artery disease. Last HbA1c was 7.2% (3 months ago).');
        setAllergies('Penicillin (rash), Sulfa drugs (anaphylaxis)');
        setChiefComplaints('Patient presented with persistent headache for 3 days, mild dizziness when standing up quickly, and general fatigue.');
      }
      
      // Mock lab report data based on reportId
      if (reportId) {
        const mockReport = {
          id: reportId,
          testType: 'Lipid Profile',
          completedAt: new Date().toISOString(),
          hasAbnormalResults: true,
          abnormalParameters: ['totalCholesterol', 'ldlCholesterol'],
          findings: {
            totalCholesterol: 220,
            hdlCholesterol: 45,
            ldlCholesterol: 145,
            triglycerides: 180
          },
          interpretation: 'Elevated cholesterol levels indicate increased cardiovascular risk. Recommend lifestyle modifications and possible statin therapy.'
        };
        
        setLabReportData(mockReport);
      }
      
      setLoading(false);
    }, 800);
  }, [patientId, reportId]);

  const handleSaveConsultation = () => {
    // Save consultation data
    alert('Consultation saved successfully!');
    router.push('/doctor-dashboard');
  };

  const handleCompleteConsultation = () => {
    // Complete the consultation and mark patient as completed
    alert('Consultation completed successfully!');
    router.push('/doctor-dashboard');
  };

  const addPrescription = () => {
    setPrescriptions([
      ...prescriptions,
      { id: Date.now(), medication: '', dosage: '', frequency: '', duration: '' }
    ]);
  };

  const applyPrescriptionTemplate = (template) => {
    // Convert template medications to prescription format
    setPrescriptions(template.medications.map(med => ({
      id: Date.now() + Math.random(),
      medication: med.medication.brandName,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration
    })));
  };
  
  // Prescription templates are imported from drugDatabaseUtils in MedicationAutocomplete.tsx

  const updatePrescription = (id, field, value) => {
    setPrescriptions(prescriptions.map(prescription => 
      prescription.id === id ? { ...prescription, [field]: value } : prescription
    ));
  };

  const removePrescription = (id) => {
    setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
  };

  const orderLabTest = () => {
    setLabTests([
      ...labTests,
      { id: Date.now(), testName: '', instructions: '' }
    ]);
  };

  const updateLabTest = (id, field, value) => {
    setLabTests(labTests.map(test => 
      test.id === id ? { ...test, [field]: value } : test
    ));
  };

  const removeLabTest = (id) => {
    setLabTests(labTests.filter(test => test.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Consultation</h1>
            <p className="text-gray-500 mt-1">Examine, diagnose and prescribe treatment</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/doctor-dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            <p className="mt-2 text-gray-600">Loading patient data...</p>
          </div>
        ) : (
          <>
            {/* Patient Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-medium leading-6 text-gray-900">Patient Information</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and medical history</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name</span>
                    <p className="mt-1 text-sm text-gray-900">{patientName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Age</span>
                    <p className="mt-1 text-sm text-gray-900">{patientAge} years</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Gender</span>
                    <p className="mt-1 text-sm text-gray-900">{patientGender}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Patient ID</span>
                    <p className="mt-1 text-sm text-gray-900">{patientId}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-sm font-medium text-gray-500">Reason for Visit</span>
                    <p className="mt-1 text-sm text-gray-900">{patientReason}</p>
                  </div>
                </div>
                
                {/* Medical History and Allergies */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Medical History</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <textarea
                          rows={3}
                          className="w-full bg-transparent border-0 p-0 text-sm text-gray-900 focus:ring-0"
                          value={patientHistory}
                          onChange={(e) => setPatientHistory(e.target.value)}
                          placeholder="Enter patient's medical history and previous diagnoses"
                        ></textarea>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Allergies
                        {allergies && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Important</span>}
                      </h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <textarea
                          rows={3}
                          className="w-full bg-transparent border-0 p-0 text-sm text-gray-900 focus:ring-0"
                          value={allergies}
                          onChange={(e) => setAllergies(e.target.value)}
                          placeholder="Enter patient allergies (medications, foods, etc.)"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Chief Complaints */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Chief Complaints</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <textarea
                      rows={2}
                      className="w-full bg-transparent border-0 p-0 text-sm text-gray-900 focus:ring-0"
                      value={chiefComplaints}
                      onChange={(e) => setChiefComplaints(e.target.value)}
                      placeholder="Enter patient's primary complaints and symptoms"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Lab Report (if available) */}
            {labReportData && (
              <div className="bg-white shadow rounded-lg overflow-hidden mb-6 border border-amber-200">
                <div className="px-4 py-5 sm:px-6 bg-amber-50">
                  <h2 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Lab Report: {labReportData.testType}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Completed on {new Date(labReportData.completedAt).toLocaleString()}
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                  {labReportData.hasAbnormalResults && (
                    <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Abnormal Results Detected</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <ul className="list-disc pl-5 space-y-1">
                              {labReportData.abnormalParameters.map((param) => (
                                <li key={param}>
                                  {param.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {labReportData.findings[param]}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Interpretation:</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{labReportData.interpretation}</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link 
                      href={`/doctor-dashboard/lab-results?reportId=${reportId}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Full Report
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Vitals */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-5 sm:px-6 bg-green-50 border-b border-green-100">
                <h2 className="text-lg font-medium leading-6 text-gray-900">Vital Signs</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Record patient's vital measurements</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                      Temperature (°C)
                    </label>
                    <input
                      type="text"
                      id="temperature"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">
                      Blood Pressure (mmHg)
                    </label>
                    <input
                      type="text"
                      id="bloodPressure"
                      placeholder="120/80"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="text"
                      id="heartRate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="respiratoryRate" className="block text-sm font-medium text-gray-700">
                      Respiratory Rate (bpm)
                    </label>
                    <input
                      type="text"
                      id="respiratoryRate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={vitals.respiratoryRate}
                      onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="oxygenSaturation" className="block text-sm font-medium text-gray-700">
                      Oxygen Saturation (%)
                    </label>
                    <input
                      type="text"
                      id="oxygenSaturation"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                      Weight (kg)
                    </label>
                    <input
                      type="text"
                      id="weight"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                      Height (cm)
                    </label>
                    <input
                      type="text"
                      id="height"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={vitals.height}
                      onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis and Notes */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100">
                <h2 className="text-lg font-medium leading-6 text-gray-900">Diagnosis & Notes</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Record clinical findings and diagnosis</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="mb-4">
                  <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis
                  </label>
                  <textarea
                    id="diagnosis"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter primary diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Clinical Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={6}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter detailed clinical notes, observations, and findings"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Prescription */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-5 sm:px-6 bg-yellow-50 border-b border-yellow-100">
                <h2 className="text-lg font-medium leading-6 text-gray-900">Prescription</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Prescribe medications for the patient</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {/* Prescription Templates - Using MedicationAutocomplete component instead */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search for medications or select a template
                  </label>
                  <MedicationAutocomplete
                    className="w-full"
                    placeholder="Search medications or select a template..."
                    onSelect={(med) => {
                      // Add a new prescription with this medication
                      const newPrescription = {
                        id: Date.now() + Math.random(),
                        medication: `${med.brandName} (${med.genericName}) ${med.strength}`,
                        dosage: '',
                        frequency: '',
                        duration: ''
                      };
                      setPrescriptions([...prescriptions, newPrescription]);
                    }}
                    onTemplateSelect={applyPrescriptionTemplate}
                  />
                </div>
                {prescriptions.length === 0 ? (
                  <div className="text-center py-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add a new prescription for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription, index) => (
                      <div key={prescription.id} className="bg-gray-50 p-4 rounded-md relative">
                        <button
                          onClick={() => removePrescription(prescription.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Medication</label>
                            <MedicationAutocomplete
                              className="mt-1"
                              placeholder="Search medication..."
                              initialValue={prescription.medication}
                              onSelect={(med) => {
                                updatePrescription(prescription.id, 'medication', `${med.brandName} (${med.genericName}) ${med.strength}`);
                              }}
                              onTemplateSelect={applyPrescriptionTemplate}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Dosage</label>
                            <input
                              type="text"
                              placeholder="10mg"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={prescription.dosage}
                              onChange={(e) => updatePrescription(prescription.id, 'dosage', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Frequency</label>
                            <input
                              type="text"
                              placeholder="Twice daily"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={prescription.frequency}
                              onChange={(e) => updatePrescription(prescription.id, 'frequency', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Duration</label>
                            <input
                              type="text"
                              placeholder="7 days"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={prescription.duration}
                              onChange={(e) => updatePrescription(prescription.id, 'duration', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={addPrescription}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Medication
                  </button>
                </div>
              </div>
            </div>

            {/* Lab Tests */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-5 sm:px-6 bg-purple-50 border-b border-purple-100">
                <h2 className="text-lg font-medium leading-6 text-gray-900">Order Lab Tests</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Request laboratory tests for the patient</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {labTests.length === 0 ? (
                  <div className="text-center py-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No lab tests ordered</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Order a new laboratory test for this patient.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {labTests.map((test, index) => (
                      <div key={test.id} className="bg-gray-50 p-4 rounded-md relative">
                        <button
                          onClick={() => removeLabTest(test.id)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Test Name</label>
                            <input
                              type="text"
                              placeholder="Test name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={test.testName}
                              onChange={(e) => updateLabTest(test.id, 'testName', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                            <input
                              type="text"
                              placeholder="Any special instructions"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={test.instructions}
                              onChange={(e) => updateLabTest(test.id, 'instructions', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={orderLabTest}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Order Test
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  // Open prescription preview modal
                  const previewWindow = window.open('', 'PrescriptionPreview', 'width=800,height=800');
                  if (previewWindow) {
                    previewWindow.document.write(`
                      <html>
                        <head>
                          <title>Prescription Preview</title>
                          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                          <style>
                            @media print {
                              body {
                                width: 210mm;
                                height: 297mm;
                                margin: 0;
                                padding: 0;
                              }
                              .no-print {
                                display: none;
                              }
                            }
                            .prescription-container {
                              width: 210mm;
                              min-height: 297mm;
                              margin: 0 auto;
                              padding: 15mm;
                              box-sizing: border-box;
                              background-color: white;
                              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                              font-size: 12px;
                            }
                            /* Smaller text and tighter spacing for compact prescription */
                            .compact-section {
                              margin-bottom: 10px;
                            }
                            .compact-section h3 {
                              margin-bottom: 4px;
                              font-size: 13px;
                            }
                            .compact-section p, .compact-section ul {
                              margin: 0;
                              font-size: 12px;
                            }
                            .compact-table th, .compact-table td {
                              padding: 6px 8px;
                              font-size: 12px;
                            }
                          </style>
                        </head>
                        <body class="bg-gray-100">
                          <div class="no-print bg-blue-600 text-white py-4 text-center">
                            <h1 class="text-xl font-bold">Prescription Preview</h1>
                            <button onclick="window.print()" class="mt-2 bg-white text-blue-600 px-4 py-2 rounded font-bold">
                              Print Prescription
                            </button>
                            <button onclick="window.close()" class="mt-2 ml-2 bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold">
                              Close
                            </button>
                          </div>
                          <div class="prescription-container shadow-lg my-8">
                            <!-- Hospital/Clinic Header -->
                            <div class="mb-5 text-center border-b pb-3">
                              <h1 class="text-xl font-bold text-blue-800">City General Hospital</h1>
                              <p class="text-gray-600 text-sm">123 Healthcare Avenue, Medical District</p>
                              <p class="text-gray-600 text-sm">Phone: (123) 456-7890 | Email: care@cityhospital.com</p>
                            </div>
                            
                            <!-- Prescription Header -->
                            <div class="flex justify-between items-start mb-3">
                              <div>
                                <h2 class="text-lg font-bold">Prescription</h2>
                                <p class="text-gray-600 text-sm">Date: ${new Date().toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}</p>
                                <p class="text-gray-600 text-sm">Ref: P-${patientId || 'unknown'}-${new Date().getTime().toString().slice(-6)}</p>
                              </div>
                              <div class="text-right">
                                <h3 class="font-bold">Dr. John Doe</h3>
                                <p class="text-gray-600 text-sm">M.D. Medicine</p>
                                <p class="text-gray-600 text-sm">Reg No: MED-12345</p>
                              </div>
                            </div>
                            
                            <!-- Patient Information -->
                            <div class="mb-5 p-3 bg-gray-50 rounded text-sm">
                              <div class="grid grid-cols-2 gap-2">
                                <div>
                                  <p class="text-gray-600">
                                    <span class="font-bold">Patient:</span> ${patientName || 'Unknown'}
                                  </p>
                                  <p class="text-gray-600">
                                    <span class="font-bold">ID:</span> ${patientId || 'Unknown'}
                                  </p>
                                </div>
                                <div>
                                  <p class="text-gray-600">
                                    <span class="font-bold">Age/Gender:</span> ${patientAge || 'Unknown'} years / ${patientGender || 'Unknown'}
                                  </p>
                                  <p class="text-gray-600">
                                    <span class="font-bold">Date:</span> ${new Date().toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-3 mb-4">
                              <!-- Chief Complaints -->
                              <div class="compact-section">
                                <h3 class="font-bold">Chief Complaints:</h3>
                                <p class="text-gray-700">${chiefComplaints || 'None recorded'}</p>
                              </div>
                              
                              <!-- Vitals -->
                              <div class="compact-section">
                                <h3 class="font-bold">Vitals:</h3>
                                <p class="text-gray-700">
                                  ${vitals.temperature ? `Temp: ${vitals.temperature}°C, ` : ''}
                                  ${vitals.bloodPressure ? `BP: ${vitals.bloodPressure} mmHg, ` : ''}
                                  ${vitals.heartRate ? `HR: ${vitals.heartRate} bpm, ` : ''}
                                  ${vitals.respiratoryRate ? `RR: ${vitals.respiratoryRate}/min, ` : ''}
                                  ${vitals.oxygenSaturation ? `SpO2: ${vitals.oxygenSaturation}%, ` : ''}
                                  ${vitals.weight ? `Wt: ${vitals.weight} kg, ` : ''}
                                  ${vitals.height ? `Ht: ${vitals.height} cm` : ''}
                                </p>
                              </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-3 mb-4">
                              <!-- History -->
                              <div class="compact-section">
                                <h3 class="font-bold">Medical History:</h3>
                                <p class="text-gray-700">${patientHistory || 'None recorded'}</p>
                              </div>
                              
                              <!-- Allergies - Important to display prominently -->
                              <div class="compact-section">
                                <h3 class="font-bold text-red-600">Allergies:</h3>
                                <p class="text-gray-700">${allergies || 'No known allergies'}</p>
                              </div>
                            </div>
                            
                            <!-- Lab Tests (if any) -->
                            ${labTests.length > 0 ? `
                              <div class="compact-section mb-4">
                                <h3 class="font-bold">Laboratory Tests Ordered:</h3>
                                <ul class="list-disc ml-5 text-gray-700">
                                  ${labTests.map(test => `<li>${test.testName} ${test.instructions ? `(${test.instructions})` : ''}</li>`).join('')}
                                </ul>
                              </div>
                            ` : ''}
                            
                            <!-- Diagnosis - Important clinical information -->
                            <div class="compact-section mb-4">
                              <h3 class="font-bold">Diagnosis:</h3>
                              <p class="text-gray-700">${diagnosis || 'Diagnosis pending'}</p>
                            </div>
                            
                            <!-- Rx Symbol -->
                            <div class="mb-2">
                              <span class="text-2xl font-serif italic">℞</span>
                            </div>
                            
                            <!-- Medications - The core of the prescription -->
                            <div class="mb-5">
                              <table class="w-full compact-table">
                                <thead class="bg-gray-100">
                                  <tr>
                                    <th class="py-1 px-2 text-left border-b">Medication</th>
                                    <th class="py-1 px-2 text-left border-b">Dosage</th>
                                    <th class="py-1 px-2 text-left border-b">Frequency</th>
                                    <th class="py-1 px-2 text-left border-b">Duration</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${prescriptions.map((prescription, index) => `
                                    <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                                      <td class="py-2 px-2 border-b">${prescription.medication || 'N/A'}</td>
                                      <td class="py-2 px-2 border-b">${prescription.dosage || 'N/A'}</td>
                                      <td class="py-2 px-2 border-b">${prescription.frequency || 'N/A'}</td>
                                      <td class="py-2 px-2 border-b">${prescription.duration || 'N/A'}</td>
                                    </tr>
                                  `).join('')}
                                </tbody>
                              </table>
                            </div>
                            
                            <!-- Clinical Notes (if any) -->
                            ${notes ? `
                              <div class="compact-section mb-5">
                                <h3 class="font-bold">Clinical Notes:</h3>
                                <p class="text-gray-700 whitespace-pre-line">${notes}</p>
                              </div>
                            ` : ''}
                            
                            <!-- Instructions & Signature -->
                            <div class="grid grid-cols-2 gap-6 mt-6">
                              <div>
                                <h3 class="font-bold mb-1 text-sm">Patient Instructions:</h3>
                                <ul class="list-disc pl-5 text-gray-700 text-xs">
                                  <li>Take medications as prescribed</li>
                                  <li>Complete the full course of medication</li>
                                  <li>Keep medicines out of reach of children</li>
                                  <li>Store in a cool, dry place</li>
                                  <li>Return for follow-up as directed</li>
                                </ul>
                              </div>
                              <div class="text-right">
                                <div class="mb-10"></div>
                                <div class="border-t border-gray-400 pt-1 inline-block">
                                  <p class="font-bold">Dr. John Doe</p>
                                  <p class="text-gray-600 text-xs">Signature</p>
                                </div>
                              </div>
                            </div>
                            
                            <!-- Follow-up Section -->
                            <div class="mt-5 p-2 border-t border-gray-200 text-sm">
                              <p class="font-medium">Follow-up in: <span class="font-normal">2 weeks</span></p>
                              <p class="font-medium">Next appointment: <span class="font-normal">${new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString()}</span></p>
                            </div>
                            
                            <!-- Footer -->
                            <div class="text-center text-gray-500 text-xs mt-6 pt-2 border-t">
                              <p>This prescription is valid for 6 months from the date of issue unless otherwise specified.</p>
                              <p>Please bring this prescription for your next visit.</p>
                            </div>
                          </div>
                        </body>
                      </html>
                    `);
                    previewWindow.document.close();
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview Prescription
              </button>
              <button
                type="button"
                onClick={handleSaveConsultation}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save & Continue Later
              </button>
              <button
                type="button"
                onClick={handleCompleteConsultation}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Complete Consultation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}