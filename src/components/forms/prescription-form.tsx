// src/components/forms/prescription-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

// Define the medication item schema
const medicationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Medication name is required' }),
  dosage: z.string().min(1, { message: 'Dosage is required' }),
  frequency: z.string().min(1, { message: 'Frequency is required' }),
  duration: z.string().min(1, { message: 'Duration is required' }),
  instructions: z.string().optional(),
});

// Define the prescription schema
const prescriptionSchema = z.object({
  patientId: z.string().min(1, { message: 'Patient ID is required' }),
  diagnosis: z.string().min(1, { message: 'Diagnosis is required' }),
  allergies: z.string().optional(),
  medications: z.array(medicationSchema).min(1, { message: 'At least one medication is required' }),
  instructions: z.string().optional(),
  followUpDate: z.string().optional(),
  labTests: z.string().optional(),
});

type Medication = z.infer<typeof medicationSchema>;
type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

interface PrescriptionFormProps {
  patientId?: string;
  prescriptionId?: string;
  isEdit?: boolean;
}

const PrescriptionForm = ({ patientId, prescriptionId, isEdit = false }: PrescriptionFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicationSuggestions, setMedicationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize the form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: patientId || '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    },
  });
  
  // Setup field array for medications
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });
  
  // Fetch patient data if patientId is provided
  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        try {
          // In a real app, this would be an API call
          // const response = await api.get(`/patients/${patientId}`);
          // setPatient(response.data);
          
          // For demo purposes, using mock data
          setTimeout(() => {
            setPatient({
              id: patientId,
              firstName: 'John',
              lastName: 'Smith',
              dateOfBirth: '1980-05-15',
              gender: 'male',
            });
          }, 500);
        } catch (err) {
          console.error('Error fetching patient:', err);
          setError('Failed to load patient information. Please try again later.');
        }
      };
      
      fetchPatient();
      setValue('patientId', patientId);
    }
  }, [patientId, setValue]);
  
  // Fetch prescription data if in edit mode
  useEffect(() => {
    if (isEdit && prescriptionId) {
      const fetchPrescription = async () => {
        try {
          // In a real app, this would be an API call
          // const response = await api.get(`/prescriptions/${prescriptionId}`);
          // const prescription = response.data;
          
          // For demo purposes, using mock data
          setTimeout(() => {
            const mockPrescription = {
              patientId: patientId || 'p123',
              diagnosis: 'Acute Bronchitis',
              allergies: 'Penicillin',
              medications: [
                {
                  id: 'm1',
                  name: 'Amoxicillin',
                  dosage: '500mg',
                  frequency: 'Three times a day',
                  duration: '7 days',
                  instructions: 'Take with food',
                },
                {
                  id: 'm2',
                  name: 'Paracetamol',
                  dosage: '650mg',
                  frequency: 'As needed for fever, maximum 4 times a day',
                  duration: '5 days',
                  instructions: '',
                },
              ],
              instructions: 'Drink plenty of fluids and rest',
              followUpDate: '2025-05-05',
              labTests: 'Complete Blood Count, Chest X-ray',
            };
            
            // Set form values
            Object.entries(mockPrescription).forEach(([key, value]) => {
                if (key !== 'medications') {
                  setValue(key as keyof PrescriptionFormValues, value as PrescriptionFormValues[keyof PrescriptionFormValues]);
                }
              });
            
            // Set medications separately
            setValue('medications', mockPrescription.medications);
          }, 500);
        } catch (err) {
          console.error('Error fetching prescription:', err);
          setError('Failed to load prescription data. Please try again later.');
        }
      };
      
      fetchPrescription();
    }
  }, [isEdit, prescriptionId, setValue, patientId]);
  
  // Function to search medications
  const searchMedications = (query: string) => {
    if (query.length < 2) {
      setMedicationSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // In a real app, this would be an API call
    // const fetchMedications = async () => {
    //   const response = await api.get(`/medications/search?query=${query}`);
    //   setMedicationSuggestions(response.data);
    // };
    
    // For demo purposes, using mock data
    const mockMedications = [
      'Amoxicillin', 'Azithromycin', 'Acetaminophen', 'Aspirin',
      'Atorvastatin', 'Amlodipine', 'Albuterol',
      'Benazepril', 'Budesonide', 'Bupropion',
      'Ciprofloxacin', 'Citalopram', 'Carvedilol',
      'Diazepam', 'Doxycycline', 'Duloxetine',
    ];
    
    const filteredMedications = mockMedications.filter(med => 
      med.toLowerCase().includes(query.toLowerCase())
    );
    
    setMedicationSuggestions(filteredMedications);
    setShowSuggestions(true);
  };
  
  const handleMedicationSearch = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchMedications(value);
  };
  
  const selectMedication = (medication: string, index: number) => {
    setValue(`medications.${index}.name`, medication);
    setShowSuggestions(false);
  };
  
  const addMedication = () => {
    append({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });
  };
  
  const onSubmit = async (data: PrescriptionFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format data for API
      const prescriptionData = {
        ...data,
        doctorId: 'currentDoctorId', // In real app, this would come from auth context
        hospitalId: 'currentHospitalId', // In real app, this would come from context
        issuedDate: new Date().toISOString(),
        status: 'active',
      };
      
      if (isEdit && prescriptionId) {
        // Update existing prescription
        // In a real app, this would be an API call
        // await api.put(`/prescriptions/${prescriptionId}`, prescriptionData);
      } else {
        // Create new prescription
        // In a real app, this would be an API call
        // await api.post('/prescriptions', prescriptionData);
      }
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to prescriptions list
      router.push('/doctor/prescriptions');
    } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'An error occurred while saving the prescription. Please try again.');
        } else {
          setError('An unknown error occurred while saving the prescription. Please try again.');
        }
      } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Form Header */}
      <div className="bg-primary-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">
          {isEdit ? 'Edit Prescription' : 'Create New Prescription'}
        </h2>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        {/* Patient Information */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Information</h3>
          
          {patient ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{patient.firstName} {patient.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient ID</p>
                <p className="font-medium">{patient.id}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading patient information...</p>
          )}
          
          <input type="hidden" {...register('patientId')} />
        </div>
        
        {/* Diagnosis and Allergies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis*
            </label>
            <input
              id="diagnosis"
              type="text"
              {...register('diagnosis')}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                errors.diagnosis ? 'border-red-300' : ''
              }`}
            />
            {errors.diagnosis && (
              <p className="mt-1 text-sm text-red-600">{errors.diagnosis.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
              Allergies
            </label>
            <input
              id="allergies"
              type="text"
              {...register('allergies')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
            />
          </div>
        </div>
        
        {/* Medications */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Medications*</h3>
            <Button
              type="button"
              size="sm"
              onClick={addMedication}
            >
              + Add Medication
            </Button>
          </div>
          
          {errors.medications?.message && (
            <p className="mt-1 text-sm text-red-600 mb-2">{errors.medications.message}</p>
          )}
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 p-4 rounded-md relative">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <label htmlFor={`medication-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Medication Name*
                    </label>
                    <input
                      id={`medication-name-${index}`}
                      type="text"
                      {...register(`medications.${index}.name`)}
                      onChange={(e) => handleMedicationSearch(e, index)}
                      placeholder="Search medication..."
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                        errors.medications?.[index]?.name ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.medications?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.medications[index]?.name?.message}
                      </p>
                    )}
                    
                    {/* Medication suggestions dropdown */}
                    {showSuggestions && searchTerm && medicationSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base">
                        <ul className="max-h-60 overflow-auto">
                          {medicationSuggestions.map((medication, i) => (
                            <li
                              key={i}
                              onClick={() => selectMedication(medication, index)}
                              className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                            >
                              {medication}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor={`medication-dosage-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage*
                    </label>
                    <input
                      id={`medication-dosage-${index}`}
                      type="text"
                      {...register(`medications.${index}.dosage`)}
                      placeholder="e.g., 500mg"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                        errors.medications?.[index]?.dosage ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.medications?.[index]?.dosage && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.medications[index]?.dosage?.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor={`medication-frequency-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency*
                    </label>
                    <input
                      id={`medication-frequency-${index}`}
                      type="text"
                      {...register(`medications.${index}.frequency`)}
                      placeholder="e.g., Twice daily"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                        errors.medications?.[index]?.frequency ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.medications?.[index]?.frequency && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.medications[index]?.frequency?.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor={`medication-duration-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Duration*
                    </label>
                    <input
                      id={`medication-duration-${index}`}
                      type="text"
                      {...register(`medications.${index}.duration`)}
                      placeholder="e.g., 7 days"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                        errors.medications?.[index]?.duration ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.medications?.[index]?.duration && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.medications[index]?.duration?.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor={`medication-instructions-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <input
                    id={`medication-instructions-${index}`}
                    type="text"
                    {...register(`medications.${index}.instructions`)}
                    placeholder="e.g., Take with food"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Instructions */}
        <div className="mb-6">
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Instructions
          </label>
          <textarea
            id="instructions"
            rows={3}
            {...register('instructions')}
            placeholder="Any additional advice or instructions for the patient..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
          ></textarea>
        </div>
        
        {/* Follow-up and Lab Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Date
            </label>
            <input
              id="followUpDate"
              type="date"
              {...register('followUpDate')}
              min={new Date().toISOString().split('T')[0]}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
            />
          </div>
          
          <div>
            <label htmlFor="labTests" className="block text-sm font-medium text-gray-700 mb-1">
              Recommended Lab Tests
            </label>
            <input
              id="labTests"
              type="text"
              {...register('labTests')}
              placeholder="e.g., Blood test, X-ray"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEdit ? 'Update Prescription' : 'Save & Generate Prescription'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;