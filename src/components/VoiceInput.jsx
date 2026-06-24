import { useState, useEffect, useRef } from 'react';
import './VoiceInput.css';

function VoiceInput({ onTranscript, disabled }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const isListeningRef = useRef(false);   // Fix 1 — tracks user intent separately from state
  

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;   // ← FIX 2 goes here, right with the other config lines

      recognition.onresult = (event) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];

          if (result.isFinal) {
            finalTranscriptRef.current += result[0].transcript + ' ';
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        onTranscript((finalTranscriptRef.current + interimTranscript).trim());
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);

        // Permission denied or no mic — stop trying entirely, don't auto-restart
        if (event.error === 'not-allowed' || event.error === 'no-speech' || event.error === 'audio-capture') {
            isListeningRef.current = false;
        }
    };

    recognition.onend = () => {
        if (isListeningRef.current) {
            try {
                recognition.start();
            } catch (e) {
                isListeningRef.current = false;
                setListening(false);
            }
        } else {
            setListening(false);
        }
    };

      recognitionRef.current = recognition;
    }
  }, [onTranscript]);

  useEffect(() => {
    if (disabled && listening && recognitionRef.current) {
      isListeningRef.current = false;   // ← part of Fix 1 — clear intent flag too
      recognitionRef.current.stop();
      setListening(false);
    }
  }, [disabled, listening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      isListeningRef.current = false;   // ← part of Fix 1
      recognitionRef.current.stop();
      setListening(false);
    } else {
      finalTranscriptRef.current = '';
      isListeningRef.current = true;    // ← part of Fix 1
      recognitionRef.current.start();
      setListening(true);
    }
  };

  if (!supported) return null;

  return (
    <div>
      <button
        onClick={toggleListening}
        disabled={disabled}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          border: `2px solid ${listening ? '#dc2626' : '#4f46e5'}`,
          background: listening ? '#fee2e2' : '#eef2ff',
          color: listening ? '#dc2626' : '#4f46e5',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.2s',
        }}
      >
        {listening ? '🔴 Stop recording' : '🎤 Speak answer'}

        {/* ← — the pulsing dot, only shown while listening */}
        {listening && (
          <span className="pulse-dot" />
        )}
      </button>

      <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
        Tip: speak in short phrases and pause briefly between sentences for best accuracy.
      </p>
    </div>
  );
}

export default VoiceInput;