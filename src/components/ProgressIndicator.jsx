function ProgressIndicator({ current, total, answers }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
        fontSize: 13,
        color: '#6b7280',
      }}>
        <span>Question {current + 1} of {total}</span>
        <span>{answers.length} answered</span>
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => {
          const answered = answers.some(a => a.index === i);
          const isCurrent = i === current;
          const timedOut = answers.find(a => a.index === i)?.timedOut;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: timedOut
                  ? '#fca5a5'
                  : answered
                  ? '#4f46e5'
                  : isCurrent
                  ? '#a5b4fc'
                  : '#e5e7eb',
                transition: 'background 0.3s',
              }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: '#9ca3af' }}>
        <span>🟣 Answered</span>
        <span>🔵 Current</span>
        <span>🔴 Timed out</span>
        <span>⬜ Upcoming</span>
      </div>
    </div>
  );
}

export default ProgressIndicator;