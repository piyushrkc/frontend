'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import WalkInLabInvoice from '@/components/laboratory/WalkInInvoice';

export default function LaboratoryWalkInPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link 
              href="/laboratory"
              className="mr-4 text-gray-600 hover:text-primary-600 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Laboratory
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Laboratory - Walk-in Patient</h1>
          </div>
        </div>

        <WalkInLabInvoice />
      </div>
    </div>
  );
}