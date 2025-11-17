import { useState, useRef, useCallback } from 'react';

const CHUNK_TIMESLICE_MS = 3000; // Analyze audio every 3 seconds

interface AudioVisualizerOptions {
  onChunkAvailable?: (chunk: Blob) => void;
}

export const useAudioVisualizer = ({ onChunkAvailable }: AudioVisualizerOptions = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [volume, setVolume] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const visualize = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (const amplitude of dataArray) {
        sum += Math.pow(amplitude / 128.0 - 1, 2);
      }
      const newVolume = Math.sqrt(sum / dataArray.length);
      setVolume(newVolume);
      animationFrameRef.current = requestAnimationFrame(visualize);
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setAudioBlob(null);
      audioChunksRef.current = [];

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          // For real-time analysis, create a blob from the chunk and send it via callback
          if (onChunkAvailable) {
              const chunkBlob = new Blob([event.data], { type: 'audio/webm' });
              onChunkAvailable(chunkBlob);
          }
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const completeBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(completeBlob);
        stream.getTracks().forEach(track => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
           audioContextRef.current.close();
        }
        setVolume(0);
      };

      mediaRecorderRef.current.start(CHUNK_TIMESLICE_MS);
      visualize();
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return { isRecording, audioBlob, volume, startRecording, stopRecording };
};
