
// src/components/layout/sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SidebarItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: React.ReactNode;
}

interface SidebarProps {
  role: 'admin' | 'doctor' | 'patient' | 'labTechnician' | 'pharmacist' | 'receptionist';
  items: SidebarItem[];
}

const Sidebar = ({ role, items }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-secondary-800 text-white transition-all duration-300 h-screen sticky top-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-secondary-700">
        {!collapsed && (
          <span className="text-lg font-semibold text-white capitalize">{role} Panel</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary-700 ${
            collapsed ? 'mx-auto' : ''
          }`}
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      <nav className="mt-4">
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center py-3 px-4 ${
                  item.active ? 'bg-primary-600' : 'hover:bg-secondary-700'
                }`}
              >
                {item.icon ? (
                  <span className="w-5 h-5 mr-3">{item.icon}</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;