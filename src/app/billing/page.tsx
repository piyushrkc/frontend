'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { InvoiceData } from '@/components/billing/Invoice';
import InvoiceGenerator from '@/components/billing/InvoiceGenerator';

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm rounded-md ${
      active 
        ? 'bg-primary-100 text-primary-700' 
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

export default function BillingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('pending');
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'consultation' | 'laboratory' | 'pharmacy'>('consultation');
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  
  // Dummy data for demonstration
  const dummyPatients = [
    { id: 'PT001', name: 'John Smith' },
    { id: 'PT002', name: 'Sarah Johnson' },
    { id: 'PT003', name: 'Michael Brown' }
  ];
  
  const dummyDoctors = [
    { id: 'DR001', name: 'Dr. Robert Wilson' },
    { id: 'DR002', name: 'Dr. Emily Davis' }
  ];
  
  // Mock services with prices
  const services = {
    consultation: [
      { id: 'CONS001', description: 'Standard Consultation', quantity: 1, unitPrice: 500, hsn: '998331' },
      { id: 'CONS002', description: 'Specialist Consultation', quantity: 1, unitPrice: 1000, hsn: '998331' },
      { id: 'CONS003', description: 'Follow-up Consultation', quantity: 1, unitPrice: 300, hsn: '998331' },
    ],
    laboratory: [
      { id: 'LAB001', description: 'Complete Blood Count (CBC)', quantity: 1, unitPrice: 450, hsn: '998341' },
      { id: 'LAB002', description: 'Blood Glucose Test', quantity: 1, unitPrice: 150, hsn: '998341' },
      { id: 'LAB003', description: 'Liver Function Test', quantity: 1, unitPrice: 800, hsn: '998341' },
    ],
    pharmacy: [
      { id: 'MED001', description: 'Paracetamol 500mg - 10 Tablets', quantity: 1, unitPrice: 35, hsn: '30049099' },
      { id: 'MED002', description: 'Amoxicillin 500mg - 10 Capsules', quantity: 1, unitPrice: 120, hsn: '30041050' },
      { id: 'MED003', description: 'Cetirizine 10mg - 10 Tablets', quantity: 1, unitPrice: 45, hsn: '30049099' },
    ]
  };
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }
    
    // Check if we need to show invoice generator (from query params)
    const showGenerator = searchParams.get('generate');
    const type = searchParams.get('type') as 'consultation' | 'laboratory' | 'pharmacy';
    
    if (showGenerator === 'true' && type) {
      setInvoiceType(type);
      setShowInvoiceGenerator(true);
    }
    
    // Fetch invoices
    fetchInvoices();
  }, [user, isLoading, router, searchParams]);
  
  const fetchInvoices = async () => {
    setIsLoadingInvoices(true);
    
    try {
      // In a real app, this would fetch from the API
      // const response = await getInvoices({ paymentStatus: activeTab === 'paid' ? 'paid' : 'unpaid' });
      // setInvoices(response);
      
      // For demo, use mock data
      setTimeout(() => {
        const mockInvoices: InvoiceData[] = [];
        
        // Generate 5 mock invoices
        for (let i = 1; i <= 5; i++) {
          const isPaid = activeTab === 'paid';
          const isPartial = !isPaid && Math.random() > 0.5;
          const patient = dummyPatients[Math.floor(Math.random() * dummyPatients.length)];
          const doctor = dummyDoctors[Math.floor(Math.random() * dummyDoctors.length)];
          const invoiceType = ['consultation', 'laboratory', 'pharmacy'][Math.floor(Math.random() * 3)] as 'consultation' | 'laboratory' | 'pharmacy';
          
          const items = services[invoiceType].filter(() => Math.random() > 0.5);
          if (items.length === 0) {
            items.push(services[invoiceType][0]);
          }
          
          const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
          const gstAmount = subtotal * 0.18;
          const totalAmount = subtotal + gstAmount;
          const paidAmount = isPaid ? totalAmount : isPartial ? totalAmount / 2 : 0;
          
          mockInvoices.push({
            invoiceNumber: `INV-2025${i.toString().padStart(5, '0')}`,
            invoiceDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            patientInfo: {
              id: patient.id,
              name: patient.name
            },
            doctorInfo: {
              id: doctor.id,
              name: doctor.name
            },
            items: items.map(item => ({
              ...item,
              amount: item.quantity * item.unitPrice,
              gstRate: 18
            })),
            subtotal,
            gstNumber: '29AADCB2230M1ZP',
            gstPercentage: 18,
            gstAmount,
            totalAmount,
            paidAmount,
            balanceDue: totalAmount - paidAmount,
            paymentMethod: 'Cash',
            paymentStatus: isPaid ? 'paid' : isPartial ? 'partial' : 'unpaid',
            termsAndConditions: '1. Payment is due at the time of service.\n2. Reports will be available within 24 hours of testing.\n3. Prescription refills require 48 hours notice.',
            hospitalName: 'City General Hospital',
            hospitalAddress: '123 Healthcare Avenue, Medical District\nBangalore, Karnataka 560001',
            hospitalContact: '(123) 456-7890',
            hospitalEmail: 'care@generalhospital.com',
            currency: '₹'
          });
        }
        
        setInvoices(mockInvoices);
        setIsLoadingInvoices(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setIsLoadingInvoices(false);
    }
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setInvoices([]);
    fetchInvoices();
  };
  
  const handleGenerateInvoice = (type: 'consultation' | 'laboratory' | 'pharmacy') => {
    setInvoiceType(type);
    setShowInvoiceGenerator(true);
  };
  
  const handleInvoiceSuccess = (invoice: InvoiceData) => {
    setInvoices([invoice, ...invoices]);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  const getFormattedDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/"
              className="mr-4 text-gray-600 hover:text-primary-600 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          </div>

          {/* If showing invoice generator, don't show the generate buttons */}
          {!showInvoiceGenerator && (
            <div className="mt-4 md:mt-0 space-x-3">
              <button
                onClick={() => handleGenerateInvoice('consultation')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Generate Consultation Invoice
              </button>
              <button
                onClick={() => handleGenerateInvoice('laboratory')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Generate Lab Invoice
              </button>
              <button
                onClick={() => handleGenerateInvoice('pharmacy')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Generate Pharmacy Invoice
              </button>
            </div>
          )}
        </div>
        
        {showInvoiceGenerator ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <InvoiceGenerator
              invoiceType={invoiceType}
              patientId={dummyPatients[0].id}
              patientName={dummyPatients[0].name}
              doctorId={dummyDoctors[0].id}
              doctorName={dummyDoctors[0].name}
              items={services[invoiceType]}
              onClose={() => setShowInvoiceGenerator(false)}
              onSuccess={handleInvoiceSuccess}
            />
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex space-x-2">
                  <Tab
                    label="Pending Invoices"
                    active={activeTab === 'pending'}
                    onClick={() => handleTabChange('pending')}
                  />
                  <Tab
                    label="Paid Invoices"
                    active={activeTab === 'paid'}
                    onClick={() => handleTabChange('paid')}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoadingInvoices ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : invoices.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                          No invoices found
                        </td>
                      </tr>
                    ) : (
                      invoices.map((invoice) => (
                        <tr key={invoice.invoiceNumber}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getFormattedDate(invoice.invoiceDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.patientInfo.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.doctorInfo?.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.currency} {invoice.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(invoice.paymentStatus)}`}>
                              {invoice.paymentStatus === 'paid' 
                                ? 'Paid' 
                                : invoice.paymentStatus === 'partial' 
                                  ? 'Partially Paid' 
                                  : 'Unpaid'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-primary-600 hover:text-primary-900 mr-4"
                              onClick={() => {
                                // In a real app, this would open the invoice viewer
                                alert(`View invoice: ${invoice.invoiceNumber}`);
                              }}
                            >
                              View
                            </button>
                            {invoice.paymentStatus !== 'paid' && (
                              <button
                                className="text-green-600 hover:text-green-900"
                                onClick={() => {
                                  // In a real app, this would mark the invoice as paid
                                  alert(`Mark as paid: ${invoice.invoiceNumber}`);
                                }}
                              >
                                Mark as Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}