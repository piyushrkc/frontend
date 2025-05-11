'use client';

import React, { useState, useEffect } from 'react';
import { 
  LabTest, 
  LabTestCategory,
  ReferenceRange,
  LabResultFlag,
  evaluateLabValue,
  getFormattedValue,
  getFlagColorClass,
  getFlagBgClass,
  CBC_REFERENCE_RANGES,
  LFT_REFERENCE_RANGES,
  KFT_REFERENCE_RANGES,
  LIPID_REFERENCE_RANGES,
  THYROID_REFERENCE_RANGES,
  DIABETES_REFERENCE_RANGES,
  CARDIAC_REFERENCE_RANGES,
  ELECTROLYTES_REFERENCE_RANGES,
  IRON_REFERENCE_RANGES,
  COAGULATION_REFERENCE_RANGES
} from '@/types/lab';

type EditableLabTestResultProps = {
  test: LabTest;
  onSave: (updatedTest: LabTest) => void;
  onCancel: () => void;
  onPrint?: () => void;
};

export default function EditableLabTestResult({ 
  test, 
  onSave, 
  onCancel,
  onPrint
}: EditableLabTestResultProps) {
  const [editedTest, setEditedTest] = useState<LabTest>({ ...test });
  const [editedFindings, setEditedFindings] = useState<Record<string, any>>({ 
    ...(test.result?.findings || {}) 
  });
  const [interpretation, setInterpretation] = useState<string>(
    test.result?.interpretation || ''
  );
  const [abnormalParameters, setAbnormalParameters] = useState<string[]>(
    test.result?.abnormalParameters || []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Get reference ranges based on category
  const getReferenceRanges = (category?: LabTestCategory) => {
    if (!category) return {};
    
    switch (category) {
      case 'CBC':
        return CBC_REFERENCE_RANGES;
      case 'LFT':
        return LFT_REFERENCE_RANGES;
      case 'KFT':
        return KFT_REFERENCE_RANGES;
      case 'LIPID':
        return LIPID_REFERENCE_RANGES;
      case 'THYROID':
        return THYROID_REFERENCE_RANGES;
      case 'DIABETES':
        return DIABETES_REFERENCE_RANGES;
      case 'CARDIAC':
        return CARDIAC_REFERENCE_RANGES;
      case 'ELECTROLYTES':
        return ELECTROLYTES_REFERENCE_RANGES;
      case 'IRON':
        return IRON_REFERENCE_RANGES;
      case 'COAGULATION':
        return COAGULATION_REFERENCE_RANGES;
      default:
        return {};
    }
  };

  // Update abnormal parameters whenever findings change
  useEffect(() => {
    const newAbnormalParams: string[] = [];
    
    if (editedTest.testCategory) {
      const referenceRanges = getReferenceRanges(editedTest.testCategory);
      
      Object.entries(editedFindings).forEach(([paramName, value]) => {
        if (value === '' || value === null || value === undefined) return;
        
        const range = referenceRanges[paramName] as ReferenceRange;
        if (!range) return;
        
        const flag = evaluateLabValue(parseFloat(value), range, editedTest.patient.gender);
        if (flag !== 'normal') {
          newAbnormalParams.push(paramName);
        }
      });
    }
    
    setAbnormalParameters(newAbnormalParams);
  }, [editedFindings, editedTest.testCategory, editedTest.patient.gender]);

  // Handle input changes
  const handleInputChange = (paramName: string, value: string) => {
    const parsedValue = value === '' ? '' : value;
    
    setEditedFindings(prev => ({
      ...prev,
      [paramName]: parsedValue
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Filter out empty fields
    const filteredFindings = Object.entries(editedFindings).reduce((acc, [key, value]) => {
      if (value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Create updated test object
    const updatedTest: LabTest = {
      ...editedTest,
      result: {
        ...(editedTest.result || {
          id: `result-${Date.now()}`,
          labTest: editedTest.id,
          enteredBy: 'current-user', // This should be replaced with actual user ID
          enteredAt: new Date().toISOString(),
          findings: {}
        }),
        findings: filteredFindings,
        interpretation,
        abnormalParameters,
        isAbnormal: abnormalParameters.length > 0,
        updatedAt: new Date().toISOString(),
        updatedBy: 'current-user', // This should be replaced with actual user ID
      }
    };
    
    // Process the data
    setTimeout(() => {
      onSave(updatedTest);
      setIsLoading(false);
    }, 500);
  };

  // Get parameter flag
  const getParamFlag = (paramName: string, value: any): LabResultFlag => {
    if (
      value === '' || 
      value === null || 
      value === undefined || 
      !editedTest.testCategory
    ) {
      return 'normal';
    }
    
    const referenceRanges = getReferenceRanges(editedTest.testCategory);
    const range = referenceRanges[paramName] as ReferenceRange;
    
    if (!range) {
      return 'normal';
    }
    
    return evaluateLabValue(parseFloat(value), range, editedTest.patient.gender);
  };

  // Get reference range display text based on gender
  const getReferenceRangeText = (range: ReferenceRange): string => {
    if (editedTest.patient.gender === 'Male' && range.male) {
      return `${range.male.min} - ${range.male.max}`;
    } else if (editedTest.patient.gender === 'Female' && range.female) {
      return `${range.female.min} - ${range.female.max}`;
    } else if (range.common) {
      return `${range.common.min} - ${range.common.max}`;
    }
    return `Not available`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get readable name for parameter
  const getReadableName = (paramName: string): string => {
    return paramName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // Render result table for editing
  const renderEditableResultTable = () => {
    if (!editedTest.testCategory) return null;
    
    const referenceRanges = getReferenceRanges(editedTest.testCategory);
    
    // Get all parameters for this test category
    const parameters = Object.keys(referenceRanges);
    
    if (parameters.length === 0) return null;
    
    return (
      <div className="overflow-x-auto">
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
                Units
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
            {parameters.map(paramName => {
              const value = editedFindings[paramName] || '';
              const range = referenceRanges[paramName] as ReferenceRange;
              
              if (!range) return null;
              
              const flag = getParamFlag(paramName, value);
              
              return (
                <tr 
                  key={paramName} 
                  className={flag !== 'normal' ? 'bg-amber-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {getReadableName(paramName)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getFlagColorClass(flag)}`}>
                      <input
                        type="number"
                        step="any"
                        value={value}
                        onChange={(e) => handleInputChange(paramName, e.target.value)}
                        className={`block w-24 py-1 px-2 sm:text-sm rounded-md ${
                          flag !== 'normal' 
                            ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {range.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getReferenceRangeText(range)}
                      {(editedTest.patient.gender === 'Male' && range.male) || 
                       (editedTest.patient.gender === 'Female' && range.female) ? (
                        <span className="ml-1 text-xs text-blue-600">
                          ({editedTest.patient.gender})
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFlagBgClass(flag)}`}>
                      {flag === 'critical_high' ? 'Critical High' :
                       flag === 'critical_low' ? 'Critical Low' :
                       flag === 'high' ? 'High' :
                       flag === 'low' ? 'Low' : 'Normal'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Render abnormal parameters summary
  const renderAbnormalSummary = () => {
    if (abnormalParameters.length === 0 || !editedTest.testCategory) return null;
    
    const referenceRanges = getReferenceRanges(editedTest.testCategory);
    
    const abnormalParams = abnormalParameters
      .filter(paramName => {
        const value = editedFindings[paramName];
        return value !== undefined && value !== null && value !== '';
      })
      .map(paramName => {
        const value = editedFindings[paramName];
        const flag = getParamFlag(paramName, value);
        const range = referenceRanges[paramName] as ReferenceRange;
        
        return {
          name: getReadableName(paramName),
          value,
          unit: range.unit,
          flag,
          referenceRange: getReferenceRangeText(range)
        };
      });
    
    if (abnormalParams.length === 0) return null;
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Abnormal Results Summary</h4>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <ul className="space-y-2">
            {abnormalParams.map((param, index) => (
              <li key={index} className="text-sm">
                <span className={getFlagColorClass(param.flag)}>
                  {param.name}: {param.value} {param.unit}
                </span>
                <span className="text-gray-600 text-xs ml-2">
                  (Reference Range: {param.referenceRange})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {editedTest.testType} Results (Editing Mode)
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {editedTest.completedAt ? `Completed: ${formatDate(editedTest.completedAt)}` : 'Processing'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</h4>
            <p className="mt-1 text-sm text-gray-900">{editedTest.patient.name}</p>
            <p className="text-sm text-gray-500">ID: {editedTest.patient.id}</p>
            <p className="text-sm text-gray-500">
              {editedTest.patient.gender}
              {editedTest.patient.dateOfBirth ? `, ${new Date(editedTest.patient.dateOfBirth).toLocaleDateString()}` : ''}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Info</h4>
            <p className="mt-1 text-sm text-gray-900">Ordered by: {editedTest.orderedBy.name}</p>
            <p className="text-sm text-gray-500">
              Ordered: {formatDate(editedTest.orderedAt)}
            </p>
            <p className="text-sm text-gray-500">
              Status: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                editedTest.status === 'completed' ? 'bg-green-100 text-green-800' :
                editedTest.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                editedTest.status === 'collected' ? 'bg-yellow-100 text-yellow-800' :
                editedTest.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {editedTest.status.charAt(0).toUpperCase() + editedTest.status.slice(1)}
              </span>
            </p>
          </div>
        </div>

        {/* Results Table */}
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          {renderEditableResultTable()}
        </div>
        
        {/* Abnormal Results Summary */}
        {renderAbnormalSummary()}
        
        {/* Interpretation */}
        <div className="mb-6">
          <label htmlFor="interpretation" className="block text-sm font-medium text-gray-700 mb-1">
            Interpretation
          </label>
          <textarea
            id="interpretation"
            name="interpretation"
            rows={4}
            value={interpretation}
            onChange={(e) => setInterpretation(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter your interpretation of the test results"
          ></textarea>
        </div>
        
        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Results
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Results'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}