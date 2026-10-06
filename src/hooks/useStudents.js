import { useState, useEffect } from 'react';
import { studentsAPI } from '../service/api';

export default function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  useEffect(() => {
    let mounted = true;
    studentsAPI
      .get()
      .then((result) => {
        if (!mounted) return;
        setStudents(Array.isArray(result) ? result : []);
        setSource('api');
      })
      .catch(() => {
        if (!mounted) return;
        setStudents([]);
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

  return { students, setStudents, loading, error, source };
}
