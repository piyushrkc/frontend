// src/components/layout/header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/lib/utils';
import ClinicSettingsModal from '@/components/settings/ClinicSettingsModal';

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <header className="bg-white shadow h-16 z-10 relative">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <svg
              className="h-8 w-8 text-primary-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
                fill="currentColor"
              />
              <path
                d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"
                fill="currentColor"
              />
              <path
                d="M5 8C6.65685 8 8 6.65685 8 5C8 3.34315 6.65685 2 5 2C3.34315 2 2 3.34315 2 5C2 6.65685 3.34315 8 5 8Z"
                fill="currentColor"
              />
              <path
                d="M5 22C6.65685 22 8 20.6569 8 19C8 17.3431 6.65685 16 5 16C3.34315 16 2 17.3431 2 19C2 20.6569 3.34315 22 5 22Z"
                fill="currentColor"
              />
              <path
                d="M19 22C20.6569 22 22 20.6569 22 19C22 17.3431 20.6569 16 19 16C17.3431 16 16 17.3431 16 19C16 20.6569 17.3431 22 19 22Z"
                fill="currentColor"
              />
              <path
                d="M12 12V17M12 22V17M12 17H7M12 17H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-3 text-lg font-semibold text-gray-900">OPD Management</span>
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
              Dashboard
            </Link>
            <Link href="/appointments" className="text-gray-700 hover:text-primary-600">
              Appointments
            </Link>
            <Link href="/telemedicine/dashboard" className="text-gray-700 hover:text-primary-600">
              Telemedicine
            </Link>
            <Link href="/pharmacy" className="text-gray-700 hover:text-primary-600">
              Pharmacy
            </Link>
            <Link href="/laboratory" className="text-gray-700 hover:text-primary-600">
              Laboratory
            </Link>
            <Link href="/billing" className="text-gray-700 hover:text-primary-600">
              Billing
            </Link>
          </nav>
        </div>

        {user && (
          <div className="flex items-center">
            {/* Clinic Settings Button */}
            {(user.role === 'admin' || user.role === 'doctor') && (
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="mr-4 text-gray-500 hover:text-gray-700"
                aria-label="Clinic Settings"
                title="Clinic Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}

            {/* User Profile */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="text-sm text-gray-700 mr-2 hidden md:inline-block">
                  {user.firstName} {user.lastName}
                </span>
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Modal */}
        <ClinicSettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />
      </div>
    </header>
  );
};

export default Header;
