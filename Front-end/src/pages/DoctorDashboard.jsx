import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DoctorSearchAndAdvice from '../components/DoctorSearchAndAdvice';
import api from '../utils/api';

// Demo advice data for showcase
const DEMO_ADVICE = [
  {
    _id: 'demo1',
    subject: 'নিয়মিত ব্যায়াম এবং বিশ্রাম',
    motherID: { FullName: 'সাবিনা খাতুন' },
    message: 'আপনার গর্ভাবস্থা ভালো চলছে। প্রতিদিন ৩০ মিনিট হাঁটুন এবং পর্যাপ্ত বিশ্রাম নিন। রক্তচাপ নিয়ন্ত্রণে রাখতে লবণ কম খান এবং সবুজ শাকসবজি বেশি খান।',
    priority: 'medium',
    adviceType: 'exercise',
    createdAt: '2026-01-14T10:30:00',
    isRead: true
  },
  {
    _id: 'demo2',
    subject: 'জরুরি রক্তচাপ পর্যবেক্ষণ',
    motherID: { FullName: 'রেহানা বেগম' },
    message: 'আপনার রক্তচাপ কিছুটা বেশি (১৫০/৯৫)। প্রতিদিন সকাল-সন্ধ্যা রক্তচাপ মাপুন এবং রেকর্ড রাখুন। যদি ১৬০/১০০ এর উপরে যায় তাহলে অবিলম্বে হাসপাতালে আসুন। নরমাল স্যালাইন খেতে পারেন।',
    priority: 'urgent',
    adviceType: 'emergency',
    createdAt: '2026-01-15T14:20:00',
    isRead: false
  },
  {
    _id: 'demo3',
    subject: 'পুষ্টিকর খাবার এবং আয়রন সাপ্লিমেন্ট',
    motherID: { FullName: 'নাজমা আক্তার' },
    message: 'রক্তে হিমোগ্লোবিন কম (৯.৫ গ্রা/ডেলি)। আয়রন ট্যাবলেট প্রতিদিন ১টি করে খান রাতে খাবারের পর। পালং শাক, কলিজা, ডিম, ডালিম বেশি খান। ভিটামিন সি যুক্ত ফল (লেবু, কমলা) খান আয়রন শোষণ বাড়াতে।',
    priority: 'high',
    adviceType: 'medication',
    createdAt: '2026-01-13T09:15:00',
    isRead: true
  },
  {
    _id: 'demo4',
    subject: 'ডায়াবেটিস নিয়ন্ত্রণ পরামর্শ',
    motherID: { FullName: 'ফাতেমা খাতুন' },
    message: 'আপনার রক্তে সুগার কিছুটা বেশি (১৩০ মিগ্রা/ডেলি)। খাবার তালিকা থেকে মিষ্টি, চিনি, ভাত কমিয়ে দিন। বেশি করে আঁশযুক্ত খাবার খান। প্রতিদিন হাঁটুন এবং ২ সপ্তাহ পর আবার টেস্ট করান।',
    priority: 'medium',
    adviceType: 'diet',
    createdAt: '2026-01-12T16:45:00',
    isRead: true
  },
  {
    _id: 'demo5',
    subject: 'আলট্রাসাউন্ড ফলোআপ',
    motherID: { FullName: 'শিরিনা আক্তার' },
    message: 'গর্ভের শিশুর বৃদ্ধি স্বাভাবিক। তবে এমনিওটিক ফ্লুইড সামান্য কম। প্রচুর পানি এবং তরল খাবার খান (দিনে কমপক্ষে ৩-৪ লিটার)। ২ সপ্তাহ পর পুনরায় আলট্রাসাউন্ড করাতে হবে পরীক্ষার জন্য।',
    priority: 'medium',
    adviceType: 'followup',
    createdAt: '2026-01-11T11:00:00',
    isRead: true
  }
];

