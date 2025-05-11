// Redirect to the app router home page
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LegacyHomePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/');
  }, [router]);
  
  return null;
}