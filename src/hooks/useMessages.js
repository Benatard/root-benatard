import { useState, useEffect, useCallback } from 'react';
import { messagesAPI, contactAPI } from '../service/api';

export default function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  useEffect(() => {
    let mounted = true;
    messagesAPI
      .get()
      .then((result) => {
        if (!mounted) return;
        setMessages(Array.isArray(result) ? result : []);
        setSource('api');
      })
      .catch(() => {
        if (!mounted) return;
        setMessages([]);
        setSource('error');
        setError(new Error('API inaccessible'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const addMessage = useCallback(async (payload) => {
    try {
      await contactAPI.sendMessage(payload);
      setSource('api');
      return { ok: true, local: false };
    } catch (err) {
      return { ok: false, local: false, error: err };
    }
  }, []);

  const toggleRead = useCallback(async (id, read) => {
    const prev = messages;
    setMessages((cur) => cur.map((m) => (m.id === id ? { ...m, read } : m)));
    try {
      await messagesAPI.markRead(id, read);
      return { ok: true };
    } catch (err) {
      setMessages(prev);
      return { ok: false, error: err };
    }
  }, [messages]);

  const removeMessage = useCallback(async (id) => {
    const prev = messages;
    setMessages((cur) => cur.filter((m) => m.id !== id));
    try {
      await messagesAPI.remove(id);
      return { ok: true };
    } catch (err) {
      setMessages(prev);
      return { ok: false, error: err };
    }
  }, [messages]);

  return { messages, setMessages, loading, error, source, addMessage, toggleRead, removeMessage };
}