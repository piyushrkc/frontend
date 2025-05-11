'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TelemedicineSessionRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  useEffect(() => {
    if (id) {
      // Redirect to a client component page with the session ID
      router.push(`/telemedicine/join?id=${id}`);
    }
  }, [id, router]);
  
  if (!id) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Session ID Missing</h2>
          <p className="text-gray-700 mb-6">
            No session ID was provided. Please access this page from your telemedicine dashboard.
          </p>
          <Link 
            href="/telemedicine/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-700">Redirecting to your telemedicine session...</p>
      </div>
    </div>
  );
}