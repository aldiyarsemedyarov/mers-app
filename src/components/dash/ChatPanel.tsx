'use client';

import { useState } from 'react';

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'agent',
      text: "Hey Aldiyar! I'm monitoring your store right now. Revenue is up 15% vs last week. What would you like me to work on?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', text: input }]);
    setInput('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Got it! I'll analyze that for you. Give me a moment...",
        "Let me pull the latest data from Shopify and Meta Ads...",
        "On it! This will take about 30 seconds to process.",
      ];
      setMessages((prev) => [
        ...prev,
        { type: 'agent', text: responses[Math.floor(Math.random() * responses.length)] },
      ]);
    }, 1500);
  };

  return (
    <>
      <button className="chat-toggle has-badge" onClick={() => setIsOpen(!isOpen)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </button>

      <div className={`chat-panel${isOpen ? ' open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-left">
            <span className="status-dot" style={{ width: '7px', height: '7px' }}></span>
            <h4>Chat with Mers</h4>
          </div>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.type}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className={`chat-typing${isTyping ? ' show' : ''}`}>Mers is thinking...</div>

        <div className="chat-input-wrap">
          <input
            className="chat-input"
            placeholder="Ask Mers anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <button className="chat-send" onClick={sendMessage}>
            →
          </button>
        </div>
      </div>
    </>
  );
}
