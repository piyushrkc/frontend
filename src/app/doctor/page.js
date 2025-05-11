'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the new doctor dashboard path
    router.push('/doctor-dashboard');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to doctor dashboard...</p>
    </div>
  );
}