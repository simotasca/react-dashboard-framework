import { useState } from "react";

/**
 * Syncronizes a react state with a session storage item. The item should be in JSON encoded format
 */
export function useSessionStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<T>] {
  const [value, setValue] = useState<T>(() => {
    let storageItem = sessionStorage.getItem(key);
    if (!storageItem) {
      sessionStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(storageItem) as T;
    } catch(err) {
      console.error("useSessionStorage could not parse stored json item", err);
      return defaultValue;
    }
  });

  const setSessionValue = (newValue: T | ((prevState: T) => T)) => {
    setValue((prev) => {
      const processed = typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue;
      sessionStorage.setItem(key, JSON.stringify(processed));
      return processed;
    });
  };

  return [value, setSessionValue];
}
