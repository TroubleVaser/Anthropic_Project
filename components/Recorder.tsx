
import React from 'react';

interface RecorderProps {
  isRecording: boolean;
  isLoading: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 7.5a6 6 0 006-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5v6.75h-7.5z" />
  </svg>
);

const StopIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
);

const Recorder: React.FC<RecorderProps> = ({ isRecording, isLoading, startRecording, stopRecording }) => {
  const handleClick = () => {
    if (isLoading) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const buttonClass = `
    relative w-24 h-24 rounded-full flex items-center justify-center 
    transition-all duration-300 ease-in-out transform
    focus:outline-none focus:ring-4 focus:ring-purple-500/50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${isRecording ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/40' : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/40'}
    ${isLoading ? 'bg-gray-600' : ''}
  `;

  return (
    <div className="flex flex-col items-center space-y-2">
      <button onClick={handleClick} className={buttonClass} disabled={isLoading}>
        {isLoading ? (
          <LoadingSpinner />
        ) : isRecording ? (
          <StopIcon className="w-10 h-10 text-white" />
        ) : (
          <MicIcon className="w-10 h-10 text-white" />
        )}
      </button>
      <p className="text-sm text-gray-400">
        {isLoading ? 'Processing...' : isRecording ? 'Tap to Stop' : 'Tap to Record'}
      </p>
    </div>
  );
};

export default Recorder;
