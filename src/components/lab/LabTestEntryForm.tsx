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

type LabTestFormProps = {
  test: LabTest;
  onSave: (testData: any, interpretation: string) => void;
  onCancel: () => void;
};

export default function LabTestEntryForm({ test, onSave, onCancel }: LabTestFormProps) {
  const [category, setCategory] = useState<LabTestCategory | ''>('');
  const [testData, setTestData] = useState<Record<string, any>>({});
  const [interpretation, setInterpretation] = useState('');
  const [abnormalParameters, setAbnormalParameters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get reference ranges based on category
  const getReferenceRanges = (category: LabTestCategory) => {
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

  // Initialize form based on selected category or existing data
  useEffect(() => {
    if (test.testCategory) {
      setCategory(test.testCategory);
      
      // Initialize empty form data based on category
      const initialData: Record<string, any> = {};
      const referenceRanges = getReferenceRanges(test.testCategory);
      
      // Create empty fields for each parameter
      Object.keys(referenceRanges).forEach(param => {
        initialData[param] = '';
      });
      
      // If we have existing data, use that
      if (test.result?.findings) {
        setTestData({
          ...initialData,
          ...test.result.findings
        });
        setInterpretation(test.result.interpretation || '');
        setAbnormalParameters(test.result.abnormalParameters || []);
      } else {
        setTestData(initialData);
      }
    }
  }, [test]);

  // Handle test category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as LabTestCategory;
    setCategory(newCategory);
    
    // Reset form data when category changes
    const initialData: Record<string, any> = {};
    const referenceRanges = getReferenceRanges(newCategory);
    
    Object.keys(referenceRanges).forEach(param => {
      initialData[param] = '';
    });
    
    setTestData(initialData);
    setInterpretation('');
    setAbnormalParameters([]);
  };

  // Handle form input changes
  const handleInputChange = (paramName: string, value: string) => {
    const parsedValue = value === '' ? '' : parseFloat(value);
    
    setTestData(prev => ({
      ...prev,
      [paramName]: parsedValue
    }));
    
    // Validate and update abnormal parameters
    if (category && parsedValue !== '') {
      const referenceRanges = getReferenceRanges(category);
      const range = referenceRanges[paramName] as ReferenceRange;
      
      if (range) {
        const flag = evaluateLabValue(parsedValue, range, test.patient.gender);
        
        if (flag !== 'normal') {
          if (!abnormalParameters.includes(paramName)) {
            setAbnormalParameters(prev => [...prev, paramName]);
          }
        } else {
          setAbnormalParameters(prev => prev.filter(p => p !== paramName));
        }
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Filter out empty fields
    const filteredData = Object.entries(testData).reduce((acc, [key, value]) => {
      if (value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Process the data
    setTimeout(() => {
      onSave(filteredData, interpretation);
      setIsLoading(false);
    }, 1000);
  };

  // Get parameter flag
  const getParamFlag = (paramName: string, value: any): LabResultFlag => {
    if (value === '' || value === null || value === undefined || category === '') {
      return 'normal';
    }
    
    const referenceRanges = getReferenceRanges(category);
    const range = referenceRanges[paramName] as ReferenceRange;
    
    if (!range) {
      return 'normal';
    }
    
    return evaluateLabValue(parseFloat(value), range, test.patient.gender);
  };

  // Get display value
  const getDisplayValue = (paramName: string, value: any): string => {
    if (value === '' || value === null || value === undefined || category === '') {
      return '';
    }
    
    const referenceRanges = getReferenceRanges(category);
    const range = referenceRanges[paramName] as ReferenceRange;
    
    if (!range) {
      return value.toString();
    }
    
    return getFormattedValue(parseFloat(value), range.unit);
  };

  // Get reference range display text based on gender
  const getReferenceRangeText = (range: ReferenceRange): string => {
    if (test.patient.gender === 'Male' && range.male) {
      return `${range.male.min} - ${range.male.max} ${range.unit}`;
    } else if (test.patient.gender === 'Female' && range.female) {
      return `${range.female.min} - ${range.female.max} ${range.unit}`;
    } else if (range.common) {
      return `${range.common.min} - ${range.common.max} ${range.unit}`;
    }
    return `No reference range available`;
  };

  // Render field label with description tooltip
  const renderFieldLabel = (paramName: string, range: ReferenceRange) => {
    return (
      <div className="group relative">
        <label htmlFor={paramName} className="block text-sm font-medium text-gray-700 cursor-help">
          {paramName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          {range.description && (
            <span className="ml-1 text-xs text-blue-500">ⓘ</span>
          )}
        </label>
        {range.description && (
          <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white p-2 rounded shadow-lg text-xs max-w-xs mt-1">
            {range.description}
          </div>
        )}
      </div>
    );
  };

  // Render category form fields
  const renderCategoryFields = () => {
    if (!category) return null;
    
    const referenceRanges = getReferenceRanges(category);
    
    return Object.entries(referenceRanges).map(([paramName, range]) => {
      const value = testData[paramName];
      const flag = getParamFlag(paramName, value);
      const fieldId = `${category.toLowerCase()}-${paramName}`;
      
      return (
        <div key={fieldId} className="sm:col-span-1">
          {renderFieldLabel(paramName, range as ReferenceRange)}
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              step="any"
              id={fieldId}
              name={paramName}
              value={value}
              onChange={(e) => handleInputChange(paramName, e.target.value)}
              className={`block w-full pr-12 sm:text-sm rounded-md ${
                flag !== 'normal' 
                  ? 'border-amber-300 focus:ring-amber-500 focus:border-amber-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } ${getFlagColorClass(flag)}`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">
                {(range as ReferenceRange).unit}
              </span>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Range: {getReferenceRangeText(range as ReferenceRange)}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {test.testType} - Lab Result Entry
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Patient: {test.patient.name} ({test.patient.gender}, ID: {test.patient.id})
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
        {/* Test Category Selection */}
        <div className="mb-6">
          <label htmlFor="test-category" className="block text-sm font-medium text-gray-700 mb-1">
            Test Category
          </label>
          <select
            id="test-category"
            name="test-category"
            value={category}
            onChange={handleCategoryChange}
            disabled={!!test.testCategory}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Test Category</option>
            <option value="CBC">Complete Blood Count (CBC)</option>
            <option value="LFT">Liver Function Test (LFT)</option>
            <option value="KFT">Kidney Function Test (KFT)</option>
            <option value="LIPID">Lipid Profile</option>
            <option value="THYROID">Thyroid Function Test</option>
            <option value="DIABETES">Diabetes Tests</option>
            <option value="CARDIAC">Cardiac Tests</option>
            <option value="ELECTROLYTES">Electrolytes & Minerals</option>
            <option value="IRON">Iron Studies</option>
            <option value="COAGULATION">Coagulation Studies</option>
            <option value="OTHER">Other Tests</option>
          </select>
        </div>

        {/* Test Parameters */}
        {category && (
          <>
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Test Parameters</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {renderCategoryFields()}
              </div>
            </div>

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

            {/* Abnormal Parameters Summary */}
            {abnormalParameters.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Abnormal Parameters</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <ul className="list-disc pl-5 space-y-1">
                    {abnormalParameters.map(param => {
                      const paramValue = testData[param];
                      const referenceRanges = getReferenceRanges(category);
                      const range = referenceRanges[param] as ReferenceRange;
                      const flag = getParamFlag(param, paramValue);
                      
                      return (
                        <li key={param} className={`text-sm ${getFlagColorClass(flag)}`}>
                          {param.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {getDisplayValue(param, paramValue)} {range.unit}
                          <span className="text-gray-500"> (Reference: {getReferenceRangeText(range)})</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-6 flex justify-end space-x-3">
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
          </>
        )}
      </form>
    </div>
  );
}