'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ClinicSettingsModal from '@/components/settings/ClinicSettingsModal';

// Icons for the tiles
const ClinicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const DoctorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

const PharmacyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const LabIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428
    15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05
    15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415
    3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const BillingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // For the demo, we'll allow access even if the user role check fails
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to access the admin settings.</p>
          <div className="mt-4 mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 mb-1">Demo Credentials:</p>
            <p className="font-mono text-sm">Email: admin@generalhospital.com</p>
            <p className="font-mono text-sm">Password: admin123</p>
          </div>
          <Link href="/login" className="text-primary-600 hover:text-primary-800">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // For demo purposes, we'll bypass the role check
  // This would be properly enforced in a production environment
  // if (user.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
  //         <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
  //         <Link href="/dashboard" className="text-primary-600 hover:text-primary-800">
  //           Return to Dashboard
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage hospital settings, user roles, and system configurations
          </p>
        </div>

        <div className="admin-tile-grid">
          {/* Clinic Information Tile */}
          <div 
            className="admin-tile cursor-pointer"
            onClick={() => openModal('clinic')}
          >
            <div className="admin-tile-icon"><ClinicIcon /></div>
            <h2 className="admin-tile-title">Clinic Information</h2>
            <p className="admin-tile-description">
              Manage clinic name, address, contact details, and working hours
            </p>
          </div>

          {/* Doctor Settings Tile */}
          <div 
            className="admin-tile cursor-pointer"
            onClick={() => openModal('doctor')}
          >
            <div className="admin-tile-icon"><DoctorIcon /></div>
            <h2 className="admin-tile-title">Doctor Settings</h2>
            <p className="admin-tile-description">
              Update doctor profiles, qualifications, specializations, and timings
            </p>
          </div>

          {/* Billing Settings Tile */}
          <div 
            className="admin-tile cursor-pointer"
            onClick={() => openModal('billing')}
          >
            <div className="admin-tile-icon"><BillingIcon /></div>
            <h2 className="admin-tile-title">Billing Settings</h2>
            <p className="admin-tile-description">
              Configure consultation fees, GST details, and payment methods
            </p>
          </div>

          {/* Pharmacy Settings Tile */}
          <Link href="/admin/pharmacy-settings" className="admin-tile">
            <div className="admin-tile-icon"><PharmacyIcon /></div>
            <h2 className="admin-tile-title">Pharmacy Settings</h2>
            <p className="admin-tile-description">
              Manage pharmacy details, inventory settings, and medication pricing
            </p>
          </Link>

          {/* Laboratory Settings Tile */}
          <Link href="/admin/laboratory-settings" className="admin-tile">
            <div className="admin-tile-icon"><LabIcon /></div>
            <h2 className="admin-tile-title">Laboratory Settings</h2>
            <p className="admin-tile-description">
              Configure lab test categories, pricing, and reporting templates
            </p>
          </Link>

          {/* User Management Tile */}
          <Link href="/admin/user-management" className="admin-tile">
            <div className="admin-tile-icon"><UsersIcon /></div>
            <h2 className="admin-tile-title">User Management</h2>
            <p className="admin-tile-description">
              Add, update, or deactivate staff accounts and manage permissions
            </p>
          </Link>
        </div>
      </div>

      {/* Settings Modals */}
      {activeModal === 'clinic' && (
        <ClinicSettingsModal 
          isOpen={true} 
          onClose={closeModal}
          initialTab="clinicDetails"
        />
      )}
      
      {activeModal === 'doctor' && (
        <ClinicSettingsModal 
          isOpen={true} 
          onClose={closeModal}
          initialTab="doctorDetails"
        />
      )}
      
      {activeModal === 'billing' && (
        <ClinicSettingsModal 
          isOpen={true} 
          onClose={closeModal}
          initialTab="billingSettings"
        />
      )}
    </div>
  );
}