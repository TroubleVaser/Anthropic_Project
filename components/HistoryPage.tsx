
import React from 'react';
import { EMOTION_STYLES } from '../constants';
import { Emotion } from '../types';

const HistoryPage: React.FC = () => {
    const weeklyData: { day: string; emotion: Emotion }[] = [
        { day: 'Mon', emotion: 'joy' },
        { day: 'Tue', emotion: 'anxiety' },
        { day: 'Wed', emotion: 'sad' },
        { day: 'Thu', emotion: 'joy' },
        { day: 'Fri', emotion: 'ennui' },
        { day: 'Sat', emotion: 'sarcasm' },
        { day: 'Sun', emotion: 'default' },
    ];
    
    const historicalEntries = [
        { date: 'Yesterday, 8:15 PM', emotion: 'sarcasm', snippet: 'Oh, great. Another bug. Just what I needed...'},
        { date: 'Friday, 9:30 AM', emotion: 'ennui', snippet: 'Another meeting that could have been an email.'},
        { date: 'Thursday, 6:00 PM', emotion: 'joy', snippet: 'Finally finished the project! It feels so good to be done.'},
    ];

  return (
    <div className="p-4 text-white animate-fade-in">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Your Emotional History</h1>

        <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">This Week's Breakdown</h2>
            <div className="flex justify-around items-end h-48 p-4 bg-gray-900/50 rounded-lg">
                {weeklyData.map(({ day, emotion }) => {
                    const style = EMOTION_STYLES[emotion];
                    const randomHeight = Math.floor(Math.random() * 80) + 20; // % height
                    return (
                        <div key={day} className="flex flex-col items-center w-1/8" title={emotion}>
                            <div className="w-full h-full flex items-end">
                                <div
                                    className={`w-full rounded-t-md bg-gradient-to-t ${style.gradient} transition-all duration-500 hover:shadow-lg ${style.shadow}`}
                                    style={{ height: `${randomHeight}%` }}
                                ></div>
                            </div>
                            <p className="mt-2 text-sm font-medium text-gray-400">{day}</p>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-teal-300">Recent Entries</h2>
            <div className="space-y-4">
                {historicalEntries.map((entry, index) => {
                    const style = EMOTION_STYLES[entry.emotion];
                    return (
                        <div key={index} className={`p-4 rounded-lg flex items-start space-x-4 border-l-4 bg-gray-800`} style={{borderColor: EMOTION_STYLES[entry.emotion].gradient.split(' ')[1].replace('from-','')}}>
                            <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-br ${style.gradient}`}></div>
                            <div>
                                <p className="font-semibold text-gray-200">{entry.snippet}</p>
                                <p className="text-sm text-gray-400">{entry.date} - <span className="font-medium capitalize">{entry.emotion}</span></p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
        
        {/* FIX: Removed non-standard 'jsx' attribute from style tag. */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;
