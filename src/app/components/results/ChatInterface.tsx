import { useState, useRef, useEffect } from 'react';
import { Send, Zap } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

const C = {
  navy: 'var(--c-primary)',
  blue: 'var(--c-accent)',
  blueLight: 'var(--c-accent-light)',
  card: 'var(--c-bg-card)',
  border: 'var(--c-border)',
  textSub: 'var(--c-text-sub)',
};

interface ChatInterfaceProps { sessionId: string; }

export function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const { messages, isTyping, sendMessage } = useChat(sessionId);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim());
    setInput('');
  };

  const SUGGESTIONS = ['What are the critical issues?', 'Explain quantum risk', 'Show compliance status', 'Top 3 remediation steps'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 540, fontFamily: "'DM Sans', sans-serif", background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,22,40,0.06)' }}>
      <style>{`
        .qa-chat-input {
          flex: 1;
          background: #f8faff;
          border: none;
          color: ${C.navy};
          padding: 10px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          border-radius: 8px 0 0 8px;
        }
        .qa-chat-input::placeholder { color: ${C.textSub}; }
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, background: '#f8faff' }}>
        <div style={{ width: 36, height: 36, background: '#eff6ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={18} color={C.blue} />
        </div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.navy, fontSize: 14 }}>ARES AI Assistant</div>
          <div style={{ color: C.textSub, fontSize: 12 }}>{sessionId ? `Context: ${sessionId.slice(0, 8)}` : 'Rule Engine · RAG Search'}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 6px rgba(22,163,74,0.5)' }} />
          <span style={{ color: '#16a34a', fontSize: 11, fontWeight: 600 }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, background: C.card }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 30, height: 30, background: '#eff6ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Zap size={14} color={C.blue} />
              </div>
            )}
            <div style={{
              maxWidth: '78%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background: msg.role === 'user' ? C.blueLight : '#f8faff',
              border: `1px solid ${msg.role === 'user' ? 'rgba(37,99,235,0.25)' : C.border}`,
              color: C.navy,
              fontSize: 14,
              lineHeight: 1.6,
            }}>
              {msg.role === 'assistant' && (
                <div style={{ marginBottom: 6, display: 'flex', gap: 6 }}>
                  <span style={{ background: '#eff6ff', color: C.blue, padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>
                    {(msg as any).badge || 'Advisor'}
                  </span>
                  {(msg as any).tier === 2 && (
                    <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 600 }}>
                      RAG Verified
                    </span>
                  )}
                </div>
              )}
              {msg.content}
              {msg.role === 'assistant' && (msg as any).sources?.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(10,22,40,0.05)', fontSize: 11, color: C.textSub }}>
                  Sources: {(msg as any).sources.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 30, height: 30, background: '#eff6ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={14} color={C.blue} />
            </div>
            <div style={{ padding: '14px 18px', borderRadius: '12px 12px 12px 4px', background: '#f8faff', border: `1px solid ${C.border}`, display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: C.blue, animation: 'typing-bounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{ padding: '8px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, overflowX: 'auto', flexWrap: 'nowrap', background: '#f8faff' }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            style={{
              whiteSpace: 'nowrap',
              padding: '5px 12px', borderRadius: 14,
              border: `1px solid rgba(37,99,235,0.2)`,
              background: '#eff6ff',
              color: C.blue, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s', flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#dbeafe')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#eff6ff')}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '16px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 0 }}>
        <input
          className="qa-chat-input"
          placeholder="Ask about your security results..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          style={{
            padding: '10px 18px',
            background: isTyping || !input.trim() ? '#94a3b8' : C.navy,
            border: 'none', borderRadius: '0 8px 8px 0',
            cursor: isTyping || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s', color: '#ffffff',
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
