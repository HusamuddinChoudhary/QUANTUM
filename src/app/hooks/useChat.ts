import { useState } from 'react';
import api from '../../lib/api';

export const useChat = (sessionId: string) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'AI Security Advisor active. How can I help with this validation session?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async (question: string) => {
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        setIsTyping(true);

        try {
            const res = await api.post('/chat', { question, session_id: sessionId });
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: res.data.answer,
                badge: res.data.badge,
                tier: res.data.tier,
                sources: res.data.sources
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to reach AI advisor.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return { messages, isTyping, sendMessage };
};
