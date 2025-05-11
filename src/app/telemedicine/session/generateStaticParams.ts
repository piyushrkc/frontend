// This function is kept in a separate file to avoid conflicts with 'use client'
export function generateStaticParams() {
  // In a real app, you might fetch all session IDs from an API
  // For now, we'll return a few placeholder IDs
  return [
    { id: 'session1' },
    { id: 'session2' },
    { id: 'session3' }
  ];
}