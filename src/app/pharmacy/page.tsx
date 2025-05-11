'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PharmacyDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pharmacy Dashboard</h1>
          <p className="text-gray-600">Manage medications, inventory, and prescriptions</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Pending Prescriptions" 
            value="5" 
            bgColor="bg-blue-50" 
            textColor="text-blue-600" 
            link="/pharmacy/prescriptions"
          />
          <StatCard 
            title="Low Stock Items" 
            value="3" 
            bgColor="bg-amber-50" 
            textColor="text-amber-600" 
            link="/pharmacy/inventory?filter=low-stock"
          />
          <StatCard 
            title="Expiring Soon" 
            value="7" 
            bgColor="bg-rose-50" 
            textColor="text-rose-600" 
            link="/pharmacy/inventory?filter=expiring"
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
                  icon="📋"
                  label="View Prescriptions"
                  href="/pharmacy/prescriptions"
                />
                <QuickActionButton
                  icon="💊"
                  label="Manage Medications"
                  href="/pharmacy/medications"
                />
                <QuickActionButton
                  icon="📦"
                  label="Check Inventory"
                  href="/pharmacy/inventory"
                />
                <QuickActionButton
                  icon="👤"
                  label="Walk-in Customer"
                  href="/pharmacy/walk-in"
                />
                <QuickActionButton
                  icon="🔍"
                  label="Search Medication"
                  href="/pharmacy/search"
                />
                <QuickActionButton
                  icon="📊"
                  label="Generate Reports"
                  href="/pharmacy/reports"
                />
              </div>
            </div>
          </div>
          
          {/* Recent Activity Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <ActivityItem 
                  type="prescription_filled"
                  description="Prescription #12345 for John Smith was filled"
                  time="30 minutes ago"
                />
                <ActivityItem 
                  type="inventory_updated"
                  description="Inventory for Amoxicillin 500mg was updated (+100 units)"
                  time="2 hours ago"
                />
                <ActivityItem 
                  type="medication_added"
                  description="New medication 'Azithromycin 250mg' was added to the system"
                  time="Yesterday at 15:45"
                />
                <ActivityItem 
                  type="inventory_low"
                  description="Lisinopril 10mg is running low on stock (5 units remaining)"
                  time="Yesterday at 10:30"
                />
                <ActivityItem 
                  type="prescription_pending"
                  description="New prescription #12346 for Emma Wilson is pending"
                  time="2 days ago"
                />
              </div>
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

function ActivityItem({ type, description, time }: { 
  type: 'prescription_filled' | 'inventory_updated' | 'medication_added' | 'inventory_low' | 'prescription_pending'; 
  description: string; 
  time: string;
}) {
  // Set icon and color based on activity type
  let icon = '📋';
  let bgColor = 'bg-blue-100';
  let textColor = 'text-blue-800';
  
  switch (type) {
    case 'prescription_filled':
      icon = '✅';
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'inventory_updated':
      icon = '📦';
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    case 'medication_added':
      icon = '💊';
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'inventory_low':
      icon = '⚠️';
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      break;
    case 'prescription_pending':
      icon = '⏳';
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      break;
  }
  
  return (
    <div className="flex items-start space-x-3">
      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}>
        <span>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-gray-700">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}