'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllLabTests } from '@/services/labService';
import { LabTest } from '@/types/lab';

export default function LabDashboard() {
  const [stats, setStats] = useState({
    ordered: 0,
    processing: 0,
    completed: 0,
    totalTests: 0
  });
  const [recentTests, setRecentTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLabData() {
      try {
        setIsLoading(true);
        const tests = await getAllLabTests();
        
        // Get most recent 5 tests
        const sortedTests = [...tests].sort((a, b) => 
          new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
        ).slice(0, 5);
        
        setRecentTests(sortedTests);
        
        // Calculate stats
        const ordered = tests.filter(test => test.status === 'ordered').length;
        const processing = tests.filter(test => ['collected', 'processing'].includes(test.status)).length;
        const completed = tests.filter(test => test.status === 'completed').length;
        
        setStats({
          ordered,
          processing,
          completed,
          totalTests: tests.length
        });
      } catch (error) {
        console.error('Error loading lab data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLabData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Laboratory Dashboard</h1>
          <p className="text-gray-600">Manage lab tests, results, and reports</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Ordered Tests" 
            value={stats.ordered.toString()} 
            bgColor="bg-blue-50" 
            textColor="text-blue-600" 
            link="/lab/tests?status=ordered"
          />
          <StatCard 
            title="In Progress" 
            value={stats.processing.toString()} 
            bgColor="bg-amber-50" 
            textColor="text-amber-600" 
            link="/lab/tests?status=processing"
          />
          <StatCard 
            title="Completed" 
            value={stats.completed.toString()} 
            bgColor="bg-green-50" 
            textColor="text-green-600" 
            link="/lab/tests?status=completed"
          />
          <StatCard 
            title="Total Tests" 
            value={stats.totalTests.toString()} 
            bgColor="bg-purple-50" 
            textColor="text-purple-600" 
            link="/lab/tests"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <QuickActionButton 
                  icon="🧪" 
                  label="View Tests" 
                  href="/lab/tests" 
                />
                <QuickActionButton 
                  icon="📝" 
                  label="Enter Results" 
                  href="/lab/results/new" 
                />
                <QuickActionButton 
                  icon="📋" 
                  label="View Results" 
                  href="/lab/results" 
                />
                <QuickActionButton 
                  icon="👨‍⚕️" 
                  label="Patient Tests" 
                  href="/lab/patients" 
                />
                <QuickActionButton 
                  icon="📊" 
                  label="Reports" 
                  href="/lab/reports" 
                />
                <QuickActionButton 
                  icon="⚙️" 
                  label="Settings" 
                  href="/lab/settings" 
                />
              </div>
            </div>
          </div>
          
          {/* Recent Lab Tests Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Recent Lab Tests</h2>
              <Link 
                href="/lab/tests" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading tests...</p>
                </div>
              ) : recentTests.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No recent tests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTests.map(test => (
                    <LabTestCard key={test.id} test={test} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center mt-6">
          <Link href="/" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, bgColor, textColor, link }: { 
  title: string; 
  value: string; 
  bgColor: string;
  textColor: string;
  link: string;
}) {
  return (
    <Link href={link}>
      <div className={`${bgColor} rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow`}>
        <p className="text-gray-700 text-sm font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
      </div>
    </Link>
  );
}

function QuickActionButton({ icon, label, href }: { 
  icon: string; 
  label: string; 
  href: string;
}) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm text-gray-700 text-center">{label}</span>
    </Link>
  );
}

function LabTestCard({ test }: { test: LabTest }) {
  // Status styles
  const statusStyles = {
    ordered: 'bg-blue-100 text-blue-800',
    collected: 'bg-amber-100 text-amber-800',
    processing: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };
  
  const statusLabels = {
    ordered: 'Ordered',
    collected: 'Collected',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  
  return (
    <div className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{test.testType}</h3>
          <p className="text-sm text-gray-500">Patient: {test.patient.name}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[test.status]}`}>
          {statusLabels[test.status]}
        </span>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {new Date(test.orderedAt).toLocaleDateString()}
        </div>
        <Link 
          href={`/lab/tests/${test.id}`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}