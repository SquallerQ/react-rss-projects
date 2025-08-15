'use client';

import { useState, useEffect } from 'react';

function useLocalStorage(key: string, initialValue: string) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const savedValue =
      typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (savedValue !== null) {
      setValue(savedValue);
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

export default useLocalStorage;
