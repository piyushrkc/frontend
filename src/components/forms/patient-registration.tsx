// src/components/forms/patient-registration-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';

// Define the form schema with Zod
const patientSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number' }),
  dateOfBirth: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Please enter a valid date of birth',
  }),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters' }),
  state: z.string().min(2, { message: 'State must be at least 2 characters' }),
  zipCode: z.string().min(5, { message: 'Zip code must be at least 5 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientRegistrationFormProps {
  hospitalId: string;
}

const PatientRegistrationForm = ({ hospitalId }: PatientRegistrationFormProps) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    watch,
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Add role and hospitalId to the data
      const registrationData = {
        ...data,
        role: 'patient',
        hospitalId,
      };
      
      // Call your registration API endpoint here
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      // Redirect to login page on success
      router.push('/login?registered=true');
    } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'An error occurred during registration');
        } else {
          setError('An unknown error occurred during registration');
        }
      } finally {
        setIsSubmitting(false);
      }
    };

  const nextStep = async () => {
    const isStepValid = await trigger([
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'dateOfBirth',
      'gender',
    ]);
    
    if (isStepValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Form Header */}
      <div className="bg-primary-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Patient Registration</h2>
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
        {step === 1 ? (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name*
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                    errors.firstName ? 'border-red-300' : ''
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name*
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                    errors.lastName ? 'border-red-300' : ''
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                    errors.phoneNumber ? 'border-red-300' : ''
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>
              
              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth*
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                    errors.dateOfBirth ? 'border-red-300' : ''
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>
              
              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender*
                </label>
                <select
                  id="gender"
                  {...register('gender')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                    errors.gender ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={nextStep}
                className="w-full md:w-auto"
              >
                Next: Address & Login Details
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address & Account Information</h3>
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">Address Information</h4>
              
              <div className="grid grid-cols-1 gap-6 mb-6">
                {/* Street Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address*
                  </label>
                  <input
                    id="address"
                    type="text"
                    {...register('address')}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                      errors.address ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      id="city"
                      type="text"
                      {...register('city')}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                        errors.city ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>
                  
                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State*
                    </label>
                    <input
                      id="state"
                      type="text"
                      {...register('state')}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                        errors.state ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>
                  
                  {/* Zip Code */}
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code*
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      {...register('zipCode')}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                        errors.zipCode ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <h4 className="text-md font-medium text-gray-800 mb-3">Login Credentials</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password*
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                      errors.password ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                
                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password*
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 ${
                      errors.confirmPassword ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Register
              </Button>
            </div>
          </>
        )}
        
        {/* Form Progress Indicator */}
        <div className="mt-8 pt-5 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center text-primary-600 relative">
              <div className={`rounded-full transition duration-500 ease-in-out h-6 w-6 flex items-center justify-center ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-900'
              }`}>
                1
              </div>
              <div className="absolute top-0 -ml-10 text-center mt-8 w-20 text-xs font-medium uppercase text-primary-600">
                Personal
              </div>
            </div>
            <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
              step >= 2 ? 'border-primary-600' : 'border-gray-300'
            }`}></div>
            <div className="flex items-center text-white relative">
              <div className={`rounded-full transition duration-500 ease-in-out h-6 w-6 flex items-center justify-center ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-900'
              }`}>
                2
              </div>
              <div className="absolute top-0 -ml-10 text-center mt-8 w-20 text-xs font-medium uppercase text-gray-500">
                Address
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;