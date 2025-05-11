'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PatientRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the actual patient dashboard
    router.push('/dashboard/patient');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to patient dashboard...</p>
    </div>
  );
}