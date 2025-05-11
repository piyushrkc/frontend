'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Hospital Management System</h1>
        <a href="/login" className="text-blue-600 font-medium hover:underline">
          Login
        </a>
      </header>

      {/* Hero */}
      <section className="flex-1 bg-gray-100 flex flex-col justify-center items-center p-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Comprehensive Healthcare Management Solution
        </h2>
        <p className="max-w-2xl mb-6 text-gray-700">
          Streamline your hospital operations with our all-in-one platform
          for patients, doctors, and administrators.
        </p>
        <div className="flex gap-4">
          <a
            href="/login"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Login Now
          </a>
          <a
            href="#features"
            className="border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-100"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Demo Access */}
      <section className="bg-blue-50 py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">Test The System</h3>
          <p className="text-center mb-8 text-gray-700">
            Use these demo credentials to explore different roles in the system:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <CredentialCard
              role="Admin"
              email="admin@opd.com"
              password="admin123"
              bgColor="bg-indigo-50"
              textColor="text-indigo-700"
              borderColor="border-indigo-200"
            />
            <CredentialCard
              role="Doctor"
              email="doctor@opd.com"
              password="doctor123"
              bgColor="bg-emerald-50"
              textColor="text-emerald-700"
              borderColor="border-emerald-200"
            />
            <CredentialCard
              role="Patient"
              email="patient@opd.com"
              password="patient123"
              bgColor="bg-amber-50"
              textColor="text-amber-700"
              borderColor="border-amber-200"
            />
          </div>
          
          <div className="text-center mt-8">
            <a 
              href="/login" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login to Test
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-16 px-8">
        <h3 className="text-2xl font-bold text-center mb-8">Key Features By Role</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            title="Patient Portal"
            features={[
              'Online appointment booking',
              'Medical records access',
              'Digital prescriptions',
              'Lab results viewing',
              'Medication scheduling',
              'Health history tracking',
            ]}
            color="amber"
          />
          <FeatureCard
            title="Doctor Dashboard"
            features={[
              'Patient queue management',
              'E-prescription system',
              'Medical history access',
              'Appointment scheduling',
              'Lab test ordering',
              'Treatment planning',
            ]}
            color="emerald"
          />
          <FeatureCard
            title="Admin Console"
            features={[
              'Staff management',
              'Hospital resource tracking',
              'Department performance metrics',
              'Financial operations',
              'Patient registration',
              'System configuration',
            ]}
            color="indigo"
          />
        </div>
      </section>
      
      {/* Additional Modules */}
      <section className="bg-gray-50 py-16 px-8">
        <h3 className="text-2xl font-bold text-center mb-8">Additional Modules</h3>
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="relative">
            <FeatureCard
              title="Telemedicine"
              features={[
                'Video consultations',
                'Secure patient-doctor communication',
                'Screen sharing for reports',
                'Post-consultation notes',
                'Session scheduling',
              ]}
              color="indigo"
            />
            <div className="mt-4 text-center">
              <a
                href="/telemedicine/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Access Telemedicine
              </a>
            </div>
          </div>

          <div className="relative">
            <FeatureCard
              title="Pharmacy Management"
              features={[
                'Medication inventory',
                'Prescription fulfillment',
                'Patient medication history',
                'Automated reordering',
              ]}
              color="blue"
            />
            <div className="mt-4 text-center">
              <a
                href="/pharmacy"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Access Pharmacy
              </a>
            </div>
          </div>

          <div className="relative">
            <FeatureCard
              title="Laboratory Services"
              features={[
                'Test ordering & results',
                'Sample tracking',
                'Result integration',
                'Reference ranges',
              ]}
              color="purple"
            />
            <div className="mt-4 text-center">
              <a
                href="/laboratory"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Access Laboratory
              </a>
            </div>
          </div>

          <div className="relative">
            <FeatureCard
              title="Billing & Invoicing"
              features={[
                'GST-compliant invoices',
                'Consultation billing',
                'Pharmacy billing',
                'Lab test billing',
                'Payment tracking',
              ]}
              color="emerald"
            />
            <div className="mt-4 text-center">
              <a
                href="/billing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Access Billing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 p-8 text-center">
        <p className="text-sm text-gray-500 mb-4">
          This is a demonstration system for testing purposes.
        </p>
        <p className="text-sm text-gray-600">
          © 2025 Hospital Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, features, color = "blue" }: { title: string; features: string[]; color?: string }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    indigo: "bg-indigo-50 border-indigo-200",
    purple: "bg-purple-50 border-purple-200",
    emerald: "bg-emerald-50 border-emerald-200",
    amber: "bg-amber-50 border-amber-200",
  };
  
  const colorClass = colors[color as keyof typeof colors] || colors.blue;
  
  return (
    <div className={`${colorClass} border rounded-lg p-6 shadow-sm`}>
      <h4 className="text-xl font-semibold mb-4">{title}</h4>
      <ul className="text-sm space-y-2 text-gray-700">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CredentialCard({ role, email, password, bgColor, textColor, borderColor }: { 
  role: string; 
  email: string; 
  password: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}) {
  return (
    <div className={`${bgColor} ${borderColor} border-2 rounded-lg p-5 shadow-sm`}>
      <h4 className={`${textColor} text-lg font-bold mb-3`}>{role}</h4>
      <div className="space-y-2 text-sm">
        <p className="font-medium">Email:</p>
        <p className="font-mono bg-white bg-opacity-50 p-2 rounded">{email}</p>
        <p className="font-medium mt-2">Password:</p>
        <p className="font-mono bg-white bg-opacity-50 p-2 rounded">{password}</p>
      </div>
    </div>
  );
}