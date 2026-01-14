import { useState, useEffect } from 'react';

const BPTracker = ({ isOpen, onClose }) => {
  const [bpEntries, setBpEntries] = useState([]);
  const [statistics, setStatistics] = useState({
    latestReading: null,
    averageSystolic: 0,
    averageDiastolic: 0,
    totalReadings: 0,
    normalCount: 0,
    elevatedCount: 0,
    highCount: 0,
    crisisCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchBPHistory();
    }
  }, [isOpen]);

  const fetchBPHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/mother/bp-tracking`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok && data.Success) {
        setBpEntries(data.data.entries);
        setStatistics(data.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching BP history:', error);
      alert('রক্তচাপের তথ্য লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.systolic || !formData.diastolic) {
      alert('সিস্টোলিক এবং ডায়াস্টোলিক রক্তচাপ প্রদান করুন');
      return;
    }

    const systolic = parseInt(formData.systolic);
    const diastolic = parseInt(formData.diastolic);

    if (systolic < 70 || systolic > 250) {
      alert('সিস্টোলিক রক্তচাপ ৭০ থেকে ২৫০ এর মধ্যে হতে হবে');
      return;
    }

    if (diastolic < 40 || diastolic > 180) {
      alert('ডায়াস্টোলিক রক্তচাপ ৪০ থেকে ১৮০ এর মধ্যে হতে হবে');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      console.log('Submitting BP data:', formData);
      console.log('API URL:', `${API_BASE_URL}/mother/bp-tracking`);
      
      const response = await fetch(`${API_BASE_URL}/mother/bp-tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      
      if (response.ok && data.Success) {
        alert('রক্তচাপের তথ্য সফলভাবে সংরক্ষিত হয়েছে');
        setFormData({
          systolic: '',
          diastolic: '',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          notes: ''
        });
        setShowAddForm(false);
        fetchBPHistory();
      } else {
        alert(data.Message || 'রক্তচাপের তথ্য সংরক্ষণে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error saving BP entry:', error);
      alert('রক্তচাপের তথ্য সংরক্ষণে সমস্যা হয়েছে');
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm('আপনি কি এই রক্তচাপের তথ্য মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/mother/bp-tracking/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.Success) {
        alert('রক্তচাপের তথ্য মুছে ফেলা হয়েছে');
        fetchBPHistory();
      } else {
        alert(data.Message || 'রক্তচাপের তথ্য মুছতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting BP entry:', error);
      alert('রক্তচাপের তথ্য মুছতে সমস্যা হয়েছে');
    }
  };

  const getBPStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'elevated':
        return 'bg-yellow-100 text-yellow-800';
      case 'high-stage1':
        return 'bg-orange-100 text-orange-800';
      case 'high-stage2':
        return 'bg-red-100 text-red-800';
      case 'crisis':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBPStatusLabel = (status) => {
    const labels = {
      'normal': 'স্বাভাবিক',
      'elevated': 'সতর্কতা',
      'high-stage1': 'উচ্চ (পর্যায় ১)',
      'high-stage2': 'উচ্চ (পর্যায় ২)',
      'crisis': 'জরুরি অবস্থা'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">রক্তচাপ ট্র্যাকার</h2>
              <p className="text-red-100 text-sm mt-1">আপনার রক্তচাপ নিয়মিত পর্যবেক্ষণ করুন</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">লোড হচ্ছে...</p>
            </div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Latest Reading */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-700">সর্বশেষ রিডিং</h3>
                  </div>
                  {statistics.latestReading ? (
                    <>
                      <p className="text-2xl font-bold text-red-600">
                        {statistics.latestReading.systolic}/{statistics.latestReading.diastolic}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">mmHg</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">কোনো রিডিং নেই</p>
                  )}
                </div>

                {/* Average BP */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-700">গড় রক্তচাপ</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {statistics.averageSystolic}/{statistics.averageDiastolic}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">mmHg</p>
                </div>

                {/* Total Readings */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-700">মোট রিডিং</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{statistics.totalReadings}</p>
                  <p className="text-xs text-gray-600 mt-1">সংরক্ষিত</p>
                </div>

                {/* Status Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-700">স্বাভাবিক রিডিং</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{statistics.normalCount}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {statistics.totalReadings > 0 
                      ? `${Math.round((statistics.normalCount / statistics.totalReadings) * 100)}% স্বাভাবিক`
                      : 'কোনো ডেটা নেই'
                    }
                  </p>
                </div>
              </div>

              {/* Add BP Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {showAddForm ? 'ফর্ম বন্ধ করুন' : 'নতুন রক্তচাপ যোগ করুন'}
                </button>
              </div>

              {/* Add BP Form */}
              {showAddForm && (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border-2 border-red-200 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">রক্তচাপের তথ্য যোগ করুন</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          সিস্টোলিক (Systolic) *
                        </label>
                        <input
                          type="number"
                          name="systolic"
                          value={formData.systolic}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="উদাহরণ: 120"
                          min="70"
                          max="250"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">mmHg (৭০-২৫০)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ডায়াস্টোলিক (Diastolic) *
                        </label>
                        <input
                          type="number"
                          name="diastolic"
                          value={formData.diastolic}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="উদাহরণ: 80"
                          min="40"
                          max="180"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">mmHg (৪০-১৮০)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          তারিখ
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          সময়
                        </label>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        নোট (ঐচ্ছিক)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows="2"
                        placeholder="অতিরিক্ত তথ্য লিখুন..."
                        maxLength="500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </form>
                </div>
              )}

              {/* BP History Table */}
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4">
                  <h3 className="text-lg font-bold">রক্তচাপের ইতিহাস</h3>
                </div>

                {bpEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">এখনো কোনো রক্তচাপের তথ্য সংরক্ষিত হয়নি</p>
                    <p className="text-gray-400 text-sm mt-2">উপরের বাটন ক্লিক করে নতুন তথ্য যোগ করুন</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            তারিখ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            সময়
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            সিস্টোলিক
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            ডায়াস্টোলিক
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            স্ট্যাটাস
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            সপ্তাহ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            কার্যক্রম
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bpEntries.map((entry) => (
                          <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(entry.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatTime(entry.time)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-lg font-bold text-red-600">{entry.systolic}</span>
                              <span className="text-xs text-gray-500 ml-1">mmHg</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-lg font-bold text-red-600">{entry.diastolic}</span>
                              <span className="text-xs text-gray-500 ml-1">mmHg</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBPStatusColor(entry.status)}`}>
                                {getBPStatusLabel(entry.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {entry.pregnancyWeek ? `${entry.pregnancyWeek} সপ্তাহ` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleDelete(entry._id)}
                                className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                              >
                                মুছুন
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* BP Guide */}
              <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  রক্তচাপের মাত্রা বোঝার নির্দেশিকা
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="font-bold text-green-800">স্বাভাবিক</p>
                    <p className="text-green-700">&lt;120/&lt;80 mmHg</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-bold text-yellow-800">সতর্কতা</p>
                    <p className="text-yellow-700">120-129/&lt;80 mmHg</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <p className="font-bold text-orange-800">উচ্চ (পর্যায় ১)</p>
                    <p className="text-orange-700">130-139/80-89 mmHg</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <p className="font-bold text-red-800">উচ্চ (পর্যায় ২)</p>
                    <p className="text-red-700">140+/90+ mmHg</p>
                  </div>
                  <div className="bg-red-600 p-3 rounded-lg">
                    <p className="font-bold text-white">জরুরি অবস্থা</p>
                    <p className="text-red-100">&gt;180/&gt;120 mmHg</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="font-bold text-blue-800">পরামর্শ</p>
                    <p className="text-blue-700">নিয়মিত পর্যবেক্ষণ করুন</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BPTracker;
