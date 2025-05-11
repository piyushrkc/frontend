import React, { useState } from 'react';

type Treatment = {
  name: string;
  medications: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  instructions?: string;
};

type TreatmentTemplateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Treatment) => void;
  initialTemplate?: Treatment;
};

export default function TreatmentTemplateModal({
  isOpen,
  onClose,
  onSave,
  initialTemplate
}: TreatmentTemplateModalProps) {
  const [template, setTemplate] = useState<Treatment>(
    initialTemplate || {
      name: '',
      medications: [{ medication: '', dosage: '', frequency: '', duration: '' }],
      instructions: ''
    }
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate({ ...template, name: e.target.value });
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate({ ...template, instructions: e.target.value });
  };

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...template.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    setTemplate({ ...template, medications: updatedMedications });
  };

  const handleAddMedication = () => {
    setTemplate({
      ...template,
      medications: [
        ...template.medications,
        { medication: '', dosage: '', frequency: '', duration: '' }
      ]
    });
  };

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...template.medications];
    updatedMedications.splice(index, 1);
    setTemplate({ ...template, medications: updatedMedications });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(template);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {initialTemplate ? 'Edit Treatment Template' : 'Create New Treatment Template'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-1">
              Template Name *
            </label>
            <input
              type="text"
              id="template-name"
              value={template.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Hypertension Treatment"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medications *
            </label>
            
            {template.medications.map((medication, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg mb-3">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Medication #{index + 1}</h4>
                  {template.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Medication Name
                    </label>
                    <input
                      type="text"
                      value={medication.medication}
                      onChange={(e) => handleMedicationChange(index, 'medication', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Lisinopril"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={medication.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 10mg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={medication.frequency}
                      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Once daily"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={medication.duration}
                      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 30 days"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddMedication}
              className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Medication
            </button>
          </div>

          <div className="mb-6">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Instructions
            </label>
            <textarea
              id="instructions"
              value={template.instructions}
              onChange={handleInstructionsChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional instructions or notes for this treatment template"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}