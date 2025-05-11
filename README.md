# Hospital Management System Frontend

Frontend application for the Hospital Management System with telemedicine support.

## Vercel Deployment

This repository is configured for easy deployment to Vercel.

### Deployment Steps

1. Create a new project in Vercel and connect it to this Git repository
2. Configure environment variables in Vercel Project Settings (not in vercel.json):
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://hospital-management-backend.vercel.app/api`)
   - `NEXT_PUBLIC_ENVIRONMENT`: `production`
   - `NEXT_PUBLIC_MOCK_API`: `false`
   - `NEXT_PUBLIC_MOCK_VIDEO`: `false`
   - `NEXT_PUBLIC_APP_NAME`: `Hospital Management System`
   - `NEXT_PUBLIC_ENABLE_TELEMEDICINE`: `true`
3. Deploy the project

> **IMPORTANT SECURITY NOTE**: Never commit sensitive information like API keys or backend URLs to your repository. Always use Vercel's environment variables feature to securely store these values.

### Local Development

1. Clone this repository
2. Run `npm install`
3. Create a `.env.local` file with the required environment variables
4. Run `npm run dev` to start the development server

## Features

- Patient Dashboard
- Doctor Dashboard
- Appointment Scheduling
- Telemedicine Video Consultations
- Medical Records
- Pharmacy Management
- Laboratory Results
- Billing and Invoices

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Query
- Axios for API calls
- NextJS App Router