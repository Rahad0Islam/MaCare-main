import React, { useState, useEffect } from 'react';
import { Scale, TrendingUp, Target, Calendar, Trash2, Plus, X } from 'lucide-react';

const WeightHeightTracker = ({ isOpen, onClose }) => {
  const [weightData, setWeightData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchWeightData();
    }
  }, [isOpen]);

  const fetchWeightData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/mother/weight-tracking`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setWeightData(data.data.statistics);
        setEntries(data.data.entries);
      }
    } catch (error) {
      console.error('Error fetching weight data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWeight = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/mother/weight-tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('ওজন সফলভাবে যোগ করা হয়েছে!');
        setShowAddForm(false);
        setFormData({
          weight: '',
          height: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        fetchWeightData();
      } else {
        throw new Error(data.message || 'ওজন যোগ করতে ব্যর্থ');
      }
    } catch (error) {
      console.error('Error adding weight:', error);
      alert('ওজন যোগ করতে ত্রুটি: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!confirm('এই এন্ট্রি মুছে ফেলতে চান?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/mother/weight-tracking/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchWeightData();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('এন্ট্রি মুছতে ত্রুটি');
    }
  };

  const cmToFeetInches = (cm) => {
    if (!cm) return 'N/A';
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">ওজন ও উচ্চতা ট্র্যাকার</h2>
              <p className="text-purple-100 text-sm">গর্ভাবস্থায় ওজন পর্যবেক্ষণ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Current Weight */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <Scale className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">বর্তমান ওজন</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {weightData?.currentWeight ? `${weightData.currentWeight} কেজি` : 'N/A'}
                  </p>
                </div>

                {/* Starting Weight */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">শুরুর ওজন</p>
                  <p className="text-3xl font-bold text-green-900">
                    {weightData?.startingWeight ? `${weightData.startingWeight} কেজি` : 'N/A'}
                  </p>
                </div>

                {/* Total Gain */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">মোট বৃদ্ধি</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {weightData?.totalGain ? `${weightData.totalGain >= 0 ? '+' : ''}${weightData.totalGain.toFixed(1)} কেজি` : '0 কেজি'}
                  </p>
                </div>

                {/* Height */}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 border border-pink-200">
                  <div className="flex items-center justify-between mb-2">
                    <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">উচ্চতা</p>
                  <p className="text-2xl font-bold text-pink-900">
                    {cmToFeetInches(weightData?.height)}
                  </p>
                  {weightData?.height && (
                    <p className="text-xs text-gray-500 mt-1">{weightData.height} সেমি</p>
                  )}
                </div>
              </div>

              {/* Expected Weight Info */}
              {weightData?.expectedFinalWeight && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>প্রত্যাশিত চূড়ান্ত ওজন:</strong> {weightData.expectedFinalWeight.toFixed(1)} কেজি
                    <span className="text-xs ml-2">(সাধারণত ১১-১৬ কেজি বৃদ্ধি স্বাভাবিক)</span>
                  </p>
                </div>
              )}

              {/* Add Weight Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">সাপ্তাহিক রেকর্ড</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  ওজন যোগ করুন
                </button>
              </div>

              {/* Add Weight Form */}
              {showAddForm && (
                <form onSubmit={handleAddWeight} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ওজন (কেজি) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="যেমন: 65.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        উচ্চতা (সেমি)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="যেমন: 160"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        তারিখ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        নোট
                      </label>
                      <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="অতিরিক্ত তথ্য (ঐচ্ছিক)"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                    >
                      {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      বাতিল
                    </button>
                  </div>
                </form>
              )}

              {/* Weight History Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          তারিখ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          সপ্তাহ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ওজন
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          পরিবর্তন
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          BMI
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          কর্ম
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entries.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            এখনও কোনো রেকর্ড যোগ করা হয়নি
                          </td>
                        </tr>
                      ) : (
                        entries.map((entry) => (
                          <tr key={entry._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {formatDate(entry.date)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {entry.pregnancyWeek ? `সপ্তাহ ${entry.pregnancyWeek}` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {entry.weight} কেজি
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {entry.weightChange !== 0 && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  entry.weightChange > 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {entry.weightChange > 0 ? '+' : ''}{entry.weightChange.toFixed(1)} কেজি
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {entry.bmi ? entry.bmi.toFixed(1) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button
                                onClick={() => handleDeleteEntry(entry._id)}
                                className="text-red-600 hover:text-red-900"
                                title="মুছুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightHeightTracker;
