import React from 'react';
import { prescriptionTemplates } from '@/services/drugDatabaseUtils';

interface PrescriptionTemplate {
  id: string;
  name: string;
  medications: {
    medication: any; // Using any type for simplicity, should use proper Medication type
    dosage: string;
    frequency: string;
    duration: string;
  }[];
}

interface PrescriptionTemplateSelectorProps {
  onSelectTemplate: (template: PrescriptionTemplate) => void;
}

export default function PrescriptionTemplateSelector({ 
  onSelectTemplate 
}: PrescriptionTemplateSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Apply Prescription Template
      </label>
      <div className="flex flex-wrap gap-2">
        {prescriptionTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelectTemplate(template)}
            className="inline-flex items-center px-3 py-1.5 border border-indigo-200 rounded-md shadow-sm text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none"
          >
            <svg 
              className="-ml-0.5 mr-1.5 h-3 w-3 text-indigo-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
}