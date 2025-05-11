// src/components/forms/appointment-booking-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

// Define the form schema with Zod
const appointmentSchema = z.object({
  appointmentType: z.string().min(1, { message: 'Please select an appointment type' }),
  departmentId: z.string().min(1, { message: 'Please select a department' }),
  doctorId: z.string().min(1, { message: 'Please select a doctor' }),
  appointmentDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Please select a valid date',
  }),
  appointmentTime: z.string().min(1, { message: 'Please select an appointment time' }),
  reasonForVisit: z.string().min(5, { message: 'Please provide a reason for your visit (min 5 characters)' })
    .max(500, { message: 'Reason for visit is too long (max 500 characters)' }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface Department {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface AppointmentBookingFormProps {
  hospitalId: string;
}

const AppointmentBookingForm = ({ hospitalId }: AppointmentBookingFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for dynamic form options
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState({
    departments: false,
    doctors: false,
    timeSlots: false,
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    mode: 'onChange',
  });
  
  // Watch for dependent field changes
  const watchDepartmentId = watch('departmentId');
  const watchDoctorId = watch('doctorId');
  const watchAppointmentDate = watch('appointmentDate');
  
  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(prev => ({ ...prev, departments: true }));
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/departments?hospitalId=${hospitalId}`);
        // setDepartments(response.data);
        
        // For demo purposes, using mock data
        setTimeout(() => {
          setDepartments([
            { id: 'd1', name: 'Internal Medicine' },
            { id: 'd2', name: 'Cardiology' },
            { id: 'd3', name: 'Pediatrics' },
            { id: 'd4', name: 'Orthopedics' },
            { id: 'd5', name: 'Dermatology' },
          ]);
          setLoading(prev => ({ ...prev, departments: false }));
        }, 500);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments. Please try again later.');
        setLoading(prev => ({ ...prev, departments: false }));
      }
    };
    
    fetchDepartments();
  }, [hospitalId]);
  
  // Fetch doctors when department changes
  useEffect(() => {
    if (!watchDepartmentId) return;
    
    const fetchDoctors = async () => {
      setLoading(prev => ({ ...prev, doctors: true }));
      setValue('doctorId', ''); // Reset doctor selection
      setValue('appointmentTime', ''); // Reset time selection
      
      try {
        // In a real app, this would be an API call
        // const response = await api.get(`/doctors?departmentId=${watchDepartmentId}&hospitalId=${hospitalId}`);
        // setDoctors(response.data);
        
        // For demo purposes, using mock data
        setTimeout(() => {
          // Different doctors based on department
          if (watchDepartmentId === 'd1') {
            setDoctors([
              { id: 'doc1', firstName: 'Sarah', lastName: 'Johnson', specialization: 'Internal Medicine' },
              { id: 'doc2', firstName: 'Robert', lastName: 'Smith', specialization: 'General Physician' },
            ]);
          } else if (watchDepartmentId === 'd2') {
            setDoctors([
              { id: 'doc3', firstName: 'James', lastName: 'Wilson', specialization: 'Cardiologist' },
              { id: 'doc4', firstName: 'Emily', lastName: 'Brown', specialization: 'Cardiologist' },
            ]);
          } else {
            setDoctors([
              { id: 'doc5', firstName: 'David', lastName: 'Miller', specialization: 'Specialist' },
            ]);
          }
          setLoading(prev => ({ ...prev, doctors: false }));
        }, 500);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    };
    
    fetchDoctors();
  }, [watchDepartmentId, hospitalId, setValue]);
  
  // Fetch time slots when doctor and date change
  useEffect(() => {
    if (!watchDoctorId || !watchAppointmentDate) return;
    
    const fetchTimeSlots = async () => {
      setLoading(prev => ({ ...prev, timeSlots: true }));
      setValue('appointmentTime', ''); // Reset time selection
      
      try {
        // In a real app, this would be an API call
        // const response = await api.get(
        //   `/timeslots?doctorId=${watchDoctorId}&date=${watchAppointmentDate}&hospitalId=${hospitalId}`
        // );
        // setTimeSlots(response.data);
        
        // For demo purposes, using mock data
        setTimeout(() => {
          setTimeSlots([
            { id: 't1', time: '09:00 AM', available: true },
            { id: 't2', time: '09:30 AM', available: true },
            { id: 't3', time: '10:00 AM', available: true },
            { id: 't4', time: '10:30 AM', available: false },
            { id: 't5', time: '11:00 AM', available: true },
            { id: 't6', time: '11:30 AM', available: true },
            { id: 't7', time: '01:00 PM', available: true },
            { id: 't8', time: '01:30 PM', available: false },
            { id: 't9', time: '02:00 PM', available: true },
          ]);
          setLoading(prev => ({ ...prev, timeSlots: false }));
        }, 500);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setError('Failed to load available time slots. Please try again later.');
        setLoading(prev => ({ ...prev, timeSlots: false }));
      }
    };
    
    fetchTimeSlots();
  }, [watchDoctorId, watchAppointmentDate, hospitalId, setValue]);
  
  const onSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Format data for API
      const appointmentData = {
        ...data,
        hospitalId,
        status: 'scheduled',
      };
      
      // In a real app, this would be an API call
      // const response = await api.post('/appointments', appointmentData);
      
      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to appointments list or confirmation page
      router.push('/patient/appointments?success=true');
    } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'An error occurred while booking the appointment. Please try again.');
        } else {
          setError('An unknown error occurred. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Form Header */}
      <div className="bg-primary-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Book Appointment</h2>
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
        <div className="space-y-6">
          {/* Appointment Type */}
          <div>
            <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 mb-1">
              Select Appointment Type*
            </label>
            <select
              id="appointmentType"
              {...register('appointmentType')}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                errors.appointmentType ? 'border-red-300' : ''
              }`}
            >
              <option value="">Select type</option>
              <option value="consultation">General Consultation</option>
              <option value="followup">Follow-up Visit</option>
              <option value="specialist">Specialist Consultation</option>
              <option value="emergency">Urgent Care</option>
            </select>
            {errors.appointmentType && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentType.message}</p>
            )}
          </div>
          
          {/* Department Selection */}
          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Department*
            </label>
            <select
              id="departmentId"
              {...register('departmentId')}
              disabled={loading.departments}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                errors.departmentId ? 'border-red-300' : ''
              }`}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {loading.departments && (
              <p className="mt-1 text-sm text-blue-600">Loading departments...</p>
            )}
            {errors.departmentId && (
              <p className="mt-1 text-sm text-red-600">{errors.departmentId.message}</p>
            )}
          </div>
          
          {/* Doctor Selection */}
          <div>
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor*
            </label>
            <select
              id="doctorId"
              {...register('doctorId')}
              disabled={!watchDepartmentId || loading.doctors}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                errors.doctorId ? 'border-red-300' : ''
              }`}
            >
              <option value="">Select doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                </option>
              ))}
            </select>
            {loading.doctors && (
              <p className="mt-1 text-sm text-blue-600">Loading doctors...</p>
            )}
            {errors.doctorId && (
              <p className="mt-1 text-sm text-red-600">{errors.doctorId.message}</p>
            )}
          </div>
          
          {/* Date Selection */}
          <div>
            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
              Select Date*
            </label>
            <input
              id="appointmentDate"
              type="date"
              {...register('appointmentDate')}
              min={format(new Date(), 'yyyy-MM-dd')}
              disabled={!watchDoctorId}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                errors.appointmentDate ? 'border-red-300' : ''
              }`}
            />
            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
            )}
          </div>
          
          {/* Time Slot Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Time Slot*
            </label>
            {loading.timeSlots ? (
              <p className="text-sm text-blue-600">Loading available time slots...</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <div key={slot.id}>
                      <input
                        type="radio"
                        id={`time-${slot.id}`}
                        value={slot.id}
                        disabled={!slot.available}
                        {...register('appointmentTime')}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={`time-${slot.id}`}
                        className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border ${
                          slot.available
                            ? 'peer-checked:bg-primary-100 peer-checked:border-primary-500 hover:bg-gray-50 cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </label>
                    </div>
                  ))}
                </div>
                {timeSlots.length === 0 && watchAppointmentDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    No time slots available for the selected date. Please choose another date.
                  </p>
                )}
              </>
            )}
            {errors.appointmentTime && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
            )}
          </div>
          
          {/* Reason for Visit */}
          <div>
            <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit*
            </label>
            <textarea
              id="reasonForVisit"
              rows={4}
              {...register('reasonForVisit')}
              placeholder="Please describe the reason for your appointment..."
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                errors.reasonForVisit ? 'border-red-300' : ''
              }`}
            ></textarea>
            {errors.reasonForVisit && (
              <p className="mt-1 text-sm text-red-600">{errors.reasonForVisit.message}</p>
            )}
          </div>
          
          {/* Submit Button */}
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
              disabled={isSubmitting || loading.departments || loading.doctors || loading.timeSlots}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AppointmentBookingForm;