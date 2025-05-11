'use client';

import React from 'react';
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

type LabTestResultViewProps = {
  test: LabTest;
  onPrint?: () => void;
  onClose?: () => void;
  showActions?: boolean;
};

export default function LabTestResultView({ 
  test, 
  onPrint, 
  onClose, 
  showActions = true 
}: LabTestResultViewProps) {
  
  // Function to get reference ranges based on category
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

  // Get parameter flag
  const getParamFlag = (paramName: string, value: any): LabResultFlag => {
    if (
      value === '' || 
      value === null || 
      value === undefined || 
      !test.testCategory
    ) {
      return 'normal';
    }
    
    const referenceRanges = getReferenceRanges(test.testCategory);
    const range = referenceRanges[paramName] as ReferenceRange;
    
    if (!range) {
      return 'normal';
    }
    
    return evaluateLabValue(parseFloat(value), range, test.patient.gender);
  };

  // Get display value with appropriate formatting
  const getDisplayValue = (paramName: string, value: any): string => {
    if (
      value === '' || 
      value === null || 
      value === undefined || 
      !test.testCategory
    ) {
      return '';
    }
    
    const referenceRanges = getReferenceRanges(test.testCategory);
    const range = referenceRanges[paramName] as ReferenceRange;
    
    if (!range) {
      return value.toString();
    }
    
    return getFormattedValue(parseFloat(value), range.unit);
  };

  // Get reference range display text based on gender
  const getReferenceRangeText = (range: ReferenceRange): string => {
    if (test.patient.gender === 'Male' && range.male) {
      return `${range.male.min} - ${range.male.max}`;
    } else if (test.patient.gender === 'Female' && range.female) {
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

  // Render result table for a specific category
  const renderResultTable = () => {
    if (!test.result || !test.testCategory) return null;
    
    const findings = test.result.findings;
    const referenceRanges = getReferenceRanges(test.testCategory);
    
    // Get all parameters that have values
    const parameters = Object.keys(findings).filter(
      key => findings[key] !== undefined && findings[key] !== null && findings[key] !== ''
    );
    
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
              const value = findings[paramName];
              const range = referenceRanges[paramName] as ReferenceRange;
              
              if (!range) return null;
              
              const flag = getParamFlag(paramName, value);
              const displayValue = getDisplayValue(paramName, value);
              
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
                      {displayValue}
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
                      {(test.patient.gender === 'Male' && range.male) || 
                       (test.patient.gender === 'Female' && range.female) ? (
                        <span className="ml-1 text-xs text-blue-600">
                          ({test.patient.gender})
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

  // Render interpretation section
  const renderInterpretation = () => {
    if (!test.result?.interpretation) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Interpretation</h4>
        <p className="text-sm text-gray-700 whitespace-pre-line">{test.result.interpretation}</p>
      </div>
    );
  };

  // Get summary of abnormal parameters
  const renderAbnormalSummary = () => {
    if (!test.result || !test.testCategory) return null;
    
    const findings = test.result.findings;
    const referenceRanges = getReferenceRanges(test.testCategory);
    
    const abnormalParams = Object.entries(findings)
      .filter(([paramName, value]) => {
        if (value === undefined || value === null || value === '') return false;
        const range = referenceRanges[paramName] as ReferenceRange;
        if (!range) return false;
        
        const flag = getParamFlag(paramName, value);
        return flag !== 'normal';
      })
      .map(([paramName, value]) => {
        const flag = getParamFlag(paramName, value);
        const range = referenceRanges[paramName] as ReferenceRange;
        const displayValue = getDisplayValue(paramName, value);
        
        return {
          name: getReadableName(paramName),
          value: displayValue,
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

  // Check if we have result data to display
  const hasResults = test.result && Object.keys(test.result.findings).length > 0;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {test.testType} Results
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {test.completedAt ? `Completed: ${formatDate(test.completedAt)}` : 'Processing'}
          </p>
        </div>
        {showActions && onClose && (
          <button
            onClick={onClose}
            className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</h4>
            <p className="mt-1 text-sm text-gray-900">{test.patient.name}</p>
            <p className="text-sm text-gray-500">ID: {test.patient.id}</p>
            <p className="text-sm text-gray-500">
              {test.patient.gender}{test.patient.dateOfBirth ? `, ${new Date(test.patient.dateOfBirth).toLocaleDateString()}` : ''}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Test Info</h4>
            <p className="mt-1 text-sm text-gray-900">Ordered by: {test.orderedBy.name}</p>
            <p className="text-sm text-gray-500">
              Ordered: {formatDate(test.orderedAt)}
            </p>
            <p className="text-sm text-gray-500">
              Status: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                test.status === 'completed' ? 'bg-green-100 text-green-800' :
                test.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                test.status === 'collected' ? 'bg-yellow-100 text-yellow-800' :
                test.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </span>
            </p>
          </div>
        </div>

        {hasResults ? (
          <>
            {/* Results Table */}
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              {renderResultTable()}
            </div>
            
            {/* Abnormal Results Summary */}
            {renderAbnormalSummary()}
            
            {/* Interpretation */}
            {renderInterpretation()}
            
            {/* Actions */}
            {showActions && onPrint && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onPrint}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Results
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No test results available</h3>
            <p className="mt-1 text-sm text-gray-500">
              This test is {test.status} but no results have been entered yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}