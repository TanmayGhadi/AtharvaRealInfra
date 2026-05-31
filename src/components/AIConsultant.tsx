"use client";

import { useState } from "react";
import styles from "./AIConsultant.module.css";

export default function AIConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome to Atharva Real Infra. I'm your AI Property Consultant. How can I assist you with your investment today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        text: "Thank you for your inquiry. One of our senior property consultants will reach out to you shortly to discuss prime opportunities in Sindhudurg." 
      }]);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      {isOpen ? (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div>
              <h4 className={styles.title}>AI Property Consultant</h4>
              <span className={styles.status}>● Online</span>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
                {msg.text}
              </div>
            ))}
          </div>
          
          <form className={styles.inputArea} onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type your question..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.sendBtn}>Send</button>
          </form>
        </div>
      ) : (
        <button className={styles.floatingBtn} onClick={() => setIsOpen(true)}>
          <span className={styles.icon}>✧</span>
          <span className={styles.text}>Ask AI Consultant</span>
        </button>
      )}
    </div>
  );
}
