
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Orb from './Orb';
import Recorder from './Recorder';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';
import { analyzeAudioForEmotion, analyzeAudioChunkForEmotion } from '../services/geminiService';
import { Emotion } from '../types';
import WeeklyToDo from './WeeklyToDo';
import Chatbot from './Chatbot';

const Dashboard: React.FC = () => {
  const [emotion, setEmotion] = useState<Emotion>('neutral');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [runningTranscript, setRunningTranscript] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  
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
    // setTranscript('Finalizing analysis...'); 
    // We keep the running transcript visible instead of replacing it immediately
    try {
      const result = await analyzeAudioForEmotion(audioBlob);
      setEmotion(result.emotion as Emotion || 'neutral');
      setTranscript(result.transcript);
      setRunningTranscript(result.transcript); // Sync final transcript
    } catch (err) {
      setError('Could not analyze your voice. Please try again.');
      setEmotion('neutral');
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

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [runningTranscript, transcript]);
  
  const handleStartRecording = () => {
    setEmotion('neutral');
    setTranscript(null);
    setError(null);
    setRunningTranscript('');
    startRecording();
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-full space-y-8">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Orb Section */}
        <div className="relative aspect-square flex items-center justify-center order-2 md:order-1">
          <Orb emotion={emotion} volume={volume} isRecording={isRecording} />
          
          {/* Emotion Label Badge */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 text-xs uppercase tracking-widest font-semibold text-white/80 pointer-events-none">
            {emotion}
          </div>
        </div>

        {/* Controls and Transcript Section */}
        <div className="flex flex-col justify-center space-y-6 order-1 md:order-2">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-center md:text-left text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                Elysian Orb
            </h1>
            <p className="text-gray-400 text-center md:text-left">
                Your emotional companion. Speak freely.
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
             <label className="text-xs font-medium text-gray-500 uppercase ml-1">Live Transcript</label>
             <div 
                ref={transcriptRef}
                className="w-full h-48 bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 overflow-y-auto border border-gray-700/50 shadow-inner transition-all duration-300 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20"
             >
                {isRecording ? (
                   <p className="text-gray-100 text-lg leading-relaxed whitespace-pre-wrap">
                      {runningTranscript}
                      <span className="inline-block w-2 h-5 ml-1 align-middle bg-purple-500 animate-pulse"></span>
                   </p>
                ) : transcript ? (
                    <p className="text-gray-100 text-lg leading-relaxed whitespace-pre-wrap">{transcript}</p>
                ) : isLoading ? (
                    <div className="flex items-center space-x-2 text-purple-400">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                ) : error ? (
                    <p className="text-red-400">{error}</p>
                ) : (
                    <p className="text-gray-600 italic">Ready to listen...</p>
                )}
             </div>
          </div>

          <div className="flex justify-center md:justify-start pt-4">
            <Recorder
                isRecording={isRecording}
                isLoading={isLoading}
                startRecording={handleStartRecording}
                stopRecording={stopRecording}
            />
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl mt-12 grid md:grid-cols-2 gap-8">
        <WeeklyToDo />
        <Chatbot />
      </div>
    </div>
  );
};

export default Dashboard;