// Demo appointments with patient data - sorted by risk level
const DEMO_APPOINTMENTS = [
  {
    _id: 'appt1',
    patientName: 'রেহানা বেগম',
    age: 28,
    pregnancyWeek: 32,
    bloodPressure: '150/95',
    weight: '68 কেজি',
    hemoglobin: '10.2 গ্রা/ডেলি',
    bloodSugar: '135 মিগ্রা/ডেলি',
    lastCheckup: '২০২৬-০১-১০',
    condition: 'উচ্চ ঝুঁকিপূর্ণ',
    riskLevel: 3,
    appointmentTime: '10:00 AM',
    notes: 'উচ্চ রক্তচাপ এবং ডায়াবেটিস',
    contactNumber: '০১৭১২-৩৪৫৬৭৮',
    address: 'জাফলং, গোয়াইনঘাট, সিলেট'
  },
  {
    _id: 'appt2',
    patientName: 'নাজমা আক্তার',
    age: 25,
    pregnancyWeek: 28,
    bloodPressure: '125/82',
    weight: '62 কেজি',
    hemoglobin: '9.5 গ্রা/ডেলি',
    bloodSugar: '95 মিগ্রা/ডেলি',
    lastCheckup: '২০২৬-০১-১২',
    condition: 'উচ্চ ঝুঁকিপূর্ণ',
    riskLevel: 3,
    appointmentTime: '10:30 AM',
    notes: 'রক্তে হিমোগ্লোবিন কম, অ্যানিমিয়া',
    contactNumber: '০১৮২৩-৪৫৬৭৮৯',
    address: 'বিছনাকান্দি, গোয়াইনঘাট, সিলেট'
  },
  {
    _id: 'appt3',
    patientName: 'ফাতেমা খাতুন',
    age: 30,
    pregnancyWeek: 24,
    bloodPressure: '135/88',
    weight: '70 কেজি',
    hemoglobin: '11.5 গ্রা/ডেলি',
    bloodSugar: '130 মিগ্রা/ডেলি',
    lastCheckup: '২০২৬-০১-০৮',
    condition: 'ঝুঁকিপূর্ণ',
    riskLevel: 2,
    appointmentTime: '11:00 AM',
    notes: 'ওজন বৃদ্ধি এবং রক্তচাপ সামান্য বেশি',
    contactNumber: '০১৯১২-৬৭৮৯০১',
    address: 'লালাখাল, জৈন্তাপুর, সিলেট'
  },
  {
    _id: 'appt4',
    patientName: 'শিরিনা আক্তার',
    age: 26,
    pregnancyWeek: 20,
    bloodPressure: '128/80',
    weight: '58 কেজি',
    hemoglobin: '10.8 গ্রা/ডেলি',
    bloodSugar: '98 মিগ্রা/ডেলি',
    lastCheckup: '২০২৬-০১-১৩',
    condition: 'ঝুঁকিপূর্ণ',
    riskLevel: 2,
    appointmentTime: '11:30 AM',
    notes: 'এমনিওটিক ফ্লুইড সামান্য কম',
    contactNumber: '০১৭৫৬-৮৯০১২৩',
    address: 'রাতারগুল, সিলেট সদর'
  },
  {
    _id: 'appt5',
    patientName: 'সাবিনা খাতুন',
    age: 24,
    pregnancyWeek: 18,
    bloodPressure: '118/75',
    weight: '60 কেজি',
    hemoglobin: '12.2 গ্রা/ডেলি',
    bloodSugar: '90 মিগ্রা/ডেলি',
    lastCheckup: '২০২৬-০১-১৪',
    condition: 'স্বাভাবিক',
    riskLevel: 1,
    appointmentTime: '12:00 PM',
    notes: 'সব স্বাভাবিক, নিয়মিত চেকআপ',
    contactNumber: '০১৬৮৯-১২৩৪৫৬',
    address: 'তামাবিল, গোয়াইনঘাট, সিলেট'
  },
  {
    _id: 'appt6',
    patientName: 'জরিনা বেগম',
    age: 27,
    pregnancyWeek: 16,
    bloodPressure: '115/72',
    weight: '57 কেজি',
    hemoglobin: '12.5 গ্রা/ডেলি',
    bloodSugar: '88 মিগ্রা/ডেলি',
    lastCheckup: '২০২৬-০১-১৪',
    condition: 'স্বাভাবিক',
    riskLevel: 1,
    appointmentTime: '2:00 PM',
    notes: 'স্বাস্থ্য ভালো, পরবর্তী মাসে চেকআপ',
    contactNumber: '০১৮৪৫-৬৭৮৯০১',
    address: 'পাঁচগাঁও, জাফলং, সিলেট'
  }
];

