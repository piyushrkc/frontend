'use client';

export default function MinimalHomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Hospital Management System</h1>
        <p className="text-gray-600 mb-4 text-center">
          Welcome to our simplified hospital management platform.
        </p>
        <div className="mt-6 flex justify-center">
          <a 
            href="/minimal"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            View Minimal Page
          </a>
        </div>
      </div>
    </div>
  );
}