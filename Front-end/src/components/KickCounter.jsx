import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Clock, Activity } from 'lucide-react';

const KickCounter = ({ onSessionComplete, inModal = false }) => {
  const [kickCount, setKickCount] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [firstKickTime, setFirstKickTime] = useState(null);
  const [lastKickTime, setLastKickTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const intervalRef = useRef(null);

  // Update session duration every second when active
  useEffect(() => {
    if (isSessionActive && firstKickTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now - firstKickTime) / 1000);
        setSessionDuration(duration);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSessionActive, firstKickTime]);

  // Handle adding a kick
  const handleAddKick = () => {
    const now = new Date();
    
    if (!isSessionActive) {
      // First kick - start session
      setIsSessionActive(true);
      setFirstKickTime(now);
      setLastKickTime(now);
      setKickCount(1);
    } else {
      // Subsequent kicks
      setKickCount(prev => prev + 1);
      setLastKickTime(now);
    }
  };

  // Handle removing a kick
  const handleRemoveKick = () => {
    if (kickCount > 0) {
      setKickCount(prev => prev - 1);
      
      if (kickCount === 1) {
        // Reset session if no kicks left
        handleReset();
      } else {
        setLastKickTime(new Date());
      }
    }
  };

  // Handle reset
  const handleReset = () => {
    setKickCount(0);
    setIsSessionActive(false);
    setFirstKickTime(null);
    setLastKickTime(null);
    setSessionDuration(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Handle complete session
  const handleComplete = async () => {
    if (!firstKickTime || !lastKickTime || kickCount === 0) {
      alert('অনুগ্রহ করে অন্তত একটি লাথি রেকর্ড করুন');
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${API_BASE_URL}/mother/kick-counter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstKickTime: firstKickTime.toISOString(),
          lastKickTime: lastKickTime.toISOString(),
          kickCount: kickCount
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('সেশন সফলভাবে সংরক্ষিত হয়েছে!');
        handleReset();
        if (onSessionComplete) {
          onSessionComplete(data.data);
        }
      } else {
        throw new Error(data.message || 'সেশন সংরক্ষণে ব্যর্থ');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      alert('সেশন সংরক্ষণে ত্রুটি: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('bn-BD', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className={inModal ? "" : "bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
          <Activity className="w-8 h-8 text-pink-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">কিক কাউন্টার</h2>
        <p className="text-gray-600">শিশুর নড়াচড়া ট্র্যাক করুন</p>
      </div>

      {/* Kick Count Display */}
      <div className="bg-white rounded-3xl shadow-lg p-12 mb-8">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">মোট লাথি</p>
          <div className="text-8xl font-bold text-pink-600 mb-8 tabular-nums">
            {kickCount}
          </div>
          
          {/* Add/Remove Buttons */}
          <div className="flex gap-6 justify-center mb-8">
            <button
              onClick={handleRemoveKick}
              disabled={kickCount === 0}
              className="w-20 h-20 rounded-full bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-red-600 disabled:text-gray-400 text-4xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              −
            </button>
            <button
              onClick={handleAddKick}
              className="w-20 h-20 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-4xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Session Info */}
        {isSessionActive && (
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                প্রথম লাথি
              </span>
              <span className="font-mono text-gray-800 font-semibold">
                {formatTime(firstKickTime)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                শেষ লাথি
              </span>
              <span className="font-mono text-gray-800 font-semibold">
                {formatTime(lastKickTime)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm bg-purple-50 rounded-lg p-3">
              <span className="text-purple-700 font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                সেশন সময়কাল
              </span>
              <span className="font-mono text-purple-900 font-bold text-lg">
                {formatDuration(sessionDuration)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleReset}
          disabled={!isSessionActive}
          className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-5 h-5" />
          রিসেট
        </button>
        <button
          onClick={handleComplete}
          disabled={!isSessionActive || kickCount === 0 || isSaving}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              সংরক্ষণ করা হচ্ছে...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              সম্পূর্ণ
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>টিপস:</strong> শিশুর নড়াচড়া অনুভব করার সাথে সাথে + বাটনে ক্লিক করুন। 
          সেশন শেষ হলে "সম্পূর্ণ" বাটনে ক্লিক করে সংরক্ষণ করুন।
        </p>
      </div>
    </div>
  );
};

export default KickCounter;
