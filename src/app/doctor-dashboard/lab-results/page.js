'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CBC_REFERENCE_RANGES,
  LFT_REFERENCE_RANGES,
  LIPID_REFERENCE_RANGES,
  THYROID_REFERENCE_RANGES,
  DIABETES_REFERENCE_RANGES,
  evaluateLabValue
} from '@/types/lab';
import LabTestResultView from '@/components/lab/LabTestResultView';
import EditableLabTestResult from '@/components/lab/EditableLabTestResult';

export default function DoctorLabResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [testType, setTestType] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const printRef = useRef();

  // Mock lab results data
  useEffect(() => {
    // Mock patient list
    const mockPatients = [
      { id: 'p1', name: 'John Smith' },
      { id: 'p2', name: 'Sarah Johnson' },
      { id: 'p3', name: 'Michael Brown' },
      { id: 'p4', name: 'Emma Wilson' },
      { id: 'p5', name: 'David Anderson' },
      { id: 'p7', name: 'Rahul Sharma' }
    ];
    
    // Mock lab results
    const mockResults = [
      {
        id: 'lab001',
        patient: {
          id: 'p5',
          name: 'David Anderson',
          gender: 'Male',
          dateOfBirth: '1962-04-20'
        },
        orderedBy: {
          id: 'DOC001',
          name: 'Dr. Robert Miller',
          specialization: 'General Medicine'
        },
        testType: 'Complete Blood Count',
        testCategory: 'CBC',
        orderedAt: '2023-09-05T08:00:00',
        collectedAt: '2023-09-05T08:30:00',
        completedAt: '2023-09-05T08:45:00',
        status: 'completed',
        result: {
          id: 'res001',
          labTest: 'lab001',
          enteredBy: 'LAB001',
          enteredAt: '2023-09-05T08:45:00',
          isAbnormal: true,
          abnormalParameters: ['hemoglobin', 'plateletCount'],
          findings: {
            hemoglobin: 10.5,
            redBloodCellCount: 4.2,
            whiteBloodCellCount: 7200,
            neutrophils: 56,
            lymphocytes: 32,
            monocytes: 5,
            eosinophils: 2,
            basophils: 0.5,
            plateletCount: 110000,
            hematocrit: 35,
            mcv: 85,
            mch: 28,
            mchc: 32,
            rdw: 14.5
          },
          interpretation: 'Hemoglobin is below normal range, indicating mild anemia. Platelet count is also below normal range, which may indicate thrombocytopenia. Further evaluation recommended.'
        },
        reason: 'Recent admission for anemia'
      },
      {
        id: 'lab002',
        patient: {
          id: 'p2',
          name: 'Sarah Johnson',
          gender: 'Female',
          dateOfBirth: '1991-08-12'
        },
        orderedBy: {
          id: 'DOC002',
          name: 'Dr. Jennifer Lee',
          specialization: 'Internal Medicine'
        },
        testType: 'Lipid Profile',
        testCategory: 'LIPID',
        orderedAt: '2023-09-04T14:30:00',
        collectedAt: '2023-09-04T15:00:00',
        completedAt: '2023-09-05T09:30:00',
        status: 'completed',
        result: {
          id: 'res002',
          labTest: 'lab002',
          enteredBy: 'LAB002',
          enteredAt: '2023-09-05T09:30:00',
          isAbnormal: true,
          abnormalParameters: ['totalCholesterol', 'ldlCholesterol'],
          findings: {
            totalCholesterol: 210,
            hdlCholesterol: 45,
            ldlCholesterol: 130,
            triglycerides: 150,
            nonHdlCholesterol: 165,
            totalCholesterolHdlRatio: 4.7
          },
          interpretation: 'Elevated total cholesterol and LDL levels. Consider lifestyle modifications including dietary changes and exercise. Follow-up recommended in 3 months.'
        },
        reason: 'Routine checkup'
      },
      {
        id: 'lab003',
        patient: {
          id: 'p7',
          name: 'Rahul Sharma',
          gender: 'Male',
          dateOfBirth: '1983-11-15'
        },
        orderedBy: {
          id: 'DOC001',
          name: 'Dr. Robert Miller',
          specialization: 'General Medicine'
        },
        testType: 'Thyroid Function',
        testCategory: 'THYROID',
        orderedAt: '2023-09-05T09:30:00',
        collectedAt: '2023-09-05T10:00:00',
        completedAt: '2023-09-05T10:15:00',
        status: 'completed',
        result: {
          id: 'res003',
          labTest: 'lab003',
          enteredBy: 'LAB001',
          enteredAt: '2023-09-05T10:15:00',
          isAbnormal: false,
          findings: {
            tsh: 2.1,
            freeT4: 1.3,
            freeT3: 3.2
          },
          interpretation: 'All thyroid parameters are within normal range. No evidence of thyroid dysfunction.'
        },
        reason: 'Annual checkup'
      }
    ];

    setPatients(mockPatients);
    
    setLoading(true);
    // Simulate loading time
    setTimeout(() => {
      // If reportId is provided, find that specific report
      if (reportId) {
        const report = mockResults.find(r => r.id === reportId);
        if (report) {
          setResults([report]);
          setSelectedResult(report);
          setShowDetailView(true);
          setSelectedPatient(report.patient.id);
        } else {
          setResults(mockResults);
        }
      } else {
        setResults(mockResults);
      }
      setLoading(false);
    }, 800);
  }, [reportId]);

  // Apply filters
  const applyFilters = () => {
    setLoading(true);
    
    // Simulate API call with filters
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handlePatientChange = (e) => {
    const newPatientId = e.target.value;
    setSelectedPatient(newPatientId);
    
    // Update URL with new patient ID
    if (newPatientId) {
      router.push(`/doctor-dashboard/lab-results?patientId=${newPatientId}`);
    } else {
      router.push(`/doctor-dashboard/lab-results`);
    }
  };

  const viewResult = (result) => {
    setSelectedResult(result);
    setShowDetailView(true);
    setIsEditing(false);
  };

  const closeDetailView = () => {
    setShowDetailView(false);
    setSelectedResult(null);
    setIsEditing(false);
  };

  const printReport = () => {
    alert('Printing report...');
  };

  const addToQueue = (result) => {
    alert(`Adding ${result.patient.name} to the queue for follow-up on ${result.testType}...`);
    router.push('/doctor-dashboard');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (updatedTest) => {
    // In a real app, this would make an API call to update the test
    // For now, we'll update the local state
    setResults(prevResults => 
      prevResults.map(result => 
        result.id === updatedTest.id ? updatedTest : result
      )
    );
    setSelectedResult(updatedTest);
    setIsEditing(false);
    
    // Show success message
    alert('Lab report successfully updated');
  };

  // Get reference range for a parameter
  const getParameterReferenceRange = (paramName, testCategory, gender) => {
    if (!testCategory) return 'Not available';
    
    let referenceRanges;
    switch (testCategory) {
      case 'CBC':
        referenceRanges = CBC_REFERENCE_RANGES;
        break;
      case 'LFT':
        referenceRanges = LFT_REFERENCE_RANGES;
        break;
      case 'LIPID':
        referenceRanges = LIPID_REFERENCE_RANGES;
        break;
      case 'THYROID':
        referenceRanges = THYROID_REFERENCE_RANGES;
        break;
      case 'DIABETES':
        referenceRanges = DIABETES_REFERENCE_RANGES;
        break;
      default:
        return 'Not available';
    }
    
    const range = referenceRanges[paramName];
    if (!range) return 'Not available';
    
    if (gender === 'Male' && range.male) {
      return `${range.male.min} - ${range.male.max} ${range.unit}`;
    } else if (gender === 'Female' && range.female) {
      return `${range.female.min} - ${range.female.max} ${range.unit}`;
    } else if (range.common) {
      return `${range.common.min} - ${range.common.max} ${range.unit}`;
    }
    
    return 'Not available';
  };

  // Check if any test parameter is abnormal
  const hasAbnormalResults = (result) => {
    return result.result?.isAbnormal || false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and analyze patient laboratory results
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-3">
              <button
                onClick={() => router.push('/doctor-dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700">
                Filter by Patient
              </label>
              <select
                id="patient-select"
                name="patient-select"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedPatient}
                onChange={handlePatientChange}
              >
                <option value="">All Patients</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label htmlFor="test-type" className="block text-sm font-medium text-gray-700">
                Test Type
              </label>
              <select
                id="test-type"
                name="test-type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
              >
                <option value="all">All Tests</option>
                <option value="CBC">Complete Blood Count</option>
                <option value="LIPID">Lipid Profile</option>
                <option value="THYROID">Thyroid Function</option>
                <option value="LFT">Liver Function</option>
                <option value="KFT">Kidney Function</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label htmlFor="date-range" className="block text-sm font-medium text-gray-700">
                Date Range
              </label>
              <select
                id="date-range"
                name="date-range"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <button
                type="button"
                onClick={applyFilters}
                className="inline-flex mt-6 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Results List */}
          <div className={`lg:col-span-${showDetailView ? '1' : '3'}`}>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Lab Results</h3>
                <p className="mt-1 text-sm text-gray-500">{results.length} results found</p>
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
                  {results.length > 0 ? (
                    results.map((result) => (
                      <li 
                        key={result.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedResult?.id === result.id ? 'bg-blue-50' : ''}`}
                        onClick={() => viewResult(result)}
                        data-testid={`lab-result-item-${result.id}`}
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-blue-600 truncate">{result.testType}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {new Date(result.completedAt).toLocaleDateString()}
                              </p>
                              {hasAbnormalResults(result) && (
                                <p className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                  Abnormal
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                {result.patient.name}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                {result.patient.gender}, {new Date().getFullYear() - new Date(result.patient.dateOfBirth).getFullYear()} yrs
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <p>
                                {new Date(result.completedAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-6 text-center text-gray-500">
                      No lab results found for the selected filters.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Result Detail View */}
          {showDetailView && selectedResult && (
            <div className="lg:col-span-2">
              <div ref={printRef}>
                {isEditing ? (
                  <EditableLabTestResult 
                    test={selectedResult}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    onPrint={printReport}
                  />
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          {selectedResult.testType} Results
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Completed: {new Date(selectedResult.completedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleEditClick}
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={closeDetailView}
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
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedResult.patient.name}</p>
                          <p className="text-sm text-gray-500">ID: {selectedResult.patient.id}</p>
                          <p className="text-sm text-gray-500">
                            {selectedResult.patient.gender}, {new Date().getFullYear() - new Date(selectedResult.patient.dateOfBirth).getFullYear()} yrs
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Info</h4>
                          <p className="mt-1 text-sm text-gray-900">Ordered by: {selectedResult.orderedBy.name}</p>
                          <p className="text-sm text-gray-500">
                            Ordered: {new Date(selectedResult.orderedAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            Status: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {selectedResult.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Results Table */}
                      {selectedResult.result && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Test
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Result
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Reference Range
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {Object.entries(selectedResult.result.findings).map(([key, value]) => (
                                <tr 
                                  key={key} 
                                  className={selectedResult.result.abnormalParameters?.includes(key) ? "bg-amber-50" : ""}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm ${selectedResult.result.abnormalParameters?.includes(key) ? "font-bold text-red-600" : "text-gray-900"}`}>
                                      {value}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                      {getParameterReferenceRange(key, selectedResult.testCategory, selectedResult.patient.gender)}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {selectedResult.result.abnormalParameters?.includes(key) ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Abnormal
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Normal
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Interpretation */}
                      {selectedResult.result?.interpretation && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">Interpretation</h4>
                          <p className="text-sm text-gray-700 whitespace-pre-line">{selectedResult.result.interpretation}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          onClick={printReport}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          Print Results
                        </button>
                        <button
                          onClick={() => addToQueue(selectedResult)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add to Queue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}