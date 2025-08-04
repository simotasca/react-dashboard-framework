import { useState } from "react";

/** Syncronizes a react state with a Storage item. The item should be in JSON encoded format */
export function useStorage<T>(storage: Storage, key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    let storageItem = storage.getItem(key);
    if (!storageItem) {
      storage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(storageItem) as T;
    } catch(err) {
      console.error("could not parse stored json item", err);
      return defaultValue;
    }
  });

  const setSessionValue = (newValue: T | ((prevState: T) => T)) => {
    setValue((prev) => {
      const processed = typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue;
      storage.setItem(key, JSON.stringify(processed));
      return processed;
    });
  };

  return [value, setSessionValue] as const;
}
