import { useState, useEffect } from 'react';
import api from '../../lib/api';

export const useSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/sessions');
            setSessions(res.data.sessions);
        } catch (error) {
            console.error('Failed to fetch sessions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateInfra = async (formData: FormData) => {
        try {
            const res = await api.post('/validate', formData);

            return res.data.sessionId;
        } catch (error) {
            console.error('Validation dispatch failed', error);
            throw error;
        }
    };

    const getSessionDetails = async (id: string) => {
        const res = await api.get(`/sessions/${id}`);
        return res.data;
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    return { sessions, isLoading, fetchSessions, validateInfra, getSessionDetails };
};
