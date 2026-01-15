import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DoctorAdviceList from '../components/DoctorAdviceList';
import HealthUpdatesList from '../components/HealthUpdatesList';
import HealthTools from '../components/HealthTools';
import HealthTipsCard from '../components/HealthTipsCard';
import ProfileMenu from '../components/ProfileMenu';
import PregnancyProfileView from '../components/PregnancyProfileView';
import BabyProfileForm from '../components/BabyProfileForm';
import BabyProfileView from '../components/BabyProfileView';
import PregnancyCalculator from '../components/PregnancyCalculator';
import PregnancyTracker from './PregnancyTracker';
import NutritionTracker from './NutritionTracker';
import VaccineTracker from '../components/VaccineTracker/VaccineTracker';
import BabyVaccineTracker from '../components/BabyVaccineTracker';
import KickCounter from '../components/KickCounter';
import KickCounterHistory from '../components/KickCounterHistory';
import HealthArticles from './HealthArticles';
import { useAuth } from '../utils/AuthContext';
import api from '../utils/api';

// Demo appointments with doctors data
const DEMO_APPOINTMENTS = [
  {
    _id: 'apt1',
    doctorName: 'ডা. সাবিনা আক্তার',
    specialization: 'গাইনোকোলজিস্ট ও প্রসূতি বিশেষজ্ঞ',
    hospital: 'ওসমানী মেডিকেল কলেজ হাসপাতাল, সিলেট',
    location: 'সিলেট সদর, সিলেট',
    phone: '০১৭১২-৩৪৫৬৭৮',
    rating: 4.8,
    reviews: 256,
    experience: '১৫ বছর',
    appointmentDate: '2026-01-18T10:00:00',
    status: 'confirmed',
    consultationType: 'নিয়মিত চেকআপ',
    fees: '১২০০ টাকা',
    notes: 'গর্ভাবস্থার ২৪ সপ্তাহের চেকআপ এবং আলট্রাসাউন্ড'
  },
  {
    _id: 'apt2',
    doctorName: 'ডা. মোহাম্মদ রহিম',
    specialization: 'প্রসূতি ও স্ত্রীরোগ বিশেষজ্ঞ',
    hospital: 'জাফলং হেলথ কমপ্লেক্স',
    location: 'জাফলং, গোয়াইনঘাট, সিলেট',
    phone: '০১৮১৫-৯৮৭৬৫৪',
    rating: 4.6,
    reviews: 189,
    experience: '১২ বছর',
    appointmentDate: '2026-01-20T15:30:00',
    status: 'pending',
    consultationType: 'ফলোআপ পরামর্শ',
    fees: '৮০০ টাকা',
    notes: 'রক্তচাপ এবং ডায়াবেটিস টেস্ট রিপোর্ট নিয়ে আসুন'
  },
  {
    _id: 'apt3',
    doctorName: 'ডা. ফারহানা ইসলাম',
    specialization: 'মাতৃস্বাস্থ্য বিশেষজ্ঞ',
    hospital: 'মাউন্ট আদেন হাসপাতাল, সিলেট',
    location: 'আম্বরখানা, সিলেট',
    phone: '০১৯২৩-৪৫৬৭৮৯',
    rating: 4.9,
    reviews: 342,
    experience: '১৮ বছর',
    appointmentDate: '2026-01-25T11:00:00',
    status: 'confirmed',
    consultationType: 'বিশেষ পরামর্শ',
    fees: '১৫০০ টাকা',
    notes: 'উচ্চ ঝুঁকিপূর্ণ গর্ভাবস্থার বিশেষ পরামর্শ'
  },
  {
    _id: 'apt4',
    doctorName: 'ডা. নাজমুল হক',
    specialization: 'আলট্রাসনোগ্রাফি বিশেষজ্ঞ',
    hospital: 'লালাখাল ডায়াগনস্টিক সেন্টার',
    location: 'লালাখাল, জৈন্তাপুর, সিলেট',
    phone: '০১৭৩৪-৮৭৬৫৪৩',
    rating: 4.7,
    reviews: 178,
    experience: '১০ বছর',
    appointmentDate: '2026-01-22T09:00:00',
    status: 'confirmed',
    consultationType: 'আলট্রাসাউন্ড স্ক্যান',
    fees: '২০০০ টাকা',
    notes: '৪ডি আলট্রাসাউন্ড এবং শিশুর স্বাস্থ্য পরীক্ষা'
  },
  {
    _id: 'apt5',
    doctorName: 'ডা. তাসনিম জাহান',
    specialization: 'নিউট্রিশন ও ডায়েট কনসালট্যান্ট',
    hospital: 'রাতারগুল ওয়েলনেস সেন্টার',
    location: 'রাতারগুল, সিলেট সদর',
    phone: '০১৬৮৮-৭৬৫৪৩২',
    rating: 4.5,
    reviews: 134,
    experience: '৮ বছর',
    appointmentDate: '2026-01-28T14:00:00',
    status: 'pending',
    consultationType: 'পুষ্টি পরামর্শ',
    fees: '৬০০ টাকা',
    notes: 'গর্ভকালীন খাদ্য তালিকা এবং পুষ্টি পরিকল্পনা'
  }
];

/**
 * Mother Dashboard
 * Main dashboard for pregnant mothers with pregnancy tracking, appointments, and health info
 */
const MotherDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [maternalRecord, setMaternalRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, advice, health-updates, checkups, health-problems
  const [currentPage, setCurrentPage] = useState('dashboard'); // dashboard, profile, pregnancy, nutrition, vaccine, vaccine-schedule, reports, child-dashboard
  const [profileView, setProfileView] = useState('menu'); // menu, pregnancy, baby, personal, healthcare, createBaby
  const [selectedBaby, setSelectedBaby] = useState(null); // Selected baby for viewing
  const [reportView, setReportView] = useState('menu'); // menu, add, view
  const [childActiveTab, setChildActiveTab] = useState('overview'); // Child dashboard tabs
  const [showNotifications, setShowNotifications] = useState(true); // Notification box visibility

  // Demo child data
  const demoChild = {
    name: 'সাফিয়া খান',
    age: '৮ মাস',
    birthDate: '২০ মে, ২০২৫',
    gender: 'কন্যা',
    weight: '৮.৫ কেজি',
    height: '৬৮ সেমি',
    bloodGroup: 'O+',
    growthStatus: 'স্বাভাবিক',
    lastCheckup: '১০ জানুয়ারি, ২০২৬'
  };

  const handleNavigation = async (page) => {
    if (page === 'dashboard') {
      setCurrentPage('dashboard');
      setActiveTab('overview');
      setProfileView('menu');
      setChildActiveTab('overview');
    } else if (page === 'profile') {
      setCurrentPage('profile');
      setProfileView('menu');
      // Fetch profile data if not already loaded
      if (!profileData) {
        await fetchProfileData();
      }
    } else if (page === 'pregnancy') {
      setCurrentPage('pregnancy');
    } else if (page === 'nutrition') {
      setCurrentPage('nutrition');
    } else if (page === 'vaccine') {
      setCurrentPage('vaccine');
    } else if (page === 'vaccine-schedule') {
      setCurrentPage('vaccine-schedule');
    } else if (page === 'health-articles') {
      setCurrentPage('health-articles');
    } else if (page === 'reports') {
      setCurrentPage('reports');
    } else if (page === 'child-dashboard') {
      setCurrentPage('child-dashboard');
      setChildActiveTab('overview');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleProfileNavigation = async (view, id = null) => {
    setProfileView(view);
    if (!profileData && view !== 'menu') {
      await fetchProfileData();
    }
  };

  const handlePregnancyDateSubmit = async (data) => {
    try {
      // Calculate dates based on method
      let lmpDate, edd;
      
      if (data.method === 'edd') {
        // EDD provided, calculate LMP (subtract 280 days)
        edd = new Date(data.date);
        lmpDate = new Date(edd);
        lmpDate.setDate(lmpDate.getDate() - 280);
      } else {
        // LMP provided, calculate EDD (add 280 days)
        lmpDate = new Date(data.date);
        edd = new Date(lmpDate);
        edd.setDate(edd.getDate() + 280);
      }

      // Create or update maternal record
      const maternalData = {
        lmpDate: lmpDate.toISOString(),
        edd: edd.toISOString(),
        parity: 0 // First pregnancy by default
      };

      // Call API to create/update maternal record
      await api.createMaternalRecord(maternalData);

      // Refresh data
      await fetchDashboardData();
      await fetchProfileData();

      // Show pregnancy profile
      setProfileView('pregnancy');
    } catch (error) {
      console.error('Error saving pregnancy data:', error);
      alert('গর্ভাবস্থার তথ্য সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handleBabySubmit = async (babyData) => {
    try {
      // Register the child
      const childPayload = {
        name: babyData.name,
        gender: babyData.gender.charAt(0).toUpperCase() + babyData.gender.slice(1), // Capitalize: male -> Male, female -> Female
        dob: babyData.birthDate,
        weight: parseFloat(babyData.weight),
        deliveryType: babyData.deliveryType.charAt(0).toUpperCase() + babyData.deliveryType.slice(1), // Capitalize: normal -> Normal, cesarean -> Cesarean
        bloodGroup: babyData.bloodGroup
      };

      await api.registerChild(childPayload);

      // Delete maternal record since baby is born
      if (maternalRecord) {
        await api.deleteMaternalRecord();
        setMaternalRecord(null);
      }

      // Refresh dashboard data
      await fetchDashboardData();

      // Navigate back to profile menu
      setProfileView('menu');

      // Show success message
      alert('শিশুর তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (error) {
      console.error('Error registering baby:', error);
      alert('শিশুর তথ্য সংরক্ষণে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handleDeletePregnancy = async () => {
    try {
      // Call API to delete maternal record
      await api.deleteMaternalRecord();

      // Clear local state
      setMaternalRecord(null);

      // Refresh data
      await fetchDashboardData();
      
      // Navigate back to menu
      setProfileView('menu');
      
      alert('গর্ভাবস্থার প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে।');
    } catch (error) {
      console.error('Error deleting pregnancy profile:', error);
      alert('প্রোফাইল মুছতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handleDeleteBaby = async () => {
    try {
      if (!selectedBaby?.id) {
        throw new Error('No baby selected');
      }

      // Call API to delete child record
      await api.deleteChild(selectedBaby.id);

      // Clear selected baby
      setSelectedBaby(null);

      // Refresh data
      await fetchDashboardData();
      
      // Navigate back to menu
      setProfileView('menu');
      
      alert('শিশুর তথ্য সফলভাবে মুছে ফেলা হয়েছে।');
    } catch (error) {
      console.error('Error deleting baby profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileResponse, maternalResponse] = await Promise.all([
        api.getMotherProfile(),
        api.getMaternalRecord().catch(() => ({ data: null })) // Don't fail if no maternal record yet
      ]);
      setProfileData(profileResponse.data);
      setMaternalRecord(maternalResponse.data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      // Don't show error, just use data from AuthContext as fallback
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.getMotherDashboard();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar userRole="mother" onNavigate={handleNavigation} />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">আপনার ড্যাশবোর্ড লোড হচ্ছে...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar userRole="mother" onNavigate={handleNavigation} />
        <main className="flex-1 p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            ত্রুটি: {error}
          </div>
        </main>
      </div>
    );
  }

  const pregnancyWeek = dashboardData?.pregnancyWeek || 0;
  const nextAppointment = dashboardData?.appointments?.[0];
  const vaccinesDue = dashboardData?.vaccinesDue || 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="mother" onNavigate={handleNavigation} />
      
      <main className="flex-1 p-8">
        {/* Important Notifications - Fixed Top Right */}
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${showNotifications ? 'w-96' : 'w-auto'}`}>
          {showNotifications ? (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-white font-bold text-lg">জরুরি বিজ্ঞপ্তি</h3>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                  title="মিনিমাইজ করুন"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
              </div>

              {/* Notifications Content */}
              <div className="p-4 max-h-96 overflow-y-auto space-y-3">
                {/* Alert 1 - High Priority */}
                <div className="bg-white border-l-4 border-red-600 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-red-900">অতি জরুরি</h4>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">উচ্চ অগ্রাধিকার</span>
                      </div>
                      <p className="text-gray-800 text-sm mb-2 leading-relaxed">
                        আপনার রক্তচাপ স্বাভাবিকের চেয়ে বেশি। <span className="font-semibold text-red-700">অতি দ্রুত চিকিৎসকের সাথে যোগাযোগ করুন।</span>
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>২ ঘন্টা আগে</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert 2 - Medium Priority */}
                <div className="bg-white border-l-4 border-orange-500 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-orange-900">সাপ্তাহিক চেকআপ</h4>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">মাঝারি</span>
                      </div>
                      <p className="text-gray-800 text-sm mb-2 leading-relaxed">
                        আগামীকাল আপনার সাপ্তাহিক চেকআপ। মিডওয়াইফের সাথে দেখা করতে ভুলবেন না।
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>৫ ঘন্টা আগে</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert 3 - Information */}
                <div className="bg-white border-l-4 border-blue-500 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-blue-900">নতুন পরামর্শ</h4>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">তথ্য</span>
                      </div>
                      <p className="text-gray-800 text-sm mb-2 leading-relaxed">
                        ডা. সাবিনা আক্তার আপনার জন্য নতুন স্বাস্থ্য পরামর্শ দিয়েছেন।
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>১ দিন আগে</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert 4 - Reminder */}
                <div className="bg-white border-l-4 border-purple-500 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-purple-900">ওষুধের সময়</h4>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">রিমাইন্ডার</span>
                      </div>
                      <p className="text-gray-800 text-sm mb-2 leading-relaxed">
                        আয়রন ট্যাবলেট খাওয়ার সময় হয়েছে। খাবারের পর নিয়মিত খান।
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>এখনই</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-1">
                  <span>সকল বিজ্ঞপ্তি দেখুন</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNotifications(true)}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full p-3 shadow-2xl hover:shadow-xl transition-all hover:scale-110 relative"
              title="বিজ্ঞপ্তি দেখুন"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-red-900 animate-pulse">
                4
              </span>
            </button>
          )}
        </div>

        {currentPage === 'dashboard' && (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">আপনার ড্যাশবোর্ডে স্বাগতম!</h1>
              <p className="text-gray-600">আপনার গর্ভাবস্থা এবং স্বাস্থ্য আপডেট ট্র্যাক করুন</p>
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
              onClick={() => setActiveTab('advice')}
              className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                activeTab === 'advice'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ডাক্তারের পরামর্শ
              {dashboardData?.doctorAdvice?.some(a => !a.isRead) && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-2 h-2 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('health-updates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'health-updates'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              স্বাস্থ্য আপডেট
            </button>
            <button
              onClick={() => setActiveTab('checkups')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'checkups'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              অ্যাপয়েন্টমেন্ট
            </button>
            <button
              onClick={() => setActiveTab('health-problems')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'health-problems'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              সাধারণ স্বাস্থ্য সমস্যা
            </button>
            <button
              onClick={() => setActiveTab('family-planning')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'family-planning'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              পরিবার পরিকল্পনা
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              রিপোর্ট
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* NOTE: tracker is accessible from the sidebar — no extra dashboard button */}
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Pregnancy Week */}
              <div className="card bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">গর্ভাবস্থার সপ্তাহ</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-4xl font-bold mb-2">{pregnancyWeek} সপ্তাহ</div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div className="bg-white rounded-full h-2" style={{ width: `${(pregnancyWeek / 40) * 100}%` }}></div>
                </div>
                <p className="mt-2 text-sm opacity-90">৪০ সপ্তাহের মধ্যে</p>
              </div>

              {/* Next Appointment */}
              <div className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">পরবর্তী অ্যাপয়েন্টমেন্ট</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                {nextAppointment ? (
                  <>
                    <div className="text-2xl font-bold mb-1">
                      {new Date(nextAppointment.appointmentDate).toLocaleDateString('bn-BD')}
                    </div>
                    <p className="text-sm opacity-90">
                      ডা. {nextAppointment.doctorID?.FullName} এর সাথে
                    </p>
                  </>
                ) : (
                  <p className="text-sm">কোনো আসন্ন অ্যাপয়েন্টমেন্ট নেই</p>
                )}
              </div>

              {/* Vaccines Due */}
              <div className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">টিকা প্রয়োজন</h3>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-4xl font-bold mb-1">{vaccinesDue}</div>
                <p className="text-sm opacity-90">জন্মের পর নবজাতকের জন্য</p>
              </div>
            </div>

            {/* Child Health Tracker Card */}
            <div className="mt-6">
              <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white cursor-pointer hover:shadow-xl transition-all"
                onClick={() => handleNavigation('child-dashboard')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">শিশুর স্বাস্থ্য ট্র্যাকার</h3>
                      <p className="opacity-90">আপনার শিশুর বৃদ্ধি এবং স্বাস্থ্য পর্যবেক্ষণ করুন</p>
                    </div>
                  </div>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Recent Doctor Advice */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">সাম্প্রতিক ডাক্তারের পরামর্শ</h2>
                  <button
                    onClick={() => setActiveTab('advice')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    সব দেখুন →
                  </button>
                </div>
                <DoctorAdviceList limit={3} />
              </div>

              {/* Recent Health Updates */}
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">সাম্প্রতিক স্বাস্থ্য আপডেট</h2>
                  <button
                    onClick={() => setActiveTab('health-updates')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    সব দেখুন →
                  </button>
                </div>
                <HealthUpdatesList limit={3} />
              </div>
            </div>

            {/* Healthcare Providers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Assigned Doctor */}
              {dashboardData?.assignedDoctor && (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">আপনার ডাক্তার</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        ডা. {dashboardData.assignedDoctor.FullName}
                      </h3>
                      <p className="text-sm text-gray-600">{dashboardData.assignedDoctor.Email}</p>
                      <p className="text-sm text-gray-600">{dashboardData.assignedDoctor.PhoneNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Assigned Midwife */}
              {dashboardData?.assignedMidwife && (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">আপনার মিডওয়াইফ</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {dashboardData.assignedMidwife.FullName}
                      </h3>
                      <p className="text-sm text-gray-600">{dashboardData.assignedMidwife.Email}</p>
                      <p className="text-sm text-gray-600">{dashboardData.assignedMidwife.PhoneNumber}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Checkups */}
            {dashboardData?.upcomingCheckups && dashboardData.upcomingCheckups.length > 0 && (
              <div className="card mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">আসন্ন চেকআপ</h2>
                  <button
                    onClick={() => setActiveTab('checkups')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    সব দেখুন →
                  </button>
                </div>
                <div className="space-y-3">
                  {dashboardData.upcomingCheckups.slice(0, 3).map((checkup) => (
                    <div key={checkup._id} className="border-l-4 border-green-500 pl-4 py-3 bg-green-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{checkup.checkupType}</h3>
                          <p className="text-sm text-gray-600">
                            {checkup.midwifeID?.FullName} এর সাথে
                          </p>
                        </div>
                        <span className="text-sm font-medium text-green-700">
                          {new Date(checkup.scheduledDate).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </>
        )}

        {/* Doctor Advice Tab */}
        {activeTab === 'advice' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">সমস্ত ডাক্তারের পরামর্শ</h2>
            <DoctorAdviceList />
          </div>
        )}

        {/* Health Updates Tab */}
        {activeTab === 'health-updates' && (
          <div className="space-y-6">
            <div className="card">
              <HealthTools />
            </div>
            <div className="card">
              <HealthTipsCard />
            </div>
          </div>
        )}

        {/* Checkups Tab - Now Appointments */}
        {activeTab === 'checkups' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">আমার অ্যাপয়েন্টমেন্ট</h2>
              <p className="text-gray-600">ডাক্তারদের সাথে নির্ধারিত সাক্ষাৎ</p>
            </div>

            <div className="space-y-4">
              {DEMO_APPOINTMENTS.map((appointment) => (
                <div key={appointment._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Doctor Info */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{appointment.doctorName}</h3>
                          <p className="text-primary-600 font-medium">{appointment.specialization}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status === 'confirmed' ? '✓ নিশ্চিত' : '⏱ অপেক্ষমাণ'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        {/* Hospital & Location */}
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{appointment.hospital}</p>
                            <p className="text-xs text-gray-500">{appointment.location}</p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <p className="text-sm text-gray-600">{appointment.phone}</p>
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(appointment.appointmentDate).toLocaleDateString('bn-BD', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              সময়: {new Date(appointment.appointmentDate).toLocaleTimeString('bn-BD', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Rating & Experience */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-900">{appointment.rating}</span>
                            <span className="text-xs text-gray-500">({appointment.reviews} রিভিউ)</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            অভিজ্ঞতা: {appointment.experience}
                          </div>
                        </div>
                      </div>

                      {/* Consultation Type & Fees */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          {appointment.consultationType}
                        </span>
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                          ফি: {appointment.fees}
                        </span>
                      </div>

                      {/* Notes */}
                      {appointment.notes && (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">নোট:</span> {appointment.notes}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                          রিমাইন্ডার সেট করুন
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                          পুনঃনির্ধারণ করুন
                        </button>
                        <button className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium">
                          বাতিল
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Appointment Button */}
            <div className="mt-6">
              <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>নতুন অ্যাপয়েন্টমেন্ট বুক করুন</span>
              </button>
            </div>
          </div>
        )}

        {/* Health Problems Tab */}
        {activeTab === 'health-problems' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">সাধারণ স্বাস্থ্য সমস্যা</h2>
            <HealthArticles onBack={() => setActiveTab('overview')} />
          </div>
        )}

        {/* Family Planning Tab */}
        {activeTab === 'family-planning' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">পরিবার পরিকল্পনা</h2>
              <p className="text-gray-600">সঠিক জ্ঞান দিয়ে আপনার পরিবারের ভবিষ্যৎ পরিকল্পনা করুন</p>
            </div>

            {/* Demo Family Planning Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Article 1 */}
              <div className="card hover:shadow-xl transition-all">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">পরিবার পরিকল্পনা কী এবং কেন প্রয়োজন?</h3>
                    <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">মূল তথ্য</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  পরিবার পরিকল্পনা হলো দম্পতির সিদ্ধান্ত নেওয়ার প্রক্রিয়া কখন এবং কতজন সন্তান নেবেন। এটি মা ও শিশুর স্বাস্থ্য সুরক্ষা, পরিবারের আর্থিক স্থিতিশীলতা এবং শিক্ষার মানোন্নয়নে সহায়ক।
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">মূল সুবিধা:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      মাতৃ ও শিশু মৃত্যুহার হ্রাস
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      দুই সন্তানের মধ্যে যথাযথ ব্যবধান
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      পরিবারের আর্থিক সচ্ছলতা
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      নারীর শিক্ষা ও ক্যারিয়ার গঠন
                    </li>
                  </ul>
                </div>
              </div>

              {/* Article 2 */}
              <div className="card hover:shadow-xl transition-all">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">জন্মনিয়ন্ত্রণ পদ্ধতি সমূহ</h3>
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">গুরুত্বপূর্ণ</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  বিভিন্ন ধরনের নিরাপদ এবং কার্যকর জন্মনিয়ন্ত্রণ পদ্ধতি রয়েছে। প্রতিটি পদ্ধতির সুবিধা ও অসুবিধা জেনে ডাক্তারের পরামর্শ অনুযায়ী সঠিক পদ্ধতি বেছে নিন।
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">প্রধান পদ্ধতি সমূহ:</h4>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-1">অস্থায়ী পদ্ধতি:</h5>
                      <p className="text-sm text-gray-700">খাওয়ার বড়ি, ইনজেকশন, কপার-টি, ইমপ্ল্যান্ট, কনডম</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-1">স্থায়ী পদ্ধতি:</h5>
                      <p className="text-sm text-gray-700">পুরুষ বন্ধ্যাকরণ (ভ্যাসেক্টমি), নারী বন্ধ্যাকরণ (টিউবেক্টমি)</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-1">জরুরি পদ্ধতি:</h5>
                      <p className="text-sm text-gray-700">ইমার্জেন্সি কন্ট্রাসেপটিভ পিল (৭২ ঘন্টার মধ্যে)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article 3 */}
              <div className="card hover:shadow-xl transition-all">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">গর্ভধারণের আদর্শ ব্যবধান</h3>
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">সুপারিশ</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  বিশ্ব স্বাস্থ্য সংস্থা (WHO) এবং চিকিৎসা বিশেষজ্ঞরা দুই গর্ভধারণের মধ্যে কমপক্ষে ২-৩ বছরের ব্যবধান রাখার পরামর্শ দেন।
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">কেন এই ব্যবধান জরুরি:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">•</span>
                      মায়ের শরীর সম্পূর্ণভাবে সুস্থ হওয়ার সময়
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">•</span>
                      শিশুর সঠিক পুষ্টি ও বৃদ্ধি নিশ্চিতকরণ
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">•</span>
                      জটিলতার ঝুঁকি কমানো (প্রিম্যাচিউর ডেলিভারি, কম ওজন)
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-bold mr-2">•</span>
                      পরিবারের মানসিক ও আর্থিক প্রস্তুতি
                    </li>
                  </ul>
                  <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-900 font-medium">
                      💡 সুপারিশ: প্রসবের পর কমপক্ষে ৬ মাস বুকের দুধ খাওয়ান এবং ২৪ মাস পর্যন্ত চালিয়ে যান।
                    </p>
                  </div>
                </div>
              </div>

              {/* Article 4 */}
              <div className="card hover:shadow-xl transition-all">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">প্রজনন স্বাস্থ্য সেবা</h3>
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">সেবা</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  সরকারি হাসপাতাল, কমিউনিটি ক্লিনিক এবং স্বাস্থ্য কেন্দ্রে বিনামূল্যে পরিবার পরিকল্পনা পরামর্শ এবং সেবা পাওয়া যায়।
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">বিনামূল্যে সেবা সমূহ:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center bg-green-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">পরিবার পরিকল্পনা পরামর্শ</span>
                    </div>
                    <div className="flex items-center bg-green-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">বিভিন্ন পদ্ধতি সরবরাহ</span>
                    </div>
                    <div className="flex items-center bg-green-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">ফলোআপ সেবা ও জটিলতা ব্যবস্থাপনা</span>
                    </div>
                    <div className="flex items-center bg-green-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">প্রজনন স্বাস্থ্য পরীক্ষা</span>
                    </div>
                  </div>
                  <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">হটলাইন:</span> পরিবার পরিকল্পনা বিষয়ে পরামর্শের জন্য কল করুন <span className="font-bold">১৬২৬৭</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Article 5 */}
              <div className="card hover:shadow-xl transition-all">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">ভুল ধারণা ও সত্য তথ্য</h3>
                    <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">সচেতনতা</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  পরিবার পরিকল্পনা নিয়ে অনেক ভুল ধারণা প্রচলিত আছে। সঠিক তথ্য জেনে সচেতন সিদ্ধান্ত নিন।
                </p>
                <div className="border-t pt-4">
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-red-600 font-bold text-xl mr-3">✗</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">ভুল ধারণা:</p>
                          <p className="text-sm text-gray-700">পরিবার পরিকল্পনা পদ্ধতি ব্যবহারে ক্যান্সার হয়</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-green-600 font-bold text-xl mr-3">✓</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">সত্য:</p>
                          <p className="text-sm text-gray-700">আধুনিক পদ্ধতিগুলো নিরাপদ এবং ক্যান্সারের সাথে কোনো সম্পর্ক নেই</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-red-600 font-bold text-xl mr-3">✗</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">ভুল ধারণা:</p>
                          <p className="text-sm text-gray-700">বড়ি খেলে ভবিষ্যতে সন্তান হবে না</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-green-600 font-bold text-xl mr-3">✓</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">সত্য:</p>
                          <p className="text-sm text-gray-700">বড়ি বন্ধ করলে স্বাভাবিক প্রজনন ক্ষমতা ফিরে আসে</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-red-600 font-bold text-xl mr-3">✗</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">ভুল ধারণা:</p>
                          <p className="text-sm text-gray-700">স্তন্যদানকালে গর্ভবতী হওয়া সম্ভব নয়</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-green-600 font-bold text-xl mr-3">✓</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">সত্য:</p>
                          <p className="text-sm text-gray-700">মাসিক ফিরে আসার আগেই গর্ভধারণ সম্ভব, তাই জন্মনিয়ন্ত্রণ প্রয়োজন</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article 6 */}
              <div className="card hover:shadow-xl transition-all">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">পুরুষের ভূমিকা</h3>
                    <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">অংশগ্রহণ</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  পরিবার পরিকল্পনায় পুরুষের সক্রিয় অংশগ্রহণ অত্যন্ত গুরুত্বপূর্ণ। এটি একটি যৌথ দায়িত্ব এবং সিদ্ধান্ত।
                </p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">পুরুষের দায়িত্ব:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start bg-yellow-50 p-3 rounded-lg">
                      <span className="text-2xl mr-3">🤝</span>
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm mb-1">যৌথ সিদ্ধান্ত</h5>
                        <p className="text-xs text-gray-700">স্ত্রীর সাথে আলোচনা করে পদ্ধতি বেছে নিন</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-yellow-50 p-3 rounded-lg">
                      <span className="text-2xl mr-3">💊</span>
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm mb-1">পদ্ধতি ব্যবহার</h5>
                        <p className="text-xs text-gray-700">কনডম বা ভ্যাসেক্টমি (স্থায়ী) বিবেচনা করুন</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-yellow-50 p-3 rounded-lg">
                      <span className="text-2xl mr-3">❤️</span>
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm mb-1">সহযোগিতা</h5>
                        <p className="text-xs text-gray-700">স্ত্রীকে ডাক্তারের কাছে নিয়ে যান এবং সেবা গ্রহণে সহায়তা করুন</p>
                      </div>
                    </div>
                    <div className="flex items-start bg-yellow-50 p-3 rounded-lg">
                      <span className="text-2xl mr-3">📚</span>
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm mb-1">জ্ঞান অর্জন</h5>
                        <p className="text-xs text-gray-700">পরিবার পরিকল্পনা সম্পর্কে সঠিক তথ্য জানুন</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                    <p className="text-sm text-gray-900">
                      <span className="font-bold">মনে রাখুন:</span> পরিবার পরিকল্পনা শুধু নারীর দায়িত্ব নয়, এটি দম্পতির যৌথ সিদ্ধান্ত এবং দায়িত্ব।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-8 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">আরও তথ্যের জন্য</h3>
                <p className="mb-6 opacity-90">পরিবার পরিকল্পনা বিষয়ে বিশেষজ্ঞ পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                    ডাক্তারের সাথে পরামর্শ করুন
                  </button>
                  <button className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all">
                    হটলাইন: ১৬২৬৭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            {reportView === 'menu' && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">রিপোর্ট</h2>
                  <p className="text-gray-600">আপনার মেডিক্যাল রিপোর্ট পরিচালনা করুন</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Add Report Card */}
                  <button
                    onClick={() => setReportView('add')}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">রিপোর্ট যোগ করুন</h3>
                      <p className="text-blue-100">নতুন মেডিক্যাল রিপোর্ট আপলোড করুন</p>
                    </div>
                  </button>

                  {/* View All Reports Card */}
                  <button
                    onClick={() => setReportView('view')}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">সকল রিপোর্ট দেখুন</h3>
                      <p className="text-green-100">সংরক্ষিত রিপোর্ট দেখুন ও ডাউনলোড করুন</p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {reportView === 'add' && (
              <>
                <div className="mb-6 flex items-center">
                  <button
                    onClick={() => setReportView('menu')}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    ফিরে যান
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">নতুন রিপোর্ট যোগ করুন</h2>
                  
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        রিপোর্টের ধরন *
                      </label>
                      <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">নির্বাচন করুন</option>
                        <option value="blood">রক্ত পরীক্ষা</option>
                        <option value="urine">প্রস্রাব পরীক্ষা</option>
                        <option value="ultrasound">আল্ট্রাসাউন্ড</option>
                        <option value="sugar">ব্লাড সুগার</option>
                        <option value="other">অন্যান্য</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        রিপোর্টের শিরোনাম *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="যেমন: রক্ত পরীক্ষার রিপোর্ট - জানুয়ারি ২০২৬"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        তারিখ *
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        রিপোর্ট ফাইল আপলোড করুন *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 mb-2">ফাইল আপলোড করতে ক্লিক করুন</p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG (সর্বোচ্চ ১০MB)</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        মন্তব্য (ঐচ্ছিক)
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        placeholder="রিপোর্ট সম্পর্কে কোনো বিশেষ তথ্য..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                      >
                        রিপোর্ট সংরক্ষণ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportView('menu')}
                        className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {reportView === 'view' && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <button
                    onClick={() => setReportView('menu')}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    ফিরে যান
                  </button>
                  <button
                    onClick={() => setReportView('add')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    নতুন রিপোর্ট যোগ করুন
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">সকল রিপোর্ট</h2>
                  
                  {/* Demo Reports */}
                  <div className="space-y-4">
                    {/* Report 1 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">রক্ত পরীক্ষার রিপোর্ট</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ১০ জানুয়ারি, ২০২৬</p>
                            <p className="text-sm text-gray-600">ধরন: রক্ত পরীক্ষা (CBC, Hb)</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                ✓ স্বাভাবিক
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>

                    {/* Report 2 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">আল্ট্রাসাউন্ড রিপোর্ট (২০ সপ্তাহ)</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ৫ জানুয়ারি, ২০২৬</p>
                            <p className="text-sm text-gray-600">ধরন: আল্ট্রাসাউন্ড স্ক্যান</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                ✓ স্বাভাবিক
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>

                    {/* Report 3 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">ব্লাড সুগার টেস্ট</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ২৮ ডিসেম্বর, ২০২৫</p>
                            <p className="text-sm text-gray-600">ধরন: গ্লুকোজ টলারেন্স টেস্ট (GTT)</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                ⚠️ পর্যবেক্ষণ প্রয়োজন
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>

                    {/* Report 4 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">প্রস্রাব পরীক্ষা</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ২০ ডিসেম্বর, ২০২৫</p>
                            <p className="text-sm text-gray-600">ধরন: ইউরিন রুটিন পরীক্ষা</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                ✓ স্বাভাবিক
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>

                    {/* Report 5 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">থাইরয়েড ফাংশন টেস্ট</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ১৫ ডিসেম্বর, ২০২৫</p>
                            <p className="text-sm text-gray-600">ধরন: T3, T4, TSH পরীক্ষা</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                ✓ স্বাভাবিক
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Emergency Button */}
        <div className="mt-8 card bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">জরুরি সাহায্য প্রয়োজন?</h3>
              <p className="opacity-90">যেকোনো জরুরি পরিস্থিতিতে তাৎক্ষণিক সহায়তার জন্য কল করুন</p>
            </div>
            <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              জরুরি কল
            </button>
          </div>
        </div>
          </>
        )}
        
        {/* Profile Page - Shohay Style */}
        {currentPage === 'profile' && (
          <>
            {/* Profile Menu View */}
            {profileView === 'menu' && (
              <ProfileMenu
                user={user}
                dashboardData={dashboardData}
                maternalRecord={maternalRecord}
                onNavigateToProfile={(view, data) => {
                  if (view === 'baby' && data) {
                    setSelectedBaby(data);
                    setProfileView('baby');
                  } else {
                    handleProfileNavigation(view, data);
                  }
                }}
                onCreateBaby={() => handleProfileNavigation('createBaby')}
              />
            )}

            {/* Pregnancy Profile View */}
            {profileView === 'pregnancy' && (
              <PregnancyProfileView
                onBack={() => setProfileView('menu')}
                pregnancyData={profileData}
                dashboardData={dashboardData}
                maternalRecord={maternalRecord}
                onDelete={handleDeletePregnancy}
              />
            )}

            {/* Pregnancy Calculator */}
            {profileView === 'calculator' && (
              <PregnancyCalculator
                onBack={() => setProfileView('menu')}
                onSubmit={handlePregnancyDateSubmit}
              />
            )}

            {/* Baby Profile Form */}
            {profileView === 'createBaby' && (
              <BabyProfileForm
                onBack={() => setProfileView('menu')}
                onSubmit={handleBabySubmit}
              />
            )}

            {/* Baby Profile View */}
            {profileView === 'baby' && selectedBaby && (
              <BabyProfileView
                baby={selectedBaby}
                onBack={() => {
                  setSelectedBaby(null);
                  setProfileView('menu');
                }}
                onDelete={handleDeleteBaby}
              />
            )}

            {/* Personal Info View (Original Profile) */}
            {profileView === 'personal' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-gray-900">ব্যক্তিগত তথ্য</h1>
                  <button
                    onClick={() => setProfileView('menu')}
                    className="btn-outline flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    ফিরে যান
                  </button>
                </div>

                {/* Profile Information Card */}
                <div className="card">
                  <div className="flex items-start gap-6 mb-6">
                    {(profileData?.ProfileImage || user?.ProfileImage) ? (
                      <img
                        src={profileData?.ProfileImage || user?.ProfileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-primary-200">
                        {(profileData?.FullName || user?.FullName || 'মা')?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData?.FullName || user?.FullName || 'Loading...'}</h2>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>{profileData?.Email || user?.Email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>{profileData?.PhoneNumber || user?.PhoneNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">ব্যক্তিগত তথ্য</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">নাম:</span>
                          <span className="font-medium">{profileData?.FullName || user?.FullName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">লিঙ্গ:</span>
                          <span className="font-medium">
                            {(() => {
                              const gender = (profileData?.Gender || user?.Gender || '').toLowerCase();
                              return gender === 'female' ? 'নারী' : gender === 'male' ? 'পুরুষ' : 'N/A';
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">রক্তের গ্রুপ:</span>
                          <span className="font-medium">{profileData?.BloodGroup || user?.BloodGroup || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">জন্ম তারিখ:</span>
                          <span className="font-medium">
                            {(profileData?.DateOfBirth || user?.DateOfBirth) ? new Date(profileData?.DateOfBirth || user?.DateOfBirth).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ঠিকানা:</span>
                          <span className="font-medium">
                            {(() => {
                              const address = profileData?.address || user?.address;
                              if (!address) return 'N/A';
                              if (typeof address === 'string') return address;
                              const { village, upazilla, zilla } = address;
                              return [village, upazilla, zilla].filter(Boolean).join(', ') || 'N/A';
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Healthcare Providers View */}
            {profileView === 'healthcare' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-gray-900">স্বাস্থ্যসেবা প্রদানকারী</h1>
                  <button
                    onClick={() => setProfileView('menu')}
                    className="btn-outline flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    ফিরে যান
                  </button>
                </div>

                {/* Healthcare Providers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData?.assignedDoctor && (
                    <div className="card">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">নিয়োজিত ডাক্তার</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">ডা. {dashboardData.assignedDoctor.FullName}</h4>
                          <p className="text-sm text-gray-600">{dashboardData.assignedDoctor.Email}</p>
                          <p className="text-sm text-gray-600">{dashboardData.assignedDoctor.PhoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {dashboardData?.assignedMidwife && (
                    <div className="card">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">নিয়োজিত মিডওয়াইফ</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{dashboardData.assignedMidwife.FullName}</h4>
                          <p className="text-sm text-gray-600">{dashboardData.assignedMidwife.Email}</p>
                          <p className="text-sm text-gray-600">{dashboardData.assignedMidwife.PhoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Pregnancy Tracker Page */}
        {currentPage === 'pregnancy' && (
          <PregnancyTracker />
        )}

        {/* Nutrition Tracker Page */}
        {currentPage === 'nutrition' && (
          <NutritionTracker />
        )}

        {/* Baby Vaccine Tracker Page */}
        {currentPage === 'vaccine' && (
          <BabyVaccineTracker />
        )}
        
        {/* Vaccine Schedule Page */}
        {currentPage === 'vaccine-schedule' && (
          <VaccineTracker />
        )}
        {currentPage === 'health-articles' && (
          <HealthArticles onBack={handleNavigation} />
        )}

        {/* Reports Page */}
        {currentPage === 'reports' && (
          <div className="max-w-6xl mx-auto">
            {reportView === 'menu' && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">রিপোর্ট</h1>
                  <p className="text-gray-600">আপনার মেডিক্যাল রিপোর্ট পরিচালনা করুন</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Add Report Card */}
                  <button
                    onClick={() => setReportView('add')}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">রিপোর্ট যোগ করুন</h3>
                      <p className="text-blue-100">নতুন মেডিক্যাল রিপোর্ট আপলোড করুন</p>
                    </div>
                  </button>

                  {/* View All Reports Card */}
                  <button
                    onClick={() => setReportView('view')}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">সকল রিপোর্ট দেখুন</h3>
                      <p className="text-green-100">সংরক্ষিত রিপোর্ট দেখুন ও ডাউনলোড করুন</p>
                    </div>
                  </button>
                </div>
              </>
            )}

            {reportView === 'add' && (
              <>
                <div className="mb-6 flex items-center">
                  <button
                    onClick={() => setReportView('menu')}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    ফিরে যান
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">নতুন রিপোর্ট যোগ করুন</h2>
                  
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        রিপোর্টের ধরন *
                      </label>
                      <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">নির্বাচন করুন</option>
                        <option value="blood">রক্ত পরীক্ষা</option>
                        <option value="urine">প্রস্রাব পরীক্ষা</option>
                        <option value="ultrasound">আল্ট্রাসাউন্ড</option>
                        <option value="sugar">ব্লাড সুগার</option>
                        <option value="other">অন্যান্য</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        রিপোর্টের শিরোনাম *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="যেমন: রক্ত পরীক্ষার রিপোর্ট - জানুয়ারি ২০২৬"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        তারিখ *
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        রিপোর্ট ফাইল আপলোড করুন *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 mb-2">ফাইল আপলোড করতে ক্লিক করুন</p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG (সর্বোচ্চ 10MB)</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        মন্তব্য (ঐচ্ছিক)
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        placeholder="রিপোর্ট সম্পর্কে কোনো বিশেষ তথ্য..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                      >
                        রিপোর্ট সংরক্ষণ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportView('menu')}
                        className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {reportView === 'view' && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <button
                    onClick={() => setReportView('menu')}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    ফিরে যান
                  </button>
                  <button
                    onClick={() => setReportView('add')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    নতুন রিপোর্ট যোগ করুন
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">সকল রিপোর্ট</h2>
                  
                  {/* Demo Reports */}
                  <div className="space-y-4">
                    {/* Report 1 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">রক্ত পরীক্ষার রিপোর্ট</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ১০ জানুয়ারি, ২০২৬</p>
                            <p className="text-sm text-gray-600">ধরন: রক্ত পরীক্ষা (CBC, Hb)</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                ✓ স্বাভাবিক
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>

                    {/* Report 2 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">আল্ট্রাসাউন্ড রিপোর্ট (২০ সপ্তাহ)</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ৫ জানুয়ারি, ২০২৬</p>
                            <p className="text-sm text-gray-600">ধরন: আল্ট্রাসাউন্ড স্ক্যান</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                ✓ স্বাভাবিক
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>

                    {/* Report 3 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">ব্লাড সুগার টেস্ট</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ২৮ ডিসেম্বর, ২০২৫</p>
                            <p className="text-sm text-gray-600">ধরন: গ্লুকোজ টলারেন্স টেস্ট (GTT)</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                ⚠️ পর্যবেক্ষণ প্রয়োজন
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>

                    {/* Report 4 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">প্রস্রাব পরীক্ষা</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ২০ ডিসেম্বর, ২০২৫</p>
                            <p className="text-sm text-gray-600">ধরন: ইউরিন রুটিন পরীক্ষা</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                ✓ স্বাভাবিক
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>

                    {/* Report 5 */}
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">থাইরয়েড ফাংশন টেস্ট</h3>
                            <p className="text-sm text-gray-600 mt-1">তারিখ: ১৫ ডিসেম্বর, ২০২৫</p>
                            <p className="text-sm text-gray-600">ধরন: T3, T4, TSH পরীক্ষা</p>
                            <div className="mt-2">
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                ✓ স্বাভাবিক
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          ডাউনলোড
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Empty State if no reports */}
                  {/* Uncomment below if you want to show empty state when there are no reports
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 text-lg mb-4">এখনও কোনো রিপোর্ট যোগ করা হয়নি</p>
                    <button
                      onClick={() => setReportView('add')}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      প্রথম রিপোর্ট যোগ করুন
                    </button>
                  </div>
                  */}
                </div>
              </>
            )}
          </div>
        )}

        {/* Child Dashboard Page */}
        {currentPage === 'child-dashboard' && (
          <>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => handleNavigation('dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ড্যাশবোর্ডে ফিরে যান
              </button>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">শিশুর স্বাস্থ্য ড্যাশবোর্ড</h1>
              <p className="text-gray-600">আপনার শিশুর বৃদ্ধি এবং স্বাস্থ্য তথ্য পর্যবেক্ষণ করুন</p>
            </div>

            {/* Child Info Card */}
            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{demoChild.name}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">বয়স</p>
                        <p className="font-semibold text-gray-900">{demoChild.age}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">জন্ম তারিখ</p>
                        <p className="font-semibold text-gray-900">{demoChild.birthDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">লিঙ্গ</p>
                        <p className="font-semibold text-gray-900">{demoChild.gender}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">রক্তের গ্রুপ</p>
                        <p className="font-semibold text-gray-900">{demoChild.bloodGroup}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                    ✓ {demoChild.growthStatus}
                  </span>
                  <p className="text-xs text-gray-600 mt-2">শেষ চেকআপ: {demoChild.lastCheckup}</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setChildActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    childActiveTab === 'overview'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  সংক্ষিপ্ত বিবরণ
                </button>
                <button
                  onClick={() => setChildActiveTab('advice')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    childActiveTab === 'advice'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ডাক্তারের পরামর্শ
                </button>
                <button
                  onClick={() => setChildActiveTab('health-updates')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    childActiveTab === 'health-updates'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  স্বাস্থ্য আপডেট
                </button>
                <button
                  onClick={() => setChildActiveTab('checkups')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    childActiveTab === 'checkups'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  চেকআপের ইতিহাস
                </button>
                <button
                  onClick={() => setChildActiveTab('health-articles')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    childActiveTab === 'health-articles'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  শিশু স্বাস্থ্য তথ্য
                </button>
              </nav>
            </div>

            {/* Overview Tab */}
            {childActiveTab === 'overview' && (
              <>
                {/* Health Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">ওজন</h3>
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold mb-1">{demoChild.weight}</div>
                    <p className="text-sm opacity-90">স্বাভাবিক পরিসরে</p>
                  </div>

                  <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">উচ্চতা</h3>
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                        <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold mb-1">{demoChild.height}</div>
                    <p className="text-sm opacity-90">বয়সের জন্য উপযুক্ত</p>
                  </div>

                  <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">টিকাদান</h3>
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold mb-1">৫/৬</div>
                    <p className="text-sm opacity-90">টিকা সম্পন্ন</p>
                  </div>

                  <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">পুষ্টি স্তর</h3>
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-3xl font-bold mb-1">ভালো</div>
                    <p className="text-sm opacity-90">পুষ্টি স্বাভাবিক</p>
                  </div>
                </div>

                {/* Growth Chart */}
                <div className="card mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">বৃদ্ধির চার্ট</h2>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">ওজন বৃদ্ধি</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">জন্মের সময়</span>
                            <span className="font-semibold">৩.২ কেজি</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 rounded-full h-2" style={{ width: '40%' }}></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">বর্তমান</span>
                            <span className="font-semibold">{demoChild.weight}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 rounded-full h-2" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">উচ্চতা বৃদ্ধি</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">জন্মের সময়</span>
                            <span className="font-semibold">৫০ সেমি</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 rounded-full h-2" style={{ width: '50%' }}></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">বর্তমান</span>
                            <span className="font-semibold">{demoChild.height}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 rounded-full h-2" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Development Milestones */}
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">বিকাশের মাইলফলক</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">মাথা ধরে রাখতে পারে</h3>
                        <p className="text-sm text-gray-600">৬ মাস বয়সে অর্জিত</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">হাসতে পারে</h3>
                        <p className="text-sm text-gray-600">৫ মাস বয়সে অর্জিত</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">বসতে পারে</h3>
                        <p className="text-sm text-gray-600">শীঘ্রই প্রত্যাশিত</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">হামাগুড়ি দিতে পারে</h3>
                        <p className="text-sm text-gray-600">আসন্ন মাইলফলক</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Doctor's Advice Tab */}
            {childActiveTab === 'advice' && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">ডাক্তারের পরামর্শ</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">ডা. রহিমা সুলতানা</h3>
                        <p className="text-sm text-gray-600">শিশু বিশেষজ্ঞ</p>
                      </div>
                      <span className="text-xs text-gray-500">৮ জানুয়ারি, ২০২৬</span>
                    </div>
                    <p className="text-gray-800">
                      শিশুর বৃদ্ধি খুবই স্বাভাবিক। প্রতিদিন মায়ের দুধের পাশাপাশি পরিপূরক খাবার শুরু করুন। 
                      প্রথমে সেদ্ধ ভাত বা সুজির হালকা পেস্ট দিয়ে শুরু করতে পারেন। পরবর্তী চেকআপ ১ মাস পরে।
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        পুষ্টি
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        খাবার
                      </span>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 bg-green-50 p-6 rounded-r-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">ডা. করিম আহমেদ</h3>
                        <p className="text-sm text-gray-600">শিশু বিশেষজ্ঞ</p>
                      </div>
                      <span className="text-xs text-gray-500">১০ ডিসেম্বর, ২০২৫</span>
                    </div>
                    <p className="text-gray-800">
                      টিকা সময়মতো দেওয়া হচ্ছে, খুব ভালো। পরবর্তী টিকা ৯ মাস বয়সে দিতে হবে। 
                      শিশুকে পরিষ্কার পরিচ্ছন্ন রাখুন এবং প্রতিদিন কিছুক্ষণ রোদে রাখুন।
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        টিকা
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        পরিচর্যা
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health Updates Tab */}
            {childActiveTab === 'health-updates' && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">স্বাস্থ্য আপডেট</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">পেন্টাভ্যালেন্ট টিকা সম্পন্ন</h3>
                        <span className="text-xs text-gray-500">১০ জানুয়ারি, ২০২৬</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        শিশুর পেন্টাভ্যালেন্ট টিকার ৩য় ডোজ সফলভাবে প্রদান করা হয়েছে। কোনো পার্শ্বপ্রতিক্রিয়া নেই।
                      </p>
                      <span className="inline-block mt-2 text-xs text-green-700 font-semibold">
                        ধাত্রী: ফাতিমা বেগম
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">নিয়মিত চেকআপ</h3>
                        <span className="text-xs text-gray-500">৫ জানুয়ারি, ২০২৬</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        ওজন ও উচ্চতা পরিমাপ করা হয়েছে। শিশুর বৃদ্ধি স্বাভাবিক এবং সুস্বাস্থ্য।
                      </p>
                      <span className="inline-block mt-2 text-xs text-blue-700 font-semibold">
                        ধাত্রী: ফাতিমা বেগম
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">পুষ্টি পরামর্শ প্রদান</h3>
                        <span className="text-xs text-gray-500">২৮ ডিসেম্বর, ২০২৫</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        শিশুর জন্য পরিপূরক খাবার শুরু করার নির্দেশনা দেওয়া হয়েছে। প্রথম পর্যায়ে সেদ্ধ ভাত এবং মিষ্টি কুমড়ার পেস্ট দিতে পারেন।
                      </p>
                      <span className="inline-block mt-2 text-xs text-purple-700 font-semibold">
                        ডাক্তার: ডা. রহিমা সুলতানা
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Checkup History Tab */}
            {childActiveTab === 'checkups' && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">চেকআপের ইতিহাস</h2>
                <div className="space-y-4">
                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">৮ মাস বয়সের চেকআপ</h3>
                        <p className="text-sm text-gray-600">১০ জানুয়ারি, ২০২৬</p>
                        <p className="text-sm text-gray-600">ধাত্রী: ফাতিমা বেগম</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        ✓ সম্পন্ন
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600">ওজন</p>
                        <p className="text-lg font-bold text-gray-900">৮.৫ কেজি</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">উচ্চতা</p>
                        <p className="text-lg font-bold text-gray-900">৬৮ সেমি</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">মাথার পরিধি</p>
                        <p className="text-lg font-bold text-gray-900">৪৪ সেমি</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">তাপমাত্রা</p>
                        <p className="text-lg font-bold text-gray-900">৯৮.৬°F</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-800">
                        <strong>মন্তব্য:</strong> শিশু সুস্থ এবং স্বাভাবিক। পেন্টাভ্যালেন্ট টিকা প্রদান করা হয়েছে।
                      </p>
                    </div>
                  </div>

                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">৭ মাস বয়সের চেকআপ</h3>
                        <p className="text-sm text-gray-600">১০ ডিসেম্বর, ২০২৫</p>
                        <p className="text-sm text-gray-600">ধাত্রী: ফাতিমা বেগম</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        ✓ সম্পন্ন
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600">ওজন</p>
                        <p className="text-lg font-bold text-gray-900">৮.০ কেজি</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">উচ্চতা</p>
                        <p className="text-lg font-bold text-gray-900">৬৬ সেমি</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">মাথার পরিধি</p>
                        <p className="text-lg font-bold text-gray-900">৪৩ সেমি</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">তাপমাত্রা</p>
                        <p className="text-lg font-bold text-gray-900">৯৮.৪°F</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-800">
                        <strong>মন্তব্য:</strong> বৃদ্ধি স্বাভাবিক। পরিপূরক খাবার চালিয়ে যান।
                      </p>
                    </div>
                  </div>

                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">৬ মাস বয়সের চেকআপ</h3>
                        <p className="text-sm text-gray-600">২০ নভেম্বর, ২০২৫</p>
                        <p className="text-sm text-gray-600">ডাক্তার: ডা. রহিমা সুলতানা</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        ✓ সম্পন্ন
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600">ওজন</p>
                        <p className="text-lg font-bold text-gray-900">৭.৪ কেজি</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">উচ্চতা</p>
                        <p className="text-lg font-bold text-gray-900">৬৪ সেমি</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">মাথার পরিধি</p>
                        <p className="text-lg font-bold text-gray-900">৪২ সেমি</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">তাপমাত্রা</p>
                        <p className="text-lg font-bold text-gray-900">৯৮.৬°F</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-800">
                        <strong>মন্তব্য:</strong> শিশু সম্পূর্ণ সুস্থ। পরিপূরক খাবার শুরু করার পরামর্শ দেওয়া হয়েছে।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health Articles Tab */}
            {childActiveTab === 'health-articles' && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">শিশু স্বাস্থ্য তথ্য</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">শিশুর পুষ্টি</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      ৬ মাস থেকে পরিপূরক খাবার কীভাবে শুরু করবেন এবং কোন খাবারগুলো দেবেন।
                    </p>
                    <span className="text-sm text-purple-600 font-semibold">আরও পড়ুন →</span>
                  </div>

                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">টিকাদান কর্মসূচি</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      শিশুর জন্য প্রয়োজনীয় সকল টিকা এবং সঠিক সময়ের তালিকা।
                    </p>
                    <span className="text-sm text-purple-600 font-semibold">আরও পড়ুন →</span>
                  </div>

                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">শিশুর বিকাশ</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      বয়স অনুযায়ী শিশুর শারীরিক ও মানসিক বিকাশের মাইলফলক।
                    </p>
                    <span className="text-sm text-purple-600 font-semibold">আরও পড়ুন →</span>
                  </div>

                  <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">শিশুর পরিচর্যা</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      দৈনন্দিন পরিচর্যা, স্বাস্থ্যবিধি এবং নিরাপত্তা সম্পর্কে জরুরি তথ্য।
                    </p>
                    <span className="text-sm text-purple-600 font-semibold">আরও পড়ুন →</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MotherDashboard;
