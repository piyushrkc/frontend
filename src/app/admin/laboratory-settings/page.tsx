'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LaboratorySettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    laboratoryName: 'General Hospital Diagnostic Laboratory',
    licenseNumber: 'LAB-987654321',
    regAuthority: 'State Medical Laboratory Council',
    nabl: 'NABL-12345',
    gstNumber: '29AADCB2230M1ZQ',
    address: '123 Healthcare Avenue, Medical District\nBangalore, Karnataka 560001',
    contactNumber: '(123) 456-7890',
    email: 'laboratory@generalhospital.com',
    operatingHours: '8:00 AM - 7:00 PM (Mon-Sat)',
    headPathologistName: 'Dr. Robert Williams',
    pathologistLicense: 'PATH-456789',
    qualityControl: true,
    externalQualityAssurance: true,
    sampleRetentionDays: 7,
    reportRetentionYears: 3,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? Number(value) 
          : value
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real app, this would be an API call to update laboratory settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error('Error saving laboratory settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link 
              href="/admin/settings"
              className="mr-4 text-gray-600 hover:text-primary-600 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Settings
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Laboratory Settings</h1>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            Laboratory settings saved successfully!
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="laboratoryName" className="block text-sm font-medium text-gray-700">
                      Laboratory Name
                    </label>
                    <input
                      type="text"
                      id="laboratoryName"
                      name="laboratoryName"
                      value={formData.laboratoryName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                      License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Certification & Compliance */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Certification & Compliance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nabl" className="block text-sm font-medium text-gray-700">
                      NABL Accreditation Number
                    </label>
                    <input
                      type="text"
                      id="nabl"
                      name="nabl"
                      value={formData.nabl}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                      GST Number
                    </label>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="regAuthority" className="block text-sm font-medium text-gray-700">
                      Registration Authority
                    </label>
                    <input
                      type="text"
                      id="regAuthority"
                      name="regAuthority"
                      value={formData.regAuthority}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Pathologist Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Pathologist Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="headPathologistName" className="block text-sm font-medium text-gray-700">
                      Chief Pathologist Name
                    </label>
                    <input
                      type="text"
                      id="headPathologistName"
                      name="headPathologistName"
                      value={formData.headPathologistName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="pathologistLicense" className="block text-sm font-medium text-gray-700">
                      Pathologist License Number
                    </label>
                    <input
                      type="text"
                      id="pathologistLicense"
                      name="pathologistLicense"
                      value={formData.pathologistLicense}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Quality Management */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Quality Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="qualityControl"
                        name="qualityControl"
                        type="checkbox"
                        checked={formData.qualityControl}
                        onChange={handleInputChange}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="qualityControl" className="font-medium text-gray-700">
                        Internal Quality Control
                      </label>
                      <p className="text-gray-500">Enable internal quality control procedures</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="externalQualityAssurance"
                        name="externalQualityAssurance"
                        type="checkbox"
                        checked={formData.externalQualityAssurance}
                        onChange={handleInputChange}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="externalQualityAssurance" className="font-medium text-gray-700">
                        External Quality Assurance
                      </label>
                      <p className="text-gray-500">Participate in external quality assurance programs</p>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="sampleRetentionDays" className="block text-sm font-medium text-gray-700">
                      Sample Retention Period (Days)
                    </label>
                    <input
                      type="number"
                      id="sampleRetentionDays"
                      name="sampleRetentionDays"
                      min="1"
                      max="90"
                      value={formData.sampleRetentionDays}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="reportRetentionYears" className="block text-sm font-medium text-gray-700">
                      Report Retention Period (Years)
                    </label>
                    <input
                      type="number"
                      id="reportRetentionYears"
                      name="reportRetentionYears"
                      min="1"
                      max="10"
                      value={formData.reportRetentionYears}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}