'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LabTestEntryForm from '@/components/lab/LabTestEntryForm';
import LabTestResultView from '@/components/lab/LabTestResultView';
import { LabTest } from '@/types/lab';

export default function EnterLabResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  
  const [test, setTest] = useState<LabTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // Simulate API call to get test details
    setLoading(true);
    
    // Mock data for demo purposes
    setTimeout(() => {
      if (!testId) {
        setError('No test ID provided');
        setLoading(false);
        return;
      }
      
      // Create appropriate mock test data based on test ID suffix
      const testIdSuffix = testId.slice(-3);
      let mockTest: LabTest;
      
      switch (testIdSuffix) {
        case '001': // CBC
          mockTest = {
            id: testId,
            patient: {
              id: 'PAT001',
              name: 'John Smith',
              gender: 'Male',
              dateOfBirth: '1980-06-15'
            },
            orderedBy: {
              id: 'DOC001',
              name: 'Dr. Robert Miller',
              specialization: 'General Medicine'
            },
            testType: 'Complete Blood Count',
            testCategory: 'CBC',
            orderedAt: new Date().toISOString(),
            status: 'collected',
            collectedAt: new Date().toISOString()
          };
          break;
        case '002': // Lipid Profile
          mockTest = {
            id: testId,
            patient: {
              id: 'PAT002',
              name: 'Sarah Johnson',
              gender: 'Female',
              dateOfBirth: '1992-03-22'
            },
            orderedBy: {
              id: 'DOC002',
              name: 'Dr. Jennifer Lee',
              specialization: 'Endocrinology'
            },
            testType: 'Lipid Profile',
            testCategory: 'LIPID',
            orderedAt: new Date().toISOString(),
            status: 'collected',
            collectedAt: new Date().toISOString()
          };
          break;
        case '003': // LFT
          mockTest = {
            id: testId,
            patient: {
              id: 'PAT003',
              name: 'Michael Williams',
              gender: 'Male',
              dateOfBirth: '1975-11-08'
            },
            orderedBy: {
              id: 'DOC003',
              name: 'Dr. Michael Brown',
              specialization: 'Internal Medicine'
            },
            testType: 'Liver Function Test',
            testCategory: 'LFT',
            orderedAt: new Date().toISOString(),
            status: 'collected',
            collectedAt: new Date().toISOString()
          };
          break;
        case '004': // Thyroid
          mockTest = {
            id: testId,
            patient: {
              id: 'PAT004',
              name: 'Emily Brown',
              gender: 'Female',
              dateOfBirth: '1988-09-30'
            },
            orderedBy: {
              id: 'DOC001',
              name: 'Dr. Robert Miller',
              specialization: 'General Medicine'
            },
            testType: 'Thyroid Function Panel',
            testCategory: 'THYROID',
            orderedAt: new Date().toISOString(),
            status: 'collected',
            collectedAt: new Date().toISOString()
          };
          break;
        default:
          mockTest = {
            id: testId,
            patient: {
              id: 'PAT001',
              name: 'John Smith',
              gender: 'Male',
              dateOfBirth: '1980-06-15'
            },
            orderedBy: {
              id: 'DOC001',
              name: 'Dr. Robert Miller',
              specialization: 'General Medicine'
            },
            testType: 'Laboratory Test',
            orderedAt: new Date().toISOString(),
            status: 'collected',
            collectedAt: new Date().toISOString()
          };
      }
      
      setTest(mockTest);
      setLoading(false);
    }, 800);
  }, [testId]);

  const handleSaveResults = (findings: any, interpretation: string) => {
    if (!test) return;
    
    setSaving(true);
    
    // Simulate API call to save results
    setTimeout(() => {
      // Update the test with results
      const updatedTest: LabTest = {
        ...test,
        status: 'completed',
        completedAt: new Date().toISOString(),
        processedBy: 'LAB001',
        result: {
          id: `res-${test.id}`,
          labTest: test.id,
          findings,
          interpretation,
          enteredBy: 'LAB001',
          enteredAt: new Date().toISOString(),
          isAbnormal: false // This will be computed by the backend in a real app
        }
      };
      
      setTest(updatedTest);
      setSaving(false);
      setSuccess(true);
    }, 1500);
  };

  const handleCancel = () => {
    // Return to lab dashboard
    router.push('/lab-dashboard');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-8 max-w-md">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Error</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/lab-dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (success && test?.result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-900">Results Saved Successfully</h1>
                <button
                  onClick={() => router.push('/lab-dashboard')}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Lab results have been successfully saved and are now available to doctors.
                    </h3>
                  </div>
                </div>
              </div>

              <LabTestResultView test={test} showActions={false} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show entry form
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">Enter Lab Results</h1>
              <button
                onClick={() => router.push('/lab-dashboard')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {test && (
          <LabTestEntryForm 
            test={test} 
            onSave={handleSaveResults}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}