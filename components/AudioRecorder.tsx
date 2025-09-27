'use client';

import { useState, useRef, useEffect } from 'react';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import { Mic, Square, Volume2, Download } from 'lucide-react';

// Define the interface locally
interface SpeechTranscriptionResult {
  text: string;
  confidence: number;
  language: string;
  duration: number;
  method?: string;
}

interface AudioRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export default function AudioRecorder({ onTranscription, disabled = false }: AudioRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<SpeechTranscriptionResult | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [audioUrl]);

  const startListening = async () => {
    try {
      // Check if Web Speech API is available
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Web Speech API not supported in this browser. Please use Chrome or Edge.');
        return;
      }

      // Start audio recording for optional file saving
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      // Setup MediaRecorder for optional audio file
      const options = MediaRecorder.isTypeSupported('audio/wav') 
        ? { mimeType: 'audio/wav' } 
        : { mimeType: 'audio/webm;codecs=opus' };
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start audio recording
      mediaRecorder.start();

      // Setup Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('🎙️ Speech recognition started');
        setIsListening(true);
        setIsProcessing(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        console.log('🎙️ Speech recognition result:', transcript);
        
        const result: SpeechTranscriptionResult = {
          text: transcript,
          confidence: confidence,
          language: 'en-US',
          duration: 0, // We'll calculate this when we stop
          method: 'browser_web_speech_api'
        };

        setTranscriptionResult(result);
        onTranscription(transcript);
      };

      recognition.onerror = (event) => {
        console.error('🎙️ Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'no-speech') {
          alert('No speech detected. Please try speaking again.');
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log('🎙️ Speech recognition ended');
        setIsListening(false);
        
        // Stop audio recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      };

      // Start speech recognition
      recognition.start();

    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const clearTranscription = () => {
    setTranscriptionResult(null);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const downloadAudio = () => {
    if (audioBlob && audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording-${Date.now()}.${audioBlob.type.includes('wav') ? 'wav' : 'webm'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Mic className="w-5 h-5 text-athena-gold" />
        <h3 className="text-lg font-semibold text-athena-blue">Real-time Speech-to-Text</h3>
        <div className="ml-auto text-xs text-gray-500">
          Powered by Web Speech API
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isListening && (
            <button
              onClick={startListening}
              disabled={disabled}
              className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
            >
              <Mic className="w-5 h-5" />
              <span>Start Listening</span>
            </button>
          )}

          {isListening && (
            <button
              onClick={stopListening}
              className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors text-lg font-medium animate-pulse"
            >
              <Square className="w-5 h-5" />
              <span>Stop Listening</span>
            </button>
          )}
        </div>

        {/* Status Indicator */}
        {isListening && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
              <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Listening... Speak now!</span>
            </div>
          </div>
        )}

        {/* Transcription Results */}
        {transcriptionResult && (
          <div className="mt-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Transcription</span>
                </div>
                <div className="flex items-center space-x-2">
                  {audioBlob && (
                    <button
                      onClick={downloadAudio}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Audio</span>
                    </button>
                  )}
                  <button
                    onClick={clearTranscription}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="text-gray-800 bg-white p-3 rounded border">
                "{transcriptionResult.text}"
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Confidence: {Math.round(transcriptionResult.confidence * 100)}% • 
                Method: {transcriptionResult.method}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">How to use:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Start Listening" to begin real-time speech recognition</li>
            <li>Speak your thoughts clearly into the microphone</li>
            <li>Click "Stop Listening" when finished (or it will stop automatically)</li>
            <li>The transcribed text will appear instantly and be added to your journal</li>
          </ol>
          <p className="text-xs text-gray-500 mt-2">
            Note: This uses real-time speech recognition. The audio file is optionally saved for other APIs if needed.
          </p>
        </div>
      </div>
    </div>
  );
}
