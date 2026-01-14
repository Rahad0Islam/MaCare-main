import React, { useState } from 'react';
import { Activity, Scale, HeartPulse, Calendar } from 'lucide-react';
import KickCounter from './KickCounter';
import KickCounterHistory from './KickCounterHistory';
import WeightHeightTracker from './WeightHeightTracker';
import BPTracker from './BPTracker';

const HealthTools = () => {
  const [activeModal, setActiveModal] = useState(null);

  const tools = [
    {
      id: 'kick-counter',
      name: 'কিক কাউন্টার',
      description: 'শিশুর নড়াচড়া ট্র্যাক করুন',
      icon: Activity,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      iconColor: 'text-pink-600'
    },
    {
      id: 'weight-tracker',
      name: 'ওজন ও উচ্চতা',
      description: 'ওজন বৃদ্ধি পর্যবেক্ষণ করুন',
      icon: Scale,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'bp-tracker',
      name: 'রক্তচাপ',
      description: 'রক্তচাপ নিয়মিত পর্যবেক্ষণ করুন',
      icon: HeartPulse,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">স্বাস্থ্য পর্যবেক্ষণ সরঞ্জাম</h2>
        <p className="text-gray-600">আপনার গর্ভাবস্থায় গুরুত্বপূর্ণ স্বাস্থ্য তথ্য ট্র্যাক করুন</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveModal(tool.id)}
              className={`${tool.bgColor} ${tool.borderColor} border-2 rounded-2xl p-8 text-left hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
              <p className="text-gray-600 text-sm">{tool.description}</p>
              <div className="mt-4 flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900">
                <span>খুলুন</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">গুরুত্বপূর্ণ তথ্য</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• নিয়মিত আপনার স্বাস্থ্য তথ্য রেকর্ড করুন</li>
              <li>• যেকোনো অস্বাভাবিক পরিবর্তন দেখলে ডাক্তারের পরামর্শ নিন</li>
              <li>• প্রতিটি সরঞ্জামে ক্লিক করে বিস্তারিত তথ্য দেখুন</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'kick-counter' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">কিক কাউন্টার</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
              <div className="mb-8">
                <KickCounter onSessionComplete={() => {}} />
              </div>
              <div className="mt-8">
                <KickCounterHistory />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'weight-tracker' && (
        <WeightHeightTracker
          isOpen={true}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'bp-tracker' && (
        <BPTracker
          isOpen={true}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default HealthTools;
