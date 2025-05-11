'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Hospital, DoctorDetails, getHospitalDetails, updateHospitalDetails, updateDoctorDetails } from '@/services/hospitalService';
import { useAuth } from '@/context/AuthContext';

interface TimeSlot {
  start: string;
  end: string;
}

interface BillingSettings {
  consultationFees: {
    standard: number;
    followUp: number;
    specialist: number;
    emergency: number;
  };
  gstNumber: string;
  gstPercentage: number;
  currency: string;
  paymentMethods: string[];
  invoicePrefix: string;
  termsAndConditions: string;
}

interface ClinicSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'clinicDetails' | 'workingHours' | 'billingSettings' | 'doctorDetails';
}

const ClinicSettingsModal = ({ isOpen, onClose, initialTab = 'clinicDetails' }: ClinicSettingsModalProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Hospital/Clinic State
  const [hospital, setHospital] = useState<Partial<Hospital>>({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    settings: {
      workingHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: { start: '09:00', end: '13:00' },
        sunday: { start: '', end: '' }
      },
      appointmentDuration: 30
    }
  });

  // Billing Settings State
  const [billingSettings, setBillingSettings] = useState<BillingSettings>({
    consultationFees: {
      standard: 500,
      followUp: 300,
      specialist: 1000,
      emergency: 1500
    },
    gstNumber: '29AADCB2230M1ZP',
    gstPercentage: 18,
    currency: '₹',
    paymentMethods: ['Cash'],
    invoicePrefix: 'INV',
    termsAndConditions: '1. Payment is due at the time of service.\n2. Reports will be available within 24 hours of testing.\n3. Prescription refills require 48 hours notice.\n4. Missed appointments without 24 hours notice may be charged.'
  });
  
  // Doctor Details State
  const [doctors, setDoctors] = useState<Partial<DoctorDetails>[]>([{
    id: '1',
    firstName: '',
    lastName: '',
    qualification: '',
    specialization: '',
    licenseNumber: '',
    useClinicGST: true
  }]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('1');
  
  useEffect(() => {
    if (isOpen) {
      fetchHospitalDetails();
    }
  }, [isOpen]);
  
  const fetchHospitalDetails = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would fetch from the API
      // const hospitalData = await getHospitalDetails();
      // setHospital(hospitalData);
      
      // For demo, use mock data
      setTimeout(() => {
        setHospital({
          name: 'City General Hospital',
          address: {
            street: '123 Healthcare Avenue',
            city: 'Medical District',
            state: 'MD',
            zipCode: '12345',
            country: 'USA'
          },
          contactInfo: {
            email: 'care@cityhospital.com',
            phone: '(123) 456-7890',
            website: 'www.cityhospital.com'
          },
          settings: {
            workingHours: {
              monday: { start: '09:00', end: '17:00' },
              tuesday: { start: '09:00', end: '17:00' },
              wednesday: { start: '09:00', end: '17:00' },
              thursday: { start: '09:00', end: '17:00' },
              friday: { start: '09:00', end: '17:00' },
              saturday: { start: '09:00', end: '13:00' },
              sunday: { start: '', end: '' }
            },
            appointmentDuration: 30
          }
        });
        
        // Initialize with demo doctor data
        setDoctors([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            qualification: 'MD, MBBS',
            specialization: 'General Medicine',
            licenseNumber: 'MED123456',
            useClinicGST: true
          },
          {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Johnson',
            qualification: 'MD, Pediatrics',
            specialization: 'Pediatrician',
            licenseNumber: 'MED789012',
            useClinicGST: true
          }
        ]);
        setSelectedDoctor('1');
        
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching hospital details:', err);
      setError('Failed to load clinic details. Please try again.');
      setLoading(false);
    }
  };
  
  const handleClinicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setHospital(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof Hospital],
          [field]: value
        }
      }));
    } else {
      setHospital(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleWorkingHoursChange = (day: string, field: 'start' | 'end', value: string) => {
    setHospital(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        workingHours: {
          ...prev.settings?.workingHours,
          [day]: {
            ...prev.settings?.workingHours?.[day as keyof typeof prev.settings.workingHours],
            [field]: value
          }
        }
      }
    }));
  };
  
  const handleDoctorDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setDoctors(prev => {
      return prev.map(doctor => {
        if (doctor.id === selectedDoctor) {
          return {
            ...doctor,
            [name]: type === 'checkbox' ? checked : value
          };
        }
        return doctor;
      });
    });
  };

  const addNewDoctor = () => {
    const newId = `doctor-${Date.now()}`;
    setDoctors(prev => [...prev, {
      id: newId,
      firstName: '',
      lastName: '',
      qualification: '',
      specialization: '',
      licenseNumber: '',
      useClinicGST: true
    }]);
    setSelectedDoctor(newId);
  };

  const removeDoctor = (id: string) => {
    if (doctors.length <= 1) return; // Don't remove the last doctor

    setDoctors(prev => prev.filter(doctor => doctor.id !== id));
    // Select the first doctor in the list if we're removing the currently selected one
    if (id === selectedDoctor) {
      setSelectedDoctor(doctors.filter(doctor => doctor.id !== id)[0].id || '');
    }
  };
  
  const saveClinicDetails = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // In a real app, this would call the API
      // await updateHospitalDetails(hospital);
      
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving clinic details:', err);
      setError('Failed to save clinic details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const saveDoctorDetails = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // In a real app, this would call the API to save all doctors
      // const promises = doctors.map(doctor => updateDoctorDetails(doctor.id, doctor));
      // await Promise.all(promises);

      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving doctor details:', err);
      setError('Failed to save doctor details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const saveBillingSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // In a real app, this would call the API
      // await updateBillingSettings(billingSettings);

      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving billing settings:', err);
      setError('Failed to save billing settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = () => {
    if (activeTab === 'clinicDetails') {
      saveClinicDetails();
    } else if (activeTab === 'workingHours') {
      saveClinicDetails(); // We use the same save function for working hours
    } else if (activeTab === 'billingSettings') {
      saveBillingSettings();
    } else if (activeTab === 'doctorDetails') {
      saveDoctorDetails();
    }
  };
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-gray-900 mb-4"
                >
                  Clinic Settings
                </Dialog.Title>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
                    Settings saved successfully!
                  </div>
                )}
                
                <div className="border-b border-gray-200 mb-4">
                  <nav className="-mb-px flex" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab('clinicDetails')}
                      className={`${
                        activeTab === 'clinicDetails'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
                    >
                      Clinic Details
                    </button>
                    <button
                      onClick={() => setActiveTab('workingHours')}
                      className={`${
                        activeTab === 'workingHours'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
                    >
                      Working Hours
                    </button>
                    <button
                      onClick={() => setActiveTab('billingSettings')}
                      className={`${
                        activeTab === 'billingSettings'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm mr-8`}
                    >
                      Billing
                    </button>
                    {user?.role === 'doctor' && (
                      <button
                        onClick={() => setActiveTab('doctorDetails')}
                        className={`${
                          activeTab === 'doctorDetails'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      >
                        Doctor Details
                      </button>
                    )}
                  </nav>
                </div>
                
                <div className="mt-4">
                  {/* Clinic Details Tab */}
                  {activeTab === 'clinicDetails' && (
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Clinic Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={hospital.name}
                          onChange={handleClinicInfoChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            id="address.street"
                            name="address.street"
                            value={hospital.address?.street}
                            onChange={handleClinicInfoChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            id="address.city"
                            name="address.city"
                            value={hospital.address?.city}
                            onChange={handleClinicInfoChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                            State/Province
                          </label>
                          <input
                            type="text"
                            id="address.state"
                            name="address.state"
                            value={hospital.address?.state}
                            onChange={handleClinicInfoChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            Postal/Zip Code
                          </label>
                          <input
                            type="text"
                            id="address.zipCode"
                            name="address.zipCode"
                            value={hospital.address?.zipCode}
                            onChange={handleClinicInfoChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            id="address.country"
                            name="address.country"
                            value={hospital.address?.country}
                            onChange={handleClinicInfoChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            id="contactInfo.phone"
                            name="contactInfo.phone"
                            value={hospital.contactInfo?.phone}
                            onChange={handleClinicInfoChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="contactInfo.email"
                            name="contactInfo.email"
                            value={hospital.contactInfo?.email}
                            onChange={handleClinicInfoChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="contactInfo.website" className="block text-sm font-medium text-gray-700 mb-1">
                            Website
                          </label>
                          <input
                            type="text"
                            id="contactInfo.website"
                            name="contactInfo.website"
                            value={hospital.contactInfo?.website}
                            onChange={handleClinicInfoChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Working Hours Tab */}
                  {activeTab === 'workingHours' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-medium text-gray-900">Clinic Hours</h4>
                        <div>
                          <label htmlFor="appointmentDuration" className="inline-block text-sm font-medium text-gray-700 mr-2">
                            Appointment Duration (min):
                          </label>
                          <input
                            type="number"
                            id="appointmentDuration"
                            name="appointmentDuration"
                            value={hospital.settings?.appointmentDuration || 30}
                            onChange={(e) => setHospital(prev => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                appointmentDuration: parseInt(e.target.value)
                              }
                            }))}
                            min="10"
                            max="120"
                            step="5"
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-3">
                          {days.map((day) => (
                            <div key={day} className="grid grid-cols-3 gap-4 items-center">
                              <div className="text-sm font-medium capitalize">{day}</div>
                              <div>
                                <input
                                  type="time"
                                  value={hospital.settings?.workingHours?.[day as keyof typeof hospital.settings.workingHours]?.start || ''}
                                  onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                                />
                              </div>
                              <div>
                                <input
                                  type="time"
                                  value={hospital.settings?.workingHours?.[day as keyof typeof hospital.settings.workingHours]?.end || ''}
                                  onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Billing Settings Tab */}
                  {activeTab === 'billingSettings' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-medium text-gray-900">Billing Information (For Invoice Generation)</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            GST Number
                          </label>
                          <input
                            type="text"
                            id="gstNumber"
                            name="gstNumber"
                            value={billingSettings.gstNumber}
                            onChange={(e) => setBillingSettings({...billingSettings, gstNumber: e.target.value})}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="gstPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                            GST Percentage
                          </label>
                          <div className="flex">
                            <input
                              type="number"
                              id="gstPercentage"
                              name="gstPercentage"
                              value={billingSettings.gstPercentage}
                              onChange={(e) => setBillingSettings({...billingSettings, gstPercentage: Number(e.target.value)})}
                              min="0"
                              max="28"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                            />
                            <span className="ml-2 flex items-center">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                            Currency Symbol
                          </label>
                          <input
                            type="text"
                            id="currency"
                            name="currency"
                            value={billingSettings.currency}
                            onChange={(e) => setBillingSettings({...billingSettings, currency: e.target.value})}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                        <div>
                          <label htmlFor="invoicePrefix" className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Prefix
                          </label>
                          <input
                            type="text"
                            id="invoicePrefix"
                            name="invoicePrefix"
                            value={billingSettings.invoicePrefix}
                            onChange={(e) => setBillingSettings({...billingSettings, invoicePrefix: e.target.value})}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Consultation Fees
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="standardFee" className="block text-sm text-gray-700 mb-1">
                              Standard Consultation
                            </label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-md border border-r-0 border-gray-300">
                                {billingSettings.currency}
                              </span>
                              <input
                                type="number"
                                id="standardFee"
                                name="standardFee"
                                value={billingSettings.consultationFees.standard}
                                onChange={(e) => setBillingSettings({
                                  ...billingSettings,
                                  consultationFees: {
                                    ...billingSettings.consultationFees,
                                    standard: Number(e.target.value)
                                  }
                                })}
                                min="0"
                                className="block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="followUpFee" className="block text-sm text-gray-700 mb-1">
                              Follow-Up Consultation
                            </label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-md border border-r-0 border-gray-300">
                                {billingSettings.currency}
                              </span>
                              <input
                                type="number"
                                id="followUpFee"
                                name="followUpFee"
                                value={billingSettings.consultationFees.followUp}
                                onChange={(e) => setBillingSettings({
                                  ...billingSettings,
                                  consultationFees: {
                                    ...billingSettings.consultationFees,
                                    followUp: Number(e.target.value)
                                  }
                                })}
                                min="0"
                                className="block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label htmlFor="specialistFee" className="block text-sm text-gray-700 mb-1">
                              Specialist Consultation
                            </label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-md border border-r-0 border-gray-300">
                                {billingSettings.currency}
                              </span>
                              <input
                                type="number"
                                id="specialistFee"
                                name="specialistFee"
                                value={billingSettings.consultationFees.specialist}
                                onChange={(e) => setBillingSettings({
                                  ...billingSettings,
                                  consultationFees: {
                                    ...billingSettings.consultationFees,
                                    specialist: Number(e.target.value)
                                  }
                                })}
                                min="0"
                                className="block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="emergencyFee" className="block text-sm text-gray-700 mb-1">
                              Emergency Consultation
                            </label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-md border border-r-0 border-gray-300">
                                {billingSettings.currency}
                              </span>
                              <input
                                type="number"
                                id="emergencyFee"
                                name="emergencyFee"
                                value={billingSettings.consultationFees.emergency}
                                onChange={(e) => setBillingSettings({
                                  ...billingSettings,
                                  consultationFees: {
                                    ...billingSettings.consultationFees,
                                    emergency: Number(e.target.value)
                                  }
                                })}
                                min="0"
                                className="block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="termsAndConditions" className="block text-sm font-medium text-gray-700 mb-1">
                          Terms and Conditions (Will appear on invoices)
                        </label>
                        <textarea
                          id="termsAndConditions"
                          name="termsAndConditions"
                          rows={4}
                          value={billingSettings.termsAndConditions}
                          onChange={(e) => setBillingSettings({...billingSettings, termsAndConditions: e.target.value})}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                        />
                      </div>
                    </div>
                  )}

                  {/* Doctor Details Tab */}
                  {activeTab === 'doctorDetails' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-medium text-gray-900">Doctor Information (Shown on Prescriptions)</h4>
                        <button
                          type="button"
                          onClick={addNewDoctor}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Add Doctor
                        </button>
                      </div>

                      {/* Doctor selector */}
                      {doctors.length > 1 && (
                        <div className="bg-gray-50 p-3 rounded-md mb-6">
                          <label htmlFor="doctorSelector" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Doctor to Edit
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {doctors.map(doctor => (
                              <button
                                key={doctor.id}
                                type="button"
                                onClick={() => setSelectedDoctor(doctor.id || '')}
                                className={`${
                                  selectedDoctor === doctor.id
                                    ? 'bg-primary-100 border-primary-500 text-primary-700'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                } inline-flex items-center px-3 py-1.5 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                              >
                                {doctor.firstName} {doctor.lastName || '(New Doctor)'}
                                {doctors.length > 1 && doctor.id === selectedDoctor && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeDoctor(doctor.id || '');
                                    }}
                                    className="ml-1.5 text-gray-400 hover:text-red-500"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {doctors.filter(d => d.id === selectedDoctor).map(doctor => (
                        <div key={doctor.id} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                              </label>
                              <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={doctor.firstName || ''}
                                onChange={handleDoctorDetailsChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                              />
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                              </label>
                              <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={doctor.lastName || ''}
                                onChange={handleDoctorDetailsChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                                Qualifications (MD, MBBS, etc.)
                              </label>
                              <input
                                type="text"
                                id="qualification"
                                name="qualification"
                                value={doctor.qualification || ''}
                                onChange={handleDoctorDetailsChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                              />
                            </div>
                            <div>
                              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                                Specialization
                              </label>
                              <input
                                type="text"
                                id="specialization"
                                name="specialization"
                                value={doctor.specialization || ''}
                                onChange={handleDoctorDetailsChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              License Number
                            </label>
                            <input
                              type="text"
                              id="licenseNumber"
                              name="licenseNumber"
                              value={doctor.licenseNumber || ''}
                              onChange={handleDoctorDetailsChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                            />
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md mt-4">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="useClinicGST"
                                  name="useClinicGST"
                                  type="checkbox"
                                  checked={doctor.useClinicGST}
                                  onChange={handleDoctorDetailsChange}
                                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="useClinicGST" className="font-medium text-gray-700">
                                  Use clinic's GST number
                                </label>
                                <p className="text-gray-500">If checked, the clinic's GST number will be used for this doctor's invoices.</p>
                              </div>
                            </div>

                            {!doctor.useClinicGST && (
                              <div className="mt-4">
                                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                  Doctor's GST Number
                                </label>
                                <input
                                  type="text"
                                  id="gstNumber"
                                  name="gstNumber"
                                  value={doctor.gstNumber || ''}
                                  onChange={handleDoctorDetailsChange}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                                  placeholder="Enter doctor's GST number"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                    onClick={saveSettings}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ClinicSettingsModal;