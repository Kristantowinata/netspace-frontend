"use client";

import React, { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="chat-input">
      <div className="chat-input__bar">
        <input
          type="text"
          className="chat-input__field"
          placeholder="Tulis pesan..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={`chat-input__send ${hasText ? "chat-input__send--active" : ""}`}
          onClick={handleSend}
          disabled={!hasText}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>

      <style jsx>{`
        .chat-input {
          padding: 8px 14px 16px;
          position: relative;
          z-index: 1;
        }

        .chat-input__bar {
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 22px;
          padding: 8px 8px 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-input__field {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 14px;
          font-family: inherit;
          color: white;
        }

        .chat-input__field::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .chat-input__send {
          width: 40px;
          height: 40px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .chat-input__send--active {
          background: linear-gradient(135deg, #3864ff, #6438ff);
          color: white;
          box-shadow: 0 2px 12px rgba(56, 100, 255, 0.4);
        }

        .chat-input__send:disabled {
          cursor: default;
        }

        .chat-input__send--active:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