// Demo doctor profile data
const DEMO_DOCTOR_PROFILE = {
  fullName: 'ডা. মোহাম্মদ আব্দুল করিম',
  specialization: 'গাইনোকোলজিস্ট ও প্রসূতি বিশেষজ্ঞ',
  bmdc: 'এ-৪৫৬৭৮',
  education: 'এমবিবিএস, এফসিপিএস (গাইনি এন্ড অবস)',
  hospital: 'ওসমানী মেডিকেল কলেজ হাসপাতাল',
  department: 'প্রসূতি ও স্ত্রীরোগ বিভাগ',
  experience: '১৮ বছর',
  email: 'dr.karim@example.com',
  phone: '০১৭১২-৩৪৫৬৭৮',
  emergencyContact: '০১৮২৩-৪৫৬৭৮৯',
  address: 'হাউস নং: ২৫, রোড নং: ৭, সিলেট সদর, সিলেট',
  chamberAddress: 'পপুলার ডায়াগনস্টিক সেন্টার, জিন্দাবাজার, সিলেট',
  visitingHours: 'সকাল ১০:০০ AM - দুপুর ২:০০ PM, সন্ধ্যা ৫:০০ PM - রাত ৮:০০ PM',
  offDays: 'শুক্রবার',
  consultationFee: '১২০০ টাকা',
  achievements: [
    'সিলেট মেডিকেল কলেজ থেকে স্বর্ণপদকপ্রাপ্ত',
    'বাংলাদেশ মেডিকেল এসোসিয়েশন সদস্য',
    'জাতীয় মাতৃস্বাস্থ্য সম্মেলন ২০২৪ এ বক্তা',
    '২০০+ সফল সিজার অপারেশন'
  ],
  languages: ['বাংলা', 'ইংরেজি', 'হিন্দি'],
  expertise: ['উচ্চ ঝুঁকিপূর্ণ গর্ভাবস্থা', 'ইনফার্টিলিটি চিকিৎসা', 'মিনিম্যাল ইনভেসিভ সার্জারি', 'এন্ডোস্কোপিক সার্জারি']
};

/**
 * Doctor Dashboard
 * Dashboard for doctors to manage patients, send advice, and view records
 */
