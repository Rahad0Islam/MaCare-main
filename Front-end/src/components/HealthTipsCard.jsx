import React, { useState, useEffect } from 'react';
import { AlertTriangle, Heart, Activity, TrendingUp, CheckCircle, XCircle, Info } from 'lucide-react';

const HealthTipsCard = () => {
  const [healthTips, setHealthTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealthTips();
  }, []);

  const fetchHealthTips = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${API_BASE_URL}/mother/health-tips`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.Success) {
        setHealthTips(data.data);
      } else {
        setError('স্বাস্থ্য পরামর্শ লোড করতে ব্যর্থ');
      }
    } catch (err) {
      console.error('Error fetching health tips:', err);
      setError('স্বাস্থ্য পরামর্শ লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'emergency':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-800',
          badge: 'bg-red-600',
          icon: 'text-red-600'
        };
      case 'high':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          text: 'text-orange-800',
          badge: 'bg-orange-600',
          icon: 'text-orange-600'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-800',
          badge: 'bg-yellow-600',
          icon: 'text-yellow-600'
        };
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-300',
          text: 'text-green-800',
          badge: 'bg-green-600',
          icon: 'text-green-600'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-600">স্বাস্থ্য পরামর্শ লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!healthTips || (!healthTips.bpTips && !healthTips.bmiTips)) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
        <div className="text-center">
          <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-blue-900 mb-2">স্বাস্থ্য পরামর্শ উপলব্ধ নেই</h3>
          <p className="text-blue-700">
            আপনার স্বাস্থ্য পরামর্শ দেখতে প্রথমে রক্তচাপ এবং ওজন/উচ্চতার তথ্য যোগ করুন
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      {healthTips.hasCriticalAlert && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-6 shadow-xl animate-pulse">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">⚠️ জরুরি সতর্কতা!</h3>
              <p className="text-red-100 text-lg">
                আপনার স্বাস্থ্য পরিস্থিতি জরুরি মনোযোগ প্রয়োজন। অনুগ্রহ করে অবিলম্বে ডাক্তার বা নিকটস্থ হাসপাতালে যোগাযোগ করুন।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8" />
          <h2 className="text-2xl font-bold">ব্যক্তিগত স্বাস্থ্য পরামর্শ</h2>
        </div>
        <p className="text-purple-100">আপনার সর্বশেষ স্বাস্থ্য তথ্যের ভিত্তিতে বিশেষ পরামর্শ</p>
      </div>

      {/* BP Tips Card */}
      {healthTips.bpTips && (
        <div className={`${getRiskColor(healthTips.bpTips.riskLevel).bg} border-2 ${getRiskColor(healthTips.bpTips.riskLevel).border} rounded-2xl p-6 shadow-lg`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${getRiskColor(healthTips.bpTips.riskLevel).badge} rounded-xl flex items-center justify-center`}>
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${getRiskColor(healthTips.bpTips.riskLevel).text}`}>
                  {healthTips.bpTips.label}
                </h3>
                <p className="text-sm text-gray-600">
                  রেকর্ড: {formatDate(healthTips.bpTips.recordedDate)}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 ${getRiskColor(healthTips.bpTips.riskLevel).badge} text-white rounded-full text-sm font-bold`}>
              {healthTips.bpTips.riskLevel === 'high' ? 'উচ্চ ঝুঁকি' : 
               healthTips.bpTips.riskLevel === 'medium' ? 'মাঝারি ঝুঁকি' : 'নিম্ন ঝুঁকি'}
            </span>
          </div>

          {/* Current Reading */}
          <div className="bg-white bg-opacity-60 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700 font-semibold mb-2">বর্তমান রক্তচাপ:</p>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-gray-900">
                {healthTips.bpTips.currentReading.systolic}/{healthTips.bpTips.currentReading.diastolic}
                <span className="text-sm text-gray-600 ml-2">mmHg</span>
              </div>
              <div className={`px-3 py-1 ${getRiskColor(healthTips.bpTips.riskLevel).badge} text-white rounded-lg text-sm font-semibold`}>
                {healthTips.bpTips.bpRange.systolic} / {healthTips.bpTips.bpRange.diastolic}
              </div>
            </div>
          </div>

          {/* Overview */}
          {healthTips.bpTips.overview && (
            <div className="mb-4 p-4 bg-white bg-opacity-60 rounded-xl">
              <p className={`${getRiskColor(healthTips.bpTips.riskLevel).text} font-medium`}>
                {healthTips.bpTips.overview}
              </p>
            </div>
          )}

          {/* Health Tips */}
          <div className="mb-4">
            <h4 className={`font-bold ${getRiskColor(healthTips.bpTips.riskLevel).text} mb-3 flex items-center gap-2`}>
              <CheckCircle className="w-5 h-5" />
              করণীয়:
            </h4>
            <ul className="space-y-2">
              {healthTips.bpTips.healthTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 bg-white bg-opacity-60 p-3 rounded-lg">
                  <span className={`w-6 h-6 ${getRiskColor(healthTips.bpTips.riskLevel).badge} text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                    {index + 1}
                  </span>
                  <span className="text-gray-800">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to Avoid */}
          {healthTips.bpTips.avoid && (
            <div className="mb-4">
              <h4 className={`font-bold ${getRiskColor(healthTips.bpTips.riskLevel).text} mb-3 flex items-center gap-2`}>
                <XCircle className="w-5 h-5" />
                বর্জনীয়:
              </h4>
              <ul className="space-y-2">
                {healthTips.bpTips.avoid.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white bg-opacity-60 p-3 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Emergency Signs */}
          {healthTips.bpTips.emergencySigns && (
            <div className="mb-4">
              <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                জরুরি লক্ষণ:
              </h4>
              <ul className="space-y-2">
                {healthTips.bpTips.emergencySigns.map((sign, index) => (
                  <li key={index} className="flex items-start gap-3 bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-900 font-medium">{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Foods */}
          {healthTips.bpTips.recommendedFoods && (
            <div className="mb-4">
              <h4 className={`font-bold ${getRiskColor(healthTips.bpTips.riskLevel).text} mb-3`}>
                প্রস্তাবিত খাবার:
              </h4>
              <div className="flex flex-wrap gap-2">
                {healthTips.bpTips.recommendedFoods.map((food, index) => (
                  <span key={index} className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-800 shadow-sm">
                    {food}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action */}
          <div className={`${getRiskColor(healthTips.bpTips.riskLevel).badge} text-white p-4 rounded-xl font-bold text-center text-lg`}>
            📋 {healthTips.bpTips.action}
          </div>
        </div>
      )}

      {/* BMI Tips Card */}
      {healthTips.bmiTips && (
        <div className={`${getRiskColor(healthTips.bmiTips.riskLevel).bg} border-2 ${getRiskColor(healthTips.bmiTips.riskLevel).border} rounded-2xl p-6 shadow-lg`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${getRiskColor(healthTips.bmiTips.riskLevel).badge} rounded-xl flex items-center justify-center`}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${getRiskColor(healthTips.bmiTips.riskLevel).text}`}>
                  {healthTips.bmiTips.label}
                </h3>
                <p className="text-sm text-gray-600">
                  রেকর্ড: {formatDate(healthTips.bmiTips.recordedDate)}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 ${getRiskColor(healthTips.bmiTips.riskLevel).badge} text-white rounded-full text-sm font-bold`}>
              {healthTips.bmiTips.riskLevel === 'emergency' ? 'জরুরি' :
               healthTips.bmiTips.riskLevel === 'high' ? 'উচ্চ ঝুঁকি' : 
               healthTips.bmiTips.riskLevel === 'medium' ? 'মাঝারি ঝুঁকি' : 'স্বাভাবিক'}
            </span>
          </div>

          {/* Current BMI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white bg-opacity-60 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">বর্তমান BMI</p>
              <p className="text-3xl font-bold text-gray-900">{healthTips.bmiTips.currentBMI.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mt-1">{healthTips.bmiTips.range}</p>
            </div>
            <div className="bg-white bg-opacity-60 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">বর্তমান ওজন</p>
              <p className="text-3xl font-bold text-gray-900">{healthTips.bmiTips.currentWeight}</p>
              <p className="text-sm text-gray-600 mt-1">কেজি</p>
            </div>
            <div className="bg-white bg-opacity-60 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">উচ্চতা</p>
              <p className="text-3xl font-bold text-gray-900">{healthTips.bmiTips.height}</p>
              <p className="text-sm text-gray-600 mt-1">সেমি</p>
            </div>
          </div>

          {/* Category */}
          <div className="mb-4 p-4 bg-white bg-opacity-60 rounded-xl">
            <p className={`text-lg font-bold ${getRiskColor(healthTips.bmiTips.riskLevel).text}`}>
              শ্রেণী: {healthTips.bmiTips.category}
            </p>
          </div>

          {/* Health Risks */}
          {healthTips.bmiTips.healthRisks && healthTips.bmiTips.healthRisks.length > 0 && (
            <div className="mb-4">
              <h4 className={`font-bold ${getRiskColor(healthTips.bmiTips.riskLevel).text} mb-3 flex items-center gap-2`}>
                <AlertTriangle className="w-5 h-5" />
                স্বাস্থ্য ঝুঁকি:
              </h4>
              <ul className="space-y-2">
                {healthTips.bmiTips.healthRisks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white bg-opacity-60 p-3 rounded-lg">
                    <AlertTriangle className={`w-5 h-5 ${getRiskColor(healthTips.bmiTips.riskLevel).icon} flex-shrink-0`} />
                    <span className="text-gray-800">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Health Tips */}
          <div className="mb-4">
            <h4 className={`font-bold ${getRiskColor(healthTips.bmiTips.riskLevel).text} mb-3 flex items-center gap-2`}>
              <CheckCircle className="w-5 h-5" />
              স্বাস্থ্য পরামর্শ:
            </h4>
            <ul className="space-y-2">
              {healthTips.bmiTips.healthTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 bg-white bg-opacity-60 p-3 rounded-lg">
                  <span className={`w-6 h-6 ${getRiskColor(healthTips.bmiTips.riskLevel).badge} text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                    {index + 1}
                  </span>
                  <span className="text-gray-800">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Follow-up */}
          {healthTips.bmiTips.recommendedFollowUp && (
            <div className="mb-4">
              <h4 className={`font-bold ${getRiskColor(healthTips.bmiTips.riskLevel).text} mb-3`}>
                পরবর্তী পদক্ষেপ:
              </h4>
              <ul className="space-y-2">
                {healthTips.bmiTips.recommendedFollowUp.map((followUp, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white bg-opacity-60 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-800">{followUp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action */}
          <div className={`${getRiskColor(healthTips.bmiTips.riskLevel).badge} text-white p-4 rounded-xl font-bold text-center text-lg`}>
            📋 {healthTips.bmiTips.action}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-gray-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-gray-800 mb-2">দাবি পরিত্যাগ (Disclaimer)</h4>
            <p className="text-gray-700 text-sm">
              এই তথ্যগুলো সাধারণ স্বাস্থ্য নির্দেশনা। ব্যক্তিগত চিকিৎসার জন্য অবশ্যই ডাক্তার বা প্রশিক্ষিত মিডওয়াইফের পরামর্শ নিন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTipsCard;
