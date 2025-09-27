// src/components/SpeechRecorder.tsx
import { useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Button } from "@/components/ui/button";


interface SpeechRecorderAzureProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

const SpeechRecorderAzure: React.FC<SpeechRecorderAzureProps> = ({ onTranscription, disabled }) => {
  const [listening, setListening] = useState(false);
  const [recognizer, setRecognizer] = useState<sdk.SpeechRecognizer | null>(null);

  const fetchToken = async () => {
    const res = await fetch("http://localhost:5000/api/token");
    const data = await res.json();
    return data; // { token, region }
  };

  const startRecognition = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/token");
      const { token, region } = await res.json();
  
      console.log("Got token:", token, "Region:", region);
  
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = "en-US";
  
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const rec = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  
      rec.recognizing = (_, e) => {
        onTranscription(e.result.text);
      };
  
      rec.recognized = (_, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          onTranscription(e.result.text);
        }
      };
  
      rec.sessionStopped = () => {
        rec.stopContinuousRecognitionAsync();
        setListening(false);
      };
  
      rec.startContinuousRecognitionAsync();
      setRecognizer(rec);
      setListening(true);
    } catch (err) {
      console.error("Speech recognition error:", err);
    }
  };
  const stopRecognition = () => {
    recognizer?.stopContinuousRecognitionAsync(() => {
      setListening(false);
    });
  };

  return (
    <Button 
      type="button" 
      variant="oracle" 
      onClick={listening ? stopRecognition : startRecognition} 
      disabled={disabled}
    >
      {listening ? "⏹ Stop Recording" : "🎤 Start Recording"}
    </Button>
  );
};

export default SpeechRecorderAzure;