import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, Baby } from 'lucide-react';
import api from '../utils/api';

/**
 * Baby Vaccine Tracker Component
 * Displays vaccine schedules for all registered babies
 * Similar to mother's VaccineTracker but focused on baby vaccines
 */
const BabyVaccineTracker = () => {
  const [babies, setBabies] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedBaby) {
      fetchVaccinesForBaby(selectedBaby.id);
    }
  }, [selectedBaby]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.getMotherDashboard();
      const children = response.data?.children || [];
      
      if (children.length === 0) {
        setError('আপনার কোনো শিশুর রেকর্ড নেই। প্রথমে আপনার শিশুর তথ্য যোগ করুন।');
        setLoading(false);
        return;
      }

      // Format baby data
      const formattedBabies = children.map(record => ({
        id: record._id,
        name: record.child.name,
        dob: record.child.dob,
        gender: record.child.gender,
        bloodGroup: record.child.bloodGroup,
        weight: record.child.weight,
        deliveryType: record.child.deliveryType
      }));

      setBabies(formattedBabies);
      
      // Auto-select first baby
      if (formattedBabies.length > 0) {
        setSelectedBaby(formattedBabies[0]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('ড্যাশবোর্ড ডেটা লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccinesForBaby = async (babyId) => {
    try {
      setLoading(true);
      const response = await api.getVaccineSchedule(babyId);
      setVaccines(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching vaccines:', err);
      setError('টিকার তথ্য লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (vaccine) => {
    if (vaccine.status === 'given') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          প্রদত্ত
        </span>
      );
    }

    if (vaccine.status === 'missed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-4 h-4 mr-1" />
          মিসড
        </span>
      );
    }

    const dueDate = new Date(vaccine.dueDate);
    const today = new Date();
    
    if (dueDate < today) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
          <AlertCircle className="w-4 h-4 mr-1" />
          বিলম্বিত
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        <Clock className="w-4 h-4 mr-1" />
        আসন্ন
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return '-';
    const birthDate = new Date(dob);
    const today = new Date();
    const diffTime = Math.abs(today - birthDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} দিন`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} মাস`;
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      return months > 0 ? `${years} বছর ${months} মাস` : `${years} বছর`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">টিকার তথ্য লোড হচ্ছে...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <p className="text-red-800">{error}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          পুনরায় চেষ্টা করুন
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">শিশুর টিকার সময়সূচী</h1>
        <p className="text-gray-600">আপনার শিশুর টিকাদান কর্মসূচি ট্র্যাক করুন</p>
      </div>

      {/* Baby Selection */}
      {babies.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            শিশু নির্বাচন করুন
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {babies.map((baby) => (
              <button
                key={baby.id}
                onClick={() => setSelectedBaby(baby)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedBaby?.id === baby.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    baby.gender === 'Male' ? 'bg-blue-100' : 'bg-pink-100'
                  }`}>
                    <Baby className={`w-6 h-6 ${
                      baby.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{baby.name}</h3>
                    <p className="text-sm text-gray-600">বয়স: {calculateAge(baby.dob)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Baby Info Card */}
      {selectedBaby && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              selectedBaby.gender === 'Male' ? 'bg-blue-200' : 'bg-pink-200'
            }`}>
              <Baby className={`w-8 h-8 ${
                selectedBaby.gender === 'Male' ? 'text-blue-600' : 'text-pink-600'
              }`} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedBaby.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">বয়স:</span>
                  <span className="ml-2 font-medium text-gray-900">{calculateAge(selectedBaby.dob)}</span>
                </div>
                <div>
                  <span className="text-gray-600">লিঙ্গ:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {selectedBaby.gender === 'Male' ? 'ছেলে' : 'মেয়ে'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">রক্তের গ্রুপ:</span>
                  <span className="ml-2 font-medium text-gray-900">{selectedBaby.bloodGroup || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-600">জন্ম তারিখ:</span>
                  <span className="ml-2 font-medium text-gray-900">{formatDate(selectedBaby.dob)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">টিকার গুরুত্ব</h3>
            <p className="text-blue-800 text-sm">
              শিশুর টিকাদান কর্মসূচি অত্যন্ত গুরুত্বপূর্ণ। নির্ধারিত সময়ে টিকা নিন এবং নিশ্চিত করুন যে সকল টিকা সম্পন্ন হয়েছে। টিকা প্রদান করার পর স্বাস্থ্যকর্মী বা ডাক্তার এই রেকর্ড আপডেট করবেন।
            </p>
          </div>
        </div>
      </div>

      {/* Vaccine Table */}
      {vaccines.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">এখনও কোনো টিকার সময়সূচী নেই</p>
          <p className="text-gray-500 text-sm">
            স্বাস্থ্যকর্মী আপনার শিশুর জন্য টিকার সময়সূচী তৈরি করবেন
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  টিকার কোড
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  নির্ধারিত তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  প্রদানের তারিখ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  স্ট্যাটাস
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vaccines.map((vaccine, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vaccine.code || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(vaccine.dueDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(vaccine.givenDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(vaccine)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Common Vaccine Schedule Information */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">সাধারণ শিশু টিকার তালিকা</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">জন্মের সময়</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• BCG (যক্ষ্মা)</li>
              <li>• OPV-0 (পোলিও)</li>
              <li>• Hepatitis B (জন্ডিস)</li>
            </ul>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">৬ সপ্তাহ</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pentavalent-1</li>
              <li>• OPV-1</li>
              <li>• PCV-1</li>
            </ul>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">১০ সপ্তাহ</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pentavalent-2</li>
              <li>• OPV-2</li>
              <li>• PCV-2</li>
            </ul>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">১৪ সপ্তাহ</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pentavalent-3</li>
              <li>• OPV-3</li>
              <li>• PCV-3</li>
              <li>• IPV</li>
            </ul>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">৯ মাস</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• MR (হাম ও রুবেলা)</li>
            </ul>
          </div>
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">১৫ মাস</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• MR-2</li>
              <li>• Chickenpox (যদি প্রযোজ্য হয়)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>নোট:</strong> এটি একটি সাধারণ তালিকা। আপনার শিশুর নির্দিষ্ট টিকার সময়সূচী আপনার ডাক্তার বা স্বাস্থ্যকর্মী নির্ধারণ করবেন।
          </p>
        </div>
      </div>
    </div>
  );
};

export default BabyVaccineTracker;
