
import React from 'react';

const GamificationPage: React.FC = () => {
  const achievements = [
    { name: 'First Recording', icon: '🎤', unlocked: true },
    { name: 'Week Streak', icon: '🔥', unlocked: true },
    { name: 'Joy Detected', icon: '😄', unlocked: true },
    { name: 'Anger Managed', icon: '🧘', unlocked: false },
    { name: 'Mindful Moment', icon: '🧠', unlocked: true },
    { name: 'Emotion Explorer', icon: '🧭', unlocked: false },
  ];

  return (
    <div className="p-4 text-white animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Your Growth Journey</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Avatar and Plant */}
        <div className="space-y-8">
          <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Your Companion</h2>
            <img src="https://picsum.photos/seed/labubu/200/200" alt="Labubu Avatar" className="w-40 h-40 mx-auto rounded-full border-4 border-purple-400 shadow-lg shadow-purple-500/30" />
            <p className="mt-4 text-lg font-bold">LABUBU</p>
            <p className="text-gray-400">Points: 1,250</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-green-300">Emotional Growth Plant</h2>
            <img src="https://picsum.photos/seed/plant/200/200" alt="Growth Plant" className="w-40 h-40 mx-auto" />
            <p className="mt-4 text-lg font-bold">Serenity Sprout</p>
            <p className="text-gray-400">Level 3: Keep nurturing it!</p>
             <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
              <div className="bg-green-400 h-2.5 rounded-full" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>

        {/* Accomplishments */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-amber-300">Accomplishments</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {achievements.map((ach, index) => (
              <div key={index} className={`flex flex-col items-center p-4 rounded-lg transition-all ${ach.unlocked ? 'bg-gray-700' : 'bg-gray-800 opacity-50'}`}>
                <span className="text-4xl">{ach.icon}</span>
                <p className="mt-2 text-sm text-center font-medium">{ach.name}</p>
              </div>
            ))}
          </div>
           <div className="mt-6 text-center">
                <h3 className="text-lg font-semibold text-rose-300">New Emotion Unlocked!</h3>
                <div className="mt-2 p-4 bg-gray-700 rounded-lg flex items-center justify-center space-x-4">
                    <span className="text-4xl">🌸</span>
                    <div>
                        <p className="font-bold text-lg">Sarcasm</p>
                        <p className="text-sm text-gray-300">You've expressed a complex emotion.</p>
                    </div>
                </div>
            </div>
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

export default GamificationPage;
