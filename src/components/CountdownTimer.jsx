import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tickTimer } from '../store/liveInterviewSlice';

function CountdownTimer({ onTimeUp }) {
  const dispatch = useDispatch();
  const timeRemaining = useSelector((s) => s.liveInterview.timeRemaining);
  const status = useSelector((s) => s.liveInterview.status);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (status !== 'ACTIVE') return;

    // Reset the "already fired" guard whenever a fresh question starts
    hasFiredRef.current = false;

    const interval = setInterval(() => {
      dispatch(tickTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [status, dispatch]);

  // Watches timeRemaining directly and fires exactly once per question
  useEffect(() => {
    if (
      timeRemaining <= 0 &&
      status === 'ACTIVE' &&
      !hasFiredRef.current
    ) {
      hasFiredRef.current = true;   // prevent firing twice for the same question
      if (onTimeUp) onTimeUp();
    }
  }, [timeRemaining, status, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isUrgent = timeRemaining <= 30;
  const isCritical = timeRemaining <= 10;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
      borderRadius: 8,
      background: isCritical ? '#fee2e2' : isUrgent ? '#fef3c7' : '#f0fdf4',
      border: `1px solid ${isCritical ? '#fca5a5' : isUrgent ? '#fcd34d' : '#86efac'}`,
      transition: 'all 0.3s',
    }}>
      <span style={{ fontSize: 18 }}>
        {isCritical ? '🔴' : isUrgent ? '⚠️' : '⏱️'}
      </span>
      <span style={{
        fontSize: 22,
        fontWeight: 700,
        fontFamily: 'monospace',
        color: isCritical ? '#dc2626' : isUrgent ? '#b45309' : '#15803d',
      }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

export default CountdownTimer;