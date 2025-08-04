import { useStorage } from "./useStorage";

/** Syncronizes a react state with a local storage item. The item should be in JSON encoded format */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  return useStorage(localStorage, key, defaultValue);
}
