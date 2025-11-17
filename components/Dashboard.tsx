import React, { useState, useEffect, useCallback } from 'react';
import Orb from './Orb';
import Recorder from './Recorder';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';
import { analyzeAudioForEmotion, analyzeAudioChunkForEmotion } from '../services/geminiService';
import { Emotion } from '../types';
import WeeklyToDo from './WeeklyToDo';
import Chatbot from './Chatbot';

const Dashboard: React.FC = () => {
  const [emotion, setEmotion] = useState<Emotion>('default');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [runningTranscript, setRunningTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChunkAnalysis = useCallback(async (chunk: Blob) => {
    // Pass the running transcript as context
    const result = await analyzeAudioChunkForEmotion(chunk, runningTranscript);
    setEmotion(result.emotion);
    if (result.transcript) {
        setRunningTranscript(prev => (prev ? prev + ' ' : '') + result.transcript);
    }
  }, [runningTranscript]);

  const { isRecording, audioBlob, volume, startRecording, stopRecording } = useAudioVisualizer({
    onChunkAvailable: handleChunkAnalysis
  });

  const handleAnalysis = useCallback(async () => {
    if (!audioBlob) return;
    setIsLoading(true);
    setError(null);
    setTranscript('Analyzing your voice...');
    try {
      const result = await analyzeAudioForEmotion(audioBlob);
      setEmotion(result.emotion as Emotion || 'default');
      setTranscript(result.transcript);
    } catch (err) {
      setError('Could not analyze your voice. Please try again.');
      setTranscript(null);
      setEmotion('default');
    } finally {
      setIsLoading(false);
    }
  }, [audioBlob]);

  useEffect(() => {
    if (audioBlob) {
      handleAnalysis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob]);
  
  const handleStartRecording = () => {
    setEmotion('default');
    setTranscript(null);
    setError(null);
    setRunningTranscript('');
    startRecording();
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-full space-y-8">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-square flex items-center justify-center">
          <Orb emotion={emotion} volume={volume} isRecording={isRecording} />
        </div>
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center md:text-left text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Elysian Orb
          </h1>
          <p className="text-lg text-gray-300 text-center md:text-left">
            {isRecording 
              ? "The orb is listening and reacting in real-time..." 
              : transcript 
              ? "Here's what the orb understood:" 
              : "Press the orb to start sharing your feelings."}
          </p>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto border border-gray-700">
            {isRecording && <p className="text-gray-200">{runningTranscript || 'Listening...'}</p>}
            {!isRecording && isLoading && <p className="text-gray-400 animate-pulse">Analyzing...</p>}
            {!isRecording && error && <p className="text-red-400">{error}</p>}
            {!isRecording && transcript && !isLoading && <p className="text-gray-200">{transcript}</p>}
            {!isRecording && !transcript && !isLoading && !error && <p className="text-gray-500">Your transcript will appear here.</p>}
          </div>
        </div>
      </div>
      
      <Recorder
        isRecording={isRecording}
        isLoading={isLoading}
        startRecording={handleStartRecording}
        stopRecording={stopRecording}
      />
      
      <div className="w-full max-w-4xl mt-12 grid md:grid-cols-2 gap-8">
        <WeeklyToDo />
        <Chatbot />
      </div>
    </div>
  );
};

export default Dashboard;