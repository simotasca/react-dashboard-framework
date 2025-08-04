import { useStorage } from "./useStorage";

/** Syncronizes a react state with a session storage item. The item should be in JSON encoded format */
export function useSessionStorage<T>(key: string, defaultValue: T) {
  return useStorage(sessionStorage, key, defaultValue);
}
