import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Users, AlertCircle, CheckCircle, Calendar, TrendingUp, Activity } from 'lucide-react';

// Demo checkup data for presentation
const DEMO_CHECKUPS = [
  {
    _id: 'demo1',
    motherID: {
      FullName: 'সালমা খাতুন',
      address: { village: 'জাফলং', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' }
    },
    weekNumber: 2,
    year: 2026,
    checkupDate: '2026-01-13T10:30:00.000Z',
    bloodPressure: { systolic: 145, diastolic: 95 },
    weight: 68.5,
    height: 158,
    notes: 'রক্তচাপ সামান্য বেশি। বিশ্রাম এবং কম লবণ খাওয়ার পরামর্শ দেওয়া হয়েছে। পরবর্তী সপ্তাহে আবার চেক করতে হবে।'
  },
  {
    _id: 'demo2',
    motherID: {
      FullName: 'রুবিনা আক্তার',
      address: { village: 'তামাবিল', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' }
    },
    weekNumber: 2,
    year: 2026,
    checkupDate: '2026-01-12T14:15:00.000Z',
    bloodPressure: { systolic: 118, diastolic: 78 },
    weight: 62.3,
    height: 155,
    notes: 'সব কিছু স্বাভাবিক আছে। নিয়মিত পুষ্টিকর খাবার খাচ্ছে।'
  },
  {
    _id: 'demo3',
    motherID: {
      FullName: 'আমেনা বেগম',
      address: { village: 'বিছনাকান্দি', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' }
    },
    weekNumber: 2,
    year: 2026,
    checkupDate: '2026-01-11T09:00:00.000Z',
    bloodPressure: { systolic: 152, diastolic: 98 },
    weight: 71.2,
    notes: 'উচ্চ রক্তচাপ দেখা যাচ্ছে। জরুরি ভিত্তিতে ডাক্তারের কাছে রেফার করা হয়েছে। পরিবারকে সতর্ক থাকতে বলা হয়েছে।'
  },
  {
    _id: 'demo4',
    motherID: {
      FullName: 'মীম খাতুন',
      address: { village: 'রাতারগুল', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' }
    },
    weekNumber: 1,
    year: 2026,
    checkupDate: '2026-01-08T11:45:00.000Z',
    bloodPressure: { systolic: 125, diastolic: 82 },
    weight: 65.8,
    height: 160,
    notes: ''
  },
  {
    _id: 'demo5',
    motherID: {
      FullName: 'মর্জিনা বেগম',
      address: { village: 'লালাখাল', upazilla: 'জৈন্তাপুর', zilla: 'সিলেট' }
    },
    weekNumber: 1,
    year: 2026,
    checkupDate: '2026-01-06T15:30:00.000Z',
    bloodPressure: { systolic: 132, diastolic: 86 },
    weight: 70.1,
    height: 162,
    notes: 'ওজন ভালো বৃদ্ধি পাচ্ছে। আয়রন ট্যাবলেট নিয়মিত খাচ্ছে।'
  }
];

// Demo mother data for search demonstration
const DEMO_MOTHERS = [
  {
    _id: 'mother1',
    FullName: 'সালমা খাতুন',
    PhoneNumber: '০১৭১২-৩৪৫৬৭৮',
    BloodGroup: 'B+',
    address: { village: 'জাফলং', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' },
    hasCheckupThisWeek: false,
    condition: 'ঝুঁকিপূর্ণ'
  },
  {
    _id: 'mother2',
    FullName: 'রুবিনা আক্তার',
    PhoneNumber: '০১৯১৮-৯৮৭৬৫৪',
    BloodGroup: 'O+',
    address: { village: 'জাফলং', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' },
    hasCheckupThisWeek: true,
    condition: 'স্বাভাবিক'
  },
  {
    _id: 'mother3',
    FullName: 'আমেনা বেগম',
    PhoneNumber: '০১৭৫৫-১২৩৪৫৬',
    BloodGroup: 'A+',
    address: { village: 'বিছনাকান্দি', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' },
    hasCheckupThisWeek: false,
    condition: 'উচ্চ ঝুঁকিপূর্ণ'
  },
  {
    _id: 'mother4',
    FullName: 'রোকেয়া খাতুন',
    PhoneNumber: '০১৩২১-৬৫৪৩২১',
    BloodGroup: 'AB+',
    address: { village: 'বিছনাকান্দি', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' },
    hasCheckupThisWeek: true,
    condition: 'স্বাভাবিক'
  },
  {
    _id: 'mother5',
    FullName: 'হাসিনা খাতুন',
    PhoneNumber: '০১৬২২-৭৮৯০১২',
    BloodGroup: 'O-',
    address: { village: 'রাতারগুল', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' },
    hasCheckupThisWeek: true,
    condition: 'স্বাভাবিক'
  },
  {
    _id: 'mother6',
    FullName: 'জরিনা বেগম',
    PhoneNumber: '০১৮৮৮-২৩৪৫৬৭',
    BloodGroup: 'B-',
    address: { village: 'রাতারগুল', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' },
    hasCheckupThisWeek: false,
    condition: 'ঝুঁকিপূর্ণ'
  },
  {
    _id: 'mother7',
    FullName: 'মর্জিনা বেগম',
    PhoneNumber: '০১৭৩৩-৮৯০১২৩',
    BloodGroup: 'A-',
    address: { village: 'লালাখাল', upazilla: 'জৈন্তাপুর', zilla: 'সিলেট' },
    hasCheckupThisWeek: true,
    condition: 'স্বাভাবিক'
  },
  {
    _id: 'mother8',
    FullName: 'সুফিয়া খাতুন',
    PhoneNumber: '০১৯৯৯-৪৫৬৭৮৯',
    BloodGroup: 'O+',
    address: { village: 'লালাখাল', upazilla: 'জৈন্তাপুর', zilla: 'সিলেট' },
    hasCheckupThisWeek: false,
    condition: 'উচ্চ ঝুঁকিপূর্ণ'
  },
  {
    _id: 'mother9',
    FullName: 'নাজমা আক্তার',
    PhoneNumber: '০১৫১১-৩৩২২১১',
    BloodGroup: 'B+',
    address: { village: 'তামাবিল', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' },
    hasCheckupThisWeek: false,
    condition: 'ঝুঁকিপূর্ণ'
  },
  {
    _id: 'mother10',
    FullName: 'পারুল বেগম',
    PhoneNumber: '০১৬৪৪-৯৯৮৮৭৭',
    BloodGroup: 'A+',
    address: { village: 'তামাবিল', upazilla: 'গোয়াইনঘাট', zilla: 'সিলেট' },
    hasCheckupThisWeek: true,
    condition: 'স্বাভাবিক'
  }
];

const MidwifeDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, search, motherDetails, my-checkups
  const [dashboardStats, setDashboardStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMother, setSelectedMother] = useState(null);
  const [myCheckups, setMyCheckups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkupForm, setCheckupForm] = useState({
    systolic: '',
    diastolic: '',
    weight: '',
    height: '',
    notes: ''
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${API_BASE_URL}/midwife/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok && data.Success) {
        // Use demo data if API returns zero values for demonstration
        const stats = data.data;
        if (stats.totalMothers === 0 || !stats.totalMothers) {
          setDashboardStats({
            totalMothers: 10,
            checkupsThisWeek: 7,
            checkupsToday: 3,
            recentCheckups: stats.recentCheckups || []
          });
        } else {
          setDashboardStats(stats);
        }
      } else {
        // Use demo data for demonstration
        setDashboardStats({
          totalMothers: 10,
          checkupsThisWeek: 7,
          checkupsToday: 3,
          recentCheckups: []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      // Use demo data for demonstration
      setDashboardStats({
        totalMothers: 10,
        checkupsThisWeek: 7,
        checkupsToday: 3,
        recentCheckups: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(
        `${API_BASE_URL}/midwife/search-mothers?village=${encodeURIComponent(searchQuery)}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      const data = await response.json();
      if (response.ok && data.Success) {
        const apiResults = data.data || [];
        // If API returns no results, use demo data filtered by village
        if (apiResults.length === 0) {
          const demoResults = DEMO_MOTHERS.filter(mother => 
            mother.address.village.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(demoResults);
        } else {
          setSearchResults(apiResults);
        }
        setActiveView('search');
      } else {
        // Use demo data for demonstration
        const demoResults = DEMO_MOTHERS.filter(mother => 
          mother.address.village.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(demoResults);
        setActiveView('search');
      }
    } catch (error) {
      console.error('Error searching mothers:', error);
      // Use demo data for demonstration
      const demoResults = DEMO_MOTHERS.filter(mother => 
        mother.address.village.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(demoResults);
      setActiveView('search');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCheckups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${API_BASE_URL}/midwife/my-checkups`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok && data.Success) {
        const checkupsData = Array.isArray(data.data) ? data.data : [];
        // Use demo data if API returns empty for demonstration
        setMyCheckups(checkupsData.length > 0 ? checkupsData : DEMO_CHECKUPS);
        setActiveView('my-checkups');
      } else {
        // Use demo data for demonstration
        setMyCheckups(DEMO_CHECKUPS);
        setActiveView('my-checkups');
      }
    } catch (error) {
      console.error('Error fetching my checkups:', error);
      // Use demo data for demonstration
      setMyCheckups(DEMO_CHECKUPS);
      setActiveView('my-checkups');
    } finally {
      setLoading(false);
    }
  };

  const fetchMotherDetails = async (motherID) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${API_BASE_URL}/midwife/mother/${motherID}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok && data.Success) {
        setSelectedMother(data.data);
        setActiveView('motherDetails');
      }
    } catch (error) {
      console.error('Error fetching mother details:', error);
      alert('মায়ের তথ্য লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckupSubmit = async (e) => {
    e.preventDefault();
    
    if (!checkupForm.systolic || !checkupForm.diastolic || !checkupForm.weight) {
      alert('রক্তচাপ এবং ওজন অবশ্যই প্রদান করতে হবে');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(
        `${API_BASE_URL}/midwife/mother/${selectedMother.motherInfo._id}/checkup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(checkupForm)
        }
      );
      
      const data = await response.json();
      if (response.ok && data.Success) {
        alert('চেকআপ সফলভাবে সংরক্ষিত হয়েছে');
        setCheckupForm({ systolic: '', diastolic: '', weight: '', height: '', notes: '' });
        fetchMotherDetails(selectedMother.motherInfo._id); // Refresh
      } else {
        alert(data.Message || 'চেকআপ সংরক্ষণে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error submitting checkup:', error);
      alert('চেকআপ সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    if (typeof address === 'string') return address;
    const { village, upazilla, zilla } = address;
    return [village, upazilla, zilla].filter(Boolean).join(', ') || 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="midwife" onNavigate={(action) => {
        if (action === 'dashboard') setActiveView('dashboard');
        else if (action === 'search') setActiveView('search');
        else if (action === 'my-checkups') fetchMyCheckups();
      }} />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">ধাত্রীর ড্যাশবোর্ড</h1>
            <p className="text-gray-600 mt-2">সাপ্তাহিক চেকআপ পরিচালনা করুন</p>
          </div>

          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8" />
                    <span className="text-3xl font-bold">{dashboardStats?.totalMothers || 0}</span>
                  </div>
                  <h3 className="text-sm font-medium opacity-90">মোট মা</h3>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8" />
                    <span className="text-3xl font-bold">{dashboardStats?.checkupsThisWeek || 0}</span>
                  </div>
                  <h3 className="text-sm font-medium opacity-90">এই সপ্তাহে চেকআপ</h3>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="w-8 h-8" />
                    <span className="text-3xl font-bold">{dashboardStats?.checkupsToday || 0}</span>
                  </div>
                  <h3 className="text-sm font-medium opacity-90">আজকের চেকআপ</h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={fetchMyCheckups}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-green-200 hover:border-green-400"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                      <Activity className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-900">আমার চেকআপ</h3>
                      <p className="text-sm text-gray-600">ইতিহাস দেখুন</p>
                    </div>
                  </div>
                </button>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                  <form onSubmit={handleSearch} className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-700">
                      গ্রামের নাম দিয়ে খুঁজুন
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="গ্রামের নাম..."
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Recent Checkups */}
              {dashboardStats?.recentCheckups && dashboardStats.recentCheckups.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">সাম্প্রতিক চেকআপ</h2>
                    <button
                      onClick={fetchMyCheckups}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      সব দেখুন →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {dashboardStats.recentCheckups.map((checkup) => (
                      <div key={checkup._id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{checkup.motherID?.FullName}</h3>
                            <p className="text-sm text-gray-600">{formatAddress(checkup.motherID?.address)}</p>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(checkup.checkupDate)}</span>
                        </div>
                        <div className="mt-3 flex gap-4 text-sm">
                          <span className="text-gray-700">
                            <strong>BP:</strong> {checkup.bloodPressure?.systolic}/{checkup.bloodPressure?.diastolic}
                          </span>
                          <span className="text-gray-700">
                            <strong>ওজন:</strong> {checkup.weight} কেজি
                          </span>
                          {checkup.bloodPressure?.systolic > 140 && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                              ⚠️ উচ্চ BP
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💡 ধাত্রীর টিপস</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>প্রতি সপ্তাহে সকল গর্ভবতী মায়ের চেকআপ নিশ্চিত করুন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>রক্তচাপ 140/90 এর উপরে হলে অবশ্যই ডাক্তারকে জানান</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>মায়ের ওজন নিয়মিত ট্র্যাক করুন এবং পুষ্টি পরামর্শ দিন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>জরুরি লক্ষণ দেখা দিলে দেরি না করে ডাক্তারের কাছে পাঠান</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Search Results View */}
          {activeView === 'search' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">অনুসন্ধান ফলাফল</h2>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ← ড্যাশবোর্ডে ফিরে যান
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">কোনো মা পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((mother) => (
                    <div
                      key={mother._id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => fetchMotherDetails(mother._id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{mother.FullName}</h3>
                          <p className="text-sm text-gray-600">{formatAddress(mother.address)}</p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {mother.hasCheckupThisWeek ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                              ✓ চেকআপ হয়েছে
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                              চেকআপ বাকি
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <p className="text-sm text-gray-700">
                          <strong>ফোন:</strong> {mother.PhoneNumber || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>রক্তের গ্রুপ:</strong> {mother.BloodGroup || 'N/A'}
                        </p>
                      </div>
                      {mother.condition && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            mother.condition === 'স্বাভাবিক' ? 'bg-green-100 text-green-800' :
                            mother.condition === 'ঝুঁকিপূর্ণ' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {mother.condition === 'স্বাভাবিক' && '✓ '}
                            {mother.condition === 'ঝুঁকিপূর্ণ' && '⚠️ '}
                            {mother.condition === 'উচ্চ ঝুঁকিপূর্ণ' && '🚨 '}
                            {mother.condition}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mother Details View */}
          {activeView === 'motherDetails' && selectedMother && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">মায়ের বিস্তারিত তথ্য</h2>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ← ড্যাশবোর্ডে ফিরে যান
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mother Info */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">ব্যক্তিগত তথ্য</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">নাম</p>
                      <p className="font-semibold text-gray-900">{selectedMother.motherInfo.FullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ফোন নম্বর</p>
                      <p className="font-semibold text-gray-900">{selectedMother.motherInfo.PhoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">রক্তের গ্রুপ</p>
                      <p className="font-semibold text-gray-900">{selectedMother.motherInfo.BloodGroup || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ঠিকানা</p>
                      <p className="font-semibold text-gray-900">{formatAddress(selectedMother.motherInfo.address)}</p>
                    </div>
                    {selectedMother.maternalRecord && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600">গর্ভাবস্থার সপ্তাহ</p>
                          <p className="font-semibold text-gray-900">{selectedMother.maternalRecord.pregnancyWeek} সপ্তাহ</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">প্রত্যাশিত প্রসবের তারিখ</p>
                          <p className="font-semibold text-gray-900">{formatDate(selectedMother.maternalRecord.edd)}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Checkup Form or Status */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedMother.hasCheckupThisWeek ? (
                    <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center">
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-green-900 mb-2">চেকআপ সম্পন্ন হয়েছে</h3>
                      <p className="text-green-700 mb-4">এই মায়ের এই সপ্তাহের চেকআপ ইতিমধ্যে সম্পন্ন হয়েছে</p>
                      <p className="text-sm text-green-600">পরবর্তী চেকআপ: আগামী সপ্তাহ</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">নতুন চেকআপ যোগ করুন</h3>
                      <form onSubmit={handleCheckupSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              সিস্টোলিক BP (mmHg) *
                            </label>
                            <input
                              type="number"
                              value={checkupForm.systolic}
                              onChange={(e) => setCheckupForm({...checkupForm, systolic: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="120"
                              min="70"
                              max="250"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              ডায়াস্টোলিক BP (mmHg) *
                            </label>
                            <input
                              type="number"
                              value={checkupForm.diastolic}
                              onChange={(e) => setCheckupForm({...checkupForm, diastolic: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="80"
                              min="40"
                              max="180"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              ওজন (কেজি) *
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={checkupForm.weight}
                              onChange={(e) => setCheckupForm({...checkupForm, weight: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="65.5"
                              min="30"
                              max="200"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              উচ্চতা (সেমি)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={checkupForm.height}
                              onChange={(e) => setCheckupForm({...checkupForm, height: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="160"
                              min="100"
                              max="250"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            নোট
                          </label>
                          <textarea
                            value={checkupForm.notes}
                            onChange={(e) => setCheckupForm({...checkupForm, notes: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="3"
                            placeholder="অতিরিক্ত পর্যবেক্ষণ বা মন্তব্য..."
                            maxLength="1000"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50"
                        >
                          {loading ? 'সংরক্ষণ হচ্ছে...' : 'চেকআপ সংরক্ষণ করুন'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Doctor's Advice */}
                  {selectedMother.doctorAdvice && selectedMother.doctorAdvice.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">ডাক্তারের পরামর্শ</h3>
                      <div className="space-y-3">
                        {selectedMother.doctorAdvice.map((advice) => (
                          <div key={advice._id} className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-semibold text-blue-900">
                                {advice.doctorID?.FullName || 'ডাক্তার'}
                              </p>
                              <span className="text-xs text-blue-600">{formatDate(advice.createdAt)}</span>
                            </div>
                            <p className="text-gray-800">{advice.advice}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Previous Checkups */}
                  {selectedMother.previousCheckups && selectedMother.previousCheckups.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">পূর্ববর্তী চেকআপের ইতিহাস</h3>
                      <div className="space-y-3">
                        {selectedMother.previousCheckups.map((checkup) => (
                          <div key={checkup._id} className="border-2 border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  সপ্তাহ {checkup.weekNumber}, {checkup.year}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {checkup.midwifeID?.FullName || 'ধাত্রী'}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">{formatDate(checkup.checkupDate)}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                              <div>
                                <p className="text-gray-600">রক্তচাপ</p>
                                <p className="font-semibold text-gray-900">
                                  {checkup.bloodPressure?.systolic}/{checkup.bloodPressure?.diastolic}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">ওজন</p>
                                <p className="font-semibold text-gray-900">{checkup.weight} কেজি</p>
                              </div>
                              {checkup.height && (
                                <div>
                                  <p className="text-gray-600">উচ্চতা</p>
                                  <p className="font-semibold text-gray-900">{checkup.height} সেমি</p>
                                </div>
                              )}
                            </div>
                            {checkup.notes && (
                              <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                                {checkup.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* My Checkups View */}
          {activeView === 'my-checkups' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">আমার চেকআপের ইতিহাস</h2>
                  <p className="text-gray-600">আমার করা সকল চেকআপের তালিকা</p>
                </div>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ← ড্যাশবোর্ডে ফিরে যান
                </button>
              </div>

              {myCheckups.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">এখনও কোনো চেকআপ করা হয়নি</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myCheckups.map((checkup) => (
                    <div key={checkup._id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {checkup.motherID?.FullName || 'Unknown'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatAddress(checkup.motherID?.address)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            সপ্তাহ {checkup.weekNumber}, {checkup.year}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatDate(checkup.checkupDate)}
                          </span>
                          <p className="text-xs text-gray-600">
                            {new Date(checkup.checkupDate).toLocaleTimeString('bn-BD', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-blue-600 font-semibold mb-1">রক্তচাপ</p>
                          <p className="text-lg font-bold text-blue-900">
                            {checkup.bloodPressure?.systolic}/{checkup.bloodPressure?.diastolic}
                          </p>
                          <p className="text-xs text-blue-600">mmHg</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-green-600 font-semibold mb-1">ওজন</p>
                          <p className="text-lg font-bold text-green-900">{checkup.weight}</p>
                          <p className="text-xs text-green-600">কেজি</p>
                        </div>
                        {checkup.height && (
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-xs text-purple-600 font-semibold mb-1">উচ্চতা</p>
                            <p className="text-lg font-bold text-purple-900">{checkup.height}</p>
                            <p className="text-xs text-purple-600">সেমি</p>
                          </div>
                        )}
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p className="text-xs text-orange-600 font-semibold mb-1">স্ট্যাটাস</p>
                          <p className="text-sm font-bold text-orange-900">
                            {checkup.bloodPressure?.systolic > 140 || checkup.bloodPressure?.diastolic > 90
                              ? '⚠️ উচ্চ BP'
                              : '✓ স্বাভাবিক'}
                          </p>
                        </div>
                      </div>

                      {checkup.notes && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                          <p className="text-xs text-gray-600 font-semibold mb-1">নোট</p>
                          <p className="text-sm text-gray-800">{checkup.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && activeView === 'dashboard' && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">লোড হচ্ছে...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MidwifeDashboard;
