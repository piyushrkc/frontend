'use client';

import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard layout can include common elements like header, sidebar, etc. */}
      <main>{children}</main>
    </div>
  );
}