'use client';

export default function IndexPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 p-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Hospital Management System</h1>
        
        <p className="mb-8 text-gray-600">
          Welcome to our hospital management platform. Please log in to access your dashboard.
        </p>
        
        <div className="flex flex-col space-y-4 items-center">
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full max-w-xs"
          >
            Login
          </a>
          
          <a 
            href="/dashboard" 
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors w-full max-w-xs"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}