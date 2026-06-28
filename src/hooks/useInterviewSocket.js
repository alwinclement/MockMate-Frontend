import { useEffect, useState , useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
  receiveQuestion,
  sessionCompleted,
  setError,
} from '../store/liveInterviewSlice';

export function useInterviewSocket(sessionId) {
  const dispatch = useDispatch();
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);   // ADD THIS

  useEffect(() => {
    if (!sessionId) return;

    const token = localStorage.getItem('token');

    // Create STOMP client over SockJS
    const client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_BASE_URL),

      // Pass JWT token in STOMP connect headers
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        console.log('WebSocket connected for session', sessionId);

        // Subscribe to this session's topic
        client.subscribe(`/topic/session/${sessionId}`, (message) => {
          const payload = JSON.parse(message.body);

          if (payload.event === 'QUESTION') {
            dispatch(receiveQuestion(payload));
          } else if (payload.event === 'COMPLETED') {
            dispatch(sessionCompleted(payload));
          } else if (payload.event === 'ERROR') {
            dispatch(setError(payload.errorMessage));
          }

        });
        setIsConnected(true);   // ADD THIS — signal subscription is ready
      },

      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);   // ADD THIS
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        dispatch(setError('Connection error. Please try again.'));
      },

      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    // Cleanup on unmount
    return () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
    };
  }, [sessionId, dispatch]);

  // Function to send answer over WebSocket
  const sendAnswer = useCallback((answerPayload) => {
    if (clientRef.current?.active) {
      clientRef.current.publish({
        destination: '/app/interview/answer',
        body: JSON.stringify(answerPayload),
      });
    }
  }, []);

  return { sendAnswer, isConnected };
}