'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Simple hardcoded login for demo purposes
    if (role === 'admin' && email === 'admin@opd.com' && password === 'admin123') {
      router.push('/admin'); // Redirect to admin dashboard
    } else if (role === 'doctor' && email === 'doctor@opd.com' && password === 'doctor123') {
      router.push('/doctor-dashboard'); // Redirect to NEW doctor dashboard
    } else if (role === 'patient' && email === 'patient@opd.com' && password === 'patient123') {
      router.push('/patient'); // Redirect to patient dashboard
    } else {
      setError('Invalid credentials. Please check your email, password, and role selection.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Hospital Management System</h2>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
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
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Role</label>
            <div className="grid grid-cols-3 gap-3">
              <div 
                className={`border rounded-md p-3 text-center cursor-pointer transition ${
                  role === 'admin' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setRole('admin')}
              >
                Admin
              </div>
              <div 
                className={`border rounded-md p-3 text-center cursor-pointer transition ${
                  role === 'doctor' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setRole('doctor')}
              >
                Doctor
              </div>
              <div 
                className={`border rounded-md p-3 text-center cursor-pointer transition ${
                  role === 'patient' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setRole('patient')}
              >
                Patient
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                role === 'admin' ? 'admin@opd.com' :
                role === 'doctor' ? 'doctor@opd.com' : 'patient@opd.com'
              }
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                role === 'admin' ? 'admin123' :
                role === 'doctor' ? 'doctor123' : 'patient123'
              }
              required
            />
          </div>
          
          <div className="!mt-2 text-sm text-gray-600">
            <p>Demo Credentials:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><strong>Admin:</strong> admin@opd.com / admin123</li>
              <li><strong>Doctor:</strong> doctor@opd.com / doctor123</li>
              <li><strong>Patient:</strong> patient@opd.com / patient123</li>
            </ul>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
          
          <div className="text-center text-sm text-gray-600">
            <p>
              Want to try the API authentication?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
                Use API login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}