const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [adviceHistory, setAdviceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, search-advice, history, appointments
  const [currentPage, setCurrentPage] = useState('dashboard'); // dashboard, profile

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNavigation = (action) => {
    // Handle sidebar navigation
    if (action === 'profile') {
      setCurrentPage('profile');
    } else {
      setCurrentPage('dashboard');
      setActiveTab(action);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashResponse, historyResponse] = await Promise.all([
        api.getDoctorDashboard(),
        api.getDoctorAdviceHistory()
      ]);

      setDashboardData(dashResponse.data);
      
      // Always use demo data for showcase
      setAdviceHistory(DEMO_ADVICE);
      
      setError(null);
    } catch (err) {
      // Use demo data on error for showcase
      setAdviceHistory(DEMO_ADVICE);
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar userRole="doctor" onNavigate={handleNavigation} />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">ড্যাশবোর্ড লোড হচ্ছে...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar userRole="doctor" onNavigate={handleNavigation} />
        <main className="flex-1 p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            ত্রুটি: {error}
          </div>
        </main>
      </div>
    );
  }

  const totalPatients = dashboardData?.totalPatients || DEMO_APPOINTMENTS.length;
  const highRiskPatients = dashboardData?.highRiskPatients || DEMO_APPOINTMENTS.filter(a => a.condition === 'উচ্চ ঝুঁকিপূর্ণ').length;
  const todayAppointments = dashboardData?.todayAppointments || DEMO_APPOINTMENTS.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="doctor" onNavigate={handleNavigation} />
      
      <main className="flex-1 p-8">
        {/* Profile Page */}
        {currentPage === 'profile' && (
          <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">আমার প্রোফাইল</h1>
                <p className="text-gray-600">ব্যক্তিগত ও পেশাগত তথ্য</p>
              </div>
              <button
                onClick={() => handleNavigation('overview')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                ড্যাশবোর্ডে ফিরুন
              </button>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="card text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <span className="text-5xl font-bold">{DEMO_DOCTOR_PROFILE.fullName.split(' ')[1].charAt(0)}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{DEMO_DOCTOR_PROFILE.fullName}</h2>
                  <p className="text-primary-600 font-medium mb-4">{DEMO_DOCTOR_PROFILE.specialization}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="bg-blue-50 text-blue-700 py-2 px-3 rounded-lg">
                      <span className="font-medium">BMDC:</span> {DEMO_DOCTOR_PROFILE.bmdc}
                    </div>
                    <div className="bg-green-50 text-green-700 py-2 px-3 rounded-lg">
                      <span className="font-medium">অভিজ্ঞতা:</span> {DEMO_DOCTOR_PROFILE.experience}
                    </div>
                    <div className="bg-purple-50 text-purple-700 py-2 px-3 rounded-lg">
                      <span className="font-medium">পরামর্শ ফি:</span> {DEMO_DOCTOR_PROFILE.consultationFee}
                    </div>
                  </div>

                  <button className="w-full mt-6 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    প্রোফাইল সম্পাদনা করুন
                  </button>
                </div>

                {/* Languages */}
                <div className="card mt-4">
                  <h3 className="font-bold text-gray-900 mb-3">ভাষা দক্ষতা</h3>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_DOCTOR_PROFILE.languages.map((lang, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Professional Information */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    পেশাগত তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">শিক্ষাগত যোগ্যতা</label>
                      <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.education}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">হাসপাতাল</label>
                      <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.hospital}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">বিভাগ</label>
                      <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.department}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">চেম্বার ঠিকানা</label>
                      <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.chamberAddress}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">সাক্ষাতের সময়</label>
                      <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.visitingHours}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">ছুটির দিন</label>
                      <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.offDays}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    যোগাযোগের তথ্য
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <div>
                        <label className="text-sm text-gray-500">ইমেইল</label>
                        <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <label className="text-sm text-gray-500">ফোন নম্বর</label>
                        <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <label className="text-sm text-gray-500">জরুরি যোগাযোগ</label>
                        <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.emergencyContact}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <label className="text-sm text-gray-500">ঠিকানা</label>
                        <p className="font-semibold text-gray-900">{DEMO_DOCTOR_PROFILE.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expertise */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    বিশেষ দক্ষতা
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DEMO_DOCTOR_PROFILE.expertise.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-900 font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    অর্জন ও সম্মাননা
                  </h3>
                  <ul className="space-y-2">
                    {DEMO_DOCTOR_PROFILE.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {currentPage === 'dashboard' && (
          <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ডাক্তার ড্যাশবোর্ড</h1>
          <p className="text-gray-600">আজ: {new Date().toLocaleDateString('bn-BD')}</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              সংক্ষিপ্ত বিবরণ
            </button>
            <button
              onClick={() => setActiveTab('search-advice')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search-advice'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              মা খুঁজুন এবং পরামর্শ দিন
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              পরামর্শের ইতিহাস ({adviceHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              অ্যাপয়েন্টমেন্ট ({DEMO_APPOINTMENTS.length})
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Patients */}
              <div className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">মোট রোগী</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold">{totalPatients}</div>
                <p className="mt-2 text-sm opacity-90">সক্রিয় রোগী</p>
              </div>

              {/* High Risk Patients */}
              <div className="card bg-gradient-to-br from-red-500 to-pink-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">উচ্চ ঝুঁকি</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-4xl font-bold">{highRiskPatients}</div>
                <p className="mt-2 text-sm opacity-90">বিশেষ নজরদারি প্রয়োজন</p>
              </div>

              {/* Today's Appointments */}
              <div className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">আজকের অ্যাপয়েন্টমেন্ট</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-4xl font-bold">{todayAppointments}</div>
                <p className="mt-2 text-sm opacity-90">নির্ধারিত পরামর্শ</p>
              </div>
            </div>

            {/* Recent Advice Sent */}
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">সাম্প্রতিক পরামর্শ</h2>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  সব দেখুন →
                </button>
              </div>
              {adviceHistory && adviceHistory.length > 0 ? (
                <div className="space-y-3">
                  {adviceHistory.slice(0, 5).map((advice) => (
                    <div key={advice._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{advice.subject}</h3>
                          <p className="text-sm text-gray-600">
                            To: {advice.motherID?.FullName}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          advice.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          advice.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          advice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {advice.priority === 'urgent' ? 'জরুরি' : advice.priority === 'high' ? 'উচ্চ' : advice.priority === 'medium' ? 'মাঝারি' : 'নিম্ন'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">{advice.message}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {advice.adviceType === 'general' ? 'সাধারণ' : advice.adviceType === 'medication' ? 'ঔষধ' : advice.adviceType === 'diet' ? 'খাদ্য' : advice.adviceType === 'exercise' ? 'ব্যায়াম' : advice.adviceType === 'emergency' ? 'জরুরি' : 'ফলোআপ'}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{new Date(advice.createdAt).toLocaleDateString('bn-BD')}</span>
                          <span className={advice.isRead ? 'text-green-600' : 'text-gray-400'}>
                            {advice.isRead ? '✓ পড়া হয়েছে' : '○ পড়া হয়নি'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">এখনো কোনো পরামর্শ পাঠানো হয়নি</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveTab('search-advice')}
                className="card hover:shadow-xl transition-shadow flex items-center justify-center space-x-3 py-6"
              >
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                </svg>
                <span className="font-semibold text-gray-900">মা খুঁজুন</span>
              </button>
              
              <button className="card hover:shadow-xl transition-shadow flex items-center justify-center space-x-3 py-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-gray-900">অ্যাপয়েন্টমেন্ট দেখুন</span>
              </button>
              
              <button className="card hover:shadow-xl transition-shadow flex items-center justify-center space-x-3 py-6">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <span className="font-semibold text-gray-900">রিপোর্ট দেখুন</span>
              </button>
            </div>
          </>
        )}

        {/* Search & Advise Tab */}
        {activeTab === 'search-advice' && (
          <DoctorSearchAndAdvice />
        )}

        {/* Advice History Tab */}
        {activeTab === 'history' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              পরামর্শের ইতিহাস ({adviceHistory.length})
            </h2>
            {adviceHistory.length > 0 ? (
              <div className="space-y-3">
                {adviceHistory.map((advice) => (
                  <div key={advice._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{advice.subject}</h3>
                        <p className="text-sm text-gray-600">
                          প্রাপক: {advice.motherID?.FullName} ({advice.motherID?.Email})
                        </p>
                        <p className="text-sm text-gray-600">
                          ফোন: {advice.motherID?.PhoneNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded mb-2 inline-block ${
                          advice.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          advice.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          advice.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {advice.priority === 'urgent' ? 'জরুরি' : advice.priority === 'high' ? 'উচ্চ' : advice.priority === 'medium' ? 'মাঝারি' : 'নিম্ন'}
                        </span>
                        <p className="text-xs text-gray-500">
                          {new Date(advice.createdAt).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{advice.message}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {advice.adviceType === 'general' ? 'সাধারণ' : advice.adviceType === 'medication' ? 'ঔষধ' : advice.adviceType === 'diet' ? 'খাদ্য' : advice.adviceType === 'exercise' ? 'ব্যায়াম' : advice.adviceType === 'emergency' ? 'জরুরি' : 'ফলোআপ'}
                        </span>
                        {advice.followupRequired && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            ফলোআপ: {new Date(advice.followupDate).toLocaleDateString('bn-BD')}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${advice.isRead ? 'text-green-600' : 'text-gray-400'}`}>
                        {advice.isRead ? (
                          <>✓ {new Date(advice.readAt).toLocaleDateString('bn-BD')} তে পড়া হয়েছে</>
                        ) : (
                          '○ এখনো পড়া হয়নি'
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <p>এখনো কোনো পরামর্শ পাঠানো হয়নি</p>
                <button
                  onClick={() => setActiveTab('search-advice')}
                  className="btn-primary mt-4"
                >
                  মাদের পরামর্শ দেওয়া শুরু করুন
                </button>
              </div>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">আজকের অ্যাপয়েন্টমেন্ট</h2>
              <p className="text-gray-600">আজকের তারিখ: {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-sm text-gray-500 mt-1">মোট রোগী: {DEMO_APPOINTMENTS.length} জন</p>
            </div>

            {/* Filter Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">উচ্চ ঝুঁকিপূর্ণ</p>
                    <p className="text-2xl font-bold text-red-700">
                      {DEMO_APPOINTMENTS.filter(a => a.condition === 'উচ্চ ঝুঁকিপূর্ণ').length}
                    </p>
                  </div>
                  <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">ঝুঁকিপূর্ণ</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {DEMO_APPOINTMENTS.filter(a => a.condition === 'ঝুঁকিপূর্ণ').length}
                    </p>
                  </div>
                  <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">স্বাভাবিক</p>
                    <p className="text-2xl font-bold text-green-700">
                      {DEMO_APPOINTMENTS.filter(a => a.condition === 'স্বাভাবিক').length}
                    </p>
                  </div>
                  <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Patient Cards - Sorted by Risk Level */}
            <div className="space-y-4">
              {DEMO_APPOINTMENTS.sort((a, b) => b.riskLevel - a.riskLevel).map((appointment) => (
                <div 
                  key={appointment._id} 
                  className={`card hover:shadow-lg transition-all border-l-4 ${
                    appointment.condition === 'উচ্চ ঝুঁকিপূর্ণ' 
                      ? 'border-l-red-500 bg-red-50/30' 
                      : appointment.condition === 'ঝুঁকিপূর্ণ' 
                      ? 'border-l-yellow-500 bg-yellow-50/30' 
                      : 'border-l-green-500 bg-green-50/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Patient Avatar */}
                    <div className="flex-shrink-0">
                      <div className={`w-24 h-24 rounded-xl flex items-center justify-center text-white ${
                        appointment.condition === 'উচ্চ ঝুঁকিপূর্ণ' 
                          ? 'bg-gradient-to-br from-red-500 to-red-600' 
                          : appointment.condition === 'ঝুঁকিপূর্ণ' 
                          ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' 
                          : 'bg-gradient-to-br from-green-500 to-green-600'
                      }`}>
                        <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Patient Information */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{appointment.patientName}</h3>
                          <p className="text-gray-600">বয়স: {appointment.age} বছর | গর্ভাবস্থা: {appointment.pregnancyWeek} সপ্তাহ</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            appointment.condition === 'উচ্চ ঝুঁকিপূর্ণ' 
                              ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                              : appointment.condition === 'ঝুঁকিপূর্ণ' 
                              ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' 
                              : 'bg-green-100 text-green-800 border-2 border-green-300'
                          }`}>
                            {appointment.condition}
                          </span>
                          <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                            🕐 {appointment.appointmentTime}
                          </span>
                        </div>
                      </div>

                      {/* Health Summary */}
                      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          স্বাস্থ্য সংক্ষিপ্ত বিবরণ
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">রক্তচাপ</p>
                            <p className={`font-semibold ${
                              parseInt(appointment.bloodPressure.split('/')[0]) > 140 
                                ? 'text-red-600' 
                                : parseInt(appointment.bloodPressure.split('/')[0]) > 130 
                                ? 'text-yellow-600' 
                                : 'text-green-600'
                            }`}>
                              {appointment.bloodPressure}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">ওজন</p>
                            <p className="font-semibold text-gray-900">{appointment.weight}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">হিমোগ্লোবিন</p>
                            <p className={`font-semibold ${
                              parseFloat(appointment.hemoglobin) < 10 
                                ? 'text-red-600' 
                                : parseFloat(appointment.hemoglobin) < 11 
                                ? 'text-yellow-600' 
                                : 'text-green-600'
                            }`}>
                              {appointment.hemoglobin}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">রক্তে সুগার</p>
                            <p className={`font-semibold ${
                              parseFloat(appointment.bloodSugar) > 125 
                                ? 'text-red-600' 
                                : parseFloat(appointment.bloodSugar) > 110 
                                ? 'text-yellow-600' 
                                : 'text-green-600'
                            }`}>
                              {appointment.bloodSugar}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Special Notes */}
                      {appointment.notes && (
                        <div className={`border-l-4 p-3 rounded mb-4 ${
                          appointment.condition === 'উচ্চ ঝুঁকিপূর্ণ' 
                            ? 'bg-red-50 border-red-400' 
                            : appointment.condition === 'ঝুঁকিপূর্ণ' 
                            ? 'bg-yellow-50 border-yellow-400' 
                            : 'bg-blue-50 border-blue-400'
                        }`}>
                          <p className="text-sm font-medium text-gray-700">
                            <span className="font-bold">বিশেষ নোট:</span> {appointment.notes}
                          </p>
                        </div>
                      )}

                      {/* Contact & Last Checkup */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {appointment.contactNumber}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {appointment.address}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          শেষ চেকআপ: {appointment.lastCheckup}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button className="flex-1 min-w-[200px] bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          চেকআপ শুরু করুন
                        </button>
                        <button className="flex-1 min-w-[180px] border border-primary-600 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors font-medium flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          ইতিহাস দেখুন
                        </button>
                        <button 
                          onClick={() => setActiveTab('search-advice')}
                          className="flex-1 min-w-[180px] border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          পরামর্শ দিন
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
