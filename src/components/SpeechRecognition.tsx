import { Button } from "./ui/button";
import { Mic, MicOff } from "lucide-react";
import { useState, useEffect } from "react";

interface SpeechRecognitionProps {
  onTranscript: (text: string) => void;
}

export const SpeechRecognition = ({ onTranscript }: SpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ru-RU';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');

          onTranscript(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Button
      variant={isListening ? "destructive" : "outline"}
      size="sm"
      onClick={toggleListening}
      disabled={!recognition}
    >
      {isListening ? (
        <MicOff className="w-4 h-4 mr-2" />
      ) : (
        <Mic className="w-4 h-4 mr-2" />
      )}
      {isListening ? "Остановить" : "Начать запись"}
    </Button>
  );
};