'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  
  // Mock user settings
  const [settings, setSettings] = useState({
    email: 'john.smith@example.com',
    notifications: {
      email: true,
      sms: true,
      app: true
    },
    reminders: {
      appointments: true,
      medications: true,
      reports: false
    },
    privacy: {
      shareDataWithDoctors: true,
      shareDataWithResearch: false,
      allowAnonymizedData: true
    },
    twoFactorAuth: false,
    language: 'english',
    theme: 'light'
  });

  const handleNotificationChange = (type) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type]
      }
    });
  };

  const handleReminderChange = (type) => {
    setSettings({
      ...settings,
      reminders: {
        ...settings.reminders,
        [type]: !settings.reminders[type]
      }
    });
  };

  const handlePrivacyChange = (type) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [type]: !settings.privacy[type]
      }
    });
  };

  const handleTwoFactorChange = () => {
    setSettings({
      ...settings,
      twoFactorAuth: !settings.twoFactorAuth
    });
  };

  const handleLanguageChange = (e) => {
    setSettings({
      ...settings,
      language: e.target.value
    });
  };

  const handleThemeChange = (e) => {
    setSettings({
      ...settings,
      theme: e.target.value
    });
  };

  const handleSaveSettings = () => {
    // In a real app, this would make an API call to save the settings
    alert('Settings saved successfully!');
  };

  const handlePasswordChange = () => {
    alert('Password change functionality would go here');
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirm) {
      alert('Account deletion request would be processed');
      // In a real app, this would make an API call to initiate account deletion
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your account preferences and security
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleSaveSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Settings Categories</h3>
              </div>
              <nav className="px-4 py-3">
                <ul className="space-y-2">
                  <li>
                    <a href="#notifications" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 rounded-md bg-blue-50">
                      <svg className="mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      Notifications
                    </a>
                  </li>
                  <li>
                    <a href="#privacy" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                      <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Privacy & Security
                    </a>
                  </li>
                  <li>
                    <a href="#preferences" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                      <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      Preferences
                    </a>
                  </li>
                  <li>
                    <a href="#account" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50">
                      <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Account
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications Settings */}
            <div id="notifications" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Manage how you receive notifications and reminders</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Communication Channels</h4>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email-notifications"
                            name="email-notifications"
                            type="checkbox"
                            checked={settings.notifications.email}
                            onChange={() => handleNotificationChange('email')}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email-notifications" className="font-medium text-gray-700">Email Notifications</label>
                          <p className="text-gray-500">Receive updates and notifications via email</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="sms-notifications"
                            name="sms-notifications"
                            type="checkbox"
                            checked={settings.notifications.sms}
                            onChange={() => handleNotificationChange('sms')}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="sms-notifications" className="font-medium text-gray-700">SMS Notifications</label>
                          <p className="text-gray-500">Receive text messages for important updates</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="app-notifications"
                            name="app-notifications"
                            type="checkbox"
                            checked={settings.notifications.app}
                            onChange={() => handleNotificationChange('app')}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="app-notifications" className="font-medium text-gray-700">In-App Notifications</label>
                          <p className="text-gray-500">Receive notifications when using the app</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Reminders</h4>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="appointment-reminders"
                            name="appointment-reminders"
                            type="checkbox"
                            checked={settings.reminders.appointments}
                            onChange={() => handleReminderChange('appointments')}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="appointment-reminders" className="font-medium text-gray-700">Appointment Reminders</label>
                          <p className="text-gray-500">Receive reminders about upcoming appointments</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="medication-reminders"
                            name="medication-reminders"
                            type="checkbox"
                            checked={settings.reminders.medications}
                            onChange={() => handleReminderChange('medications')}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="medication-reminders" className="font-medium text-gray-700">Medication Reminders</label>
                          <p className="text-gray-500">Receive reminders to take your medications</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="report-reminders"
                            name="report-reminders"
                            type="checkbox"
                            checked={settings.reminders.reports}
                            onChange={() => handleReminderChange('reports')}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="report-reminders" className="font-medium text-gray-700">Lab Report Notifications</label>
                          <p className="text-gray-500">Receive notifications when new lab reports are available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Security Settings */}
            <div id="privacy" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Privacy & Security</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your data sharing and security preferences</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Data Sharing</h4>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="share-with-doctors"
                            name="share-with-doctors"
                            type="checkbox"
                            checked={settings.privacy.shareDataWithDoctors}
                            onChange={() => handlePrivacyChange('shareDataWithDoctors')}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="share-with-doctors" className="font-medium text-gray-700">Share data with your doctors</label>
                          <p className="text-gray-500">Allow your doctors to access your health records</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="share-with-research"
                            name="share-with-research"
                            type="checkbox"
                            checked={settings.privacy.shareDataWithResearch}
                            onChange={() => handlePrivacyChange('shareDataWithResearch')}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="share-with-research" className="font-medium text-gray-700">Share data for research</label>
                          <p className="text-gray-500">Allow your data to be used for medical research</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="anonymized-data"
                            name="anonymized-data"
                            type="checkbox"
                            checked={settings.privacy.allowAnonymizedData}
                            onChange={() => handlePrivacyChange('allowAnonymizedData')}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="anonymized-data" className="font-medium text-gray-700">Anonymized data collection</label>
                          <p className="text-gray-500">Allow collection of anonymized data for system improvements</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Security</h4>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="two-factor-auth"
                            name="two-factor-auth"
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={handleTwoFactorChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="two-factor-auth" className="font-medium text-gray-700">Two-factor authentication</label>
                          <p className="text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handlePasswordChange}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Settings */}
            <div id="preferences" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Preferences</h3>
                <p className="mt-1 text-sm text-gray-500">Customize your app experience</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                    <select
                      id="language"
                      name="language"
                      value={settings.language}
                      onChange={handleLanguageChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Español</option>
                      <option value="french">Français</option>
                      <option value="german">Deutsch</option>
                      <option value="chinese">中文</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
                    <select
                      id="theme"
                      name="theme"
                      value={settings.theme}
                      onChange={handleThemeChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div id="account" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Account Management</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your account information and status</p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Address</h4>
                    <p className="mt-1 text-sm text-gray-500">Your current email: {settings.email}</p>
                    <div className="mt-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change Email
                      </button>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-red-600">Danger Zone</h4>
                    <p className="mt-1 text-sm text-gray-500">Once you delete your account, there is no going back. Please be certain.</p>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.push('/profile')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Profile
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}