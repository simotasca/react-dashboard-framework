import { useState } from "react";

type Setter<T> = <K extends keyof T>(key: K, val: T[K]) => void;
type Getter<T> = <K extends keyof T>(key: K) => T[K];

export function useObjectState<T>(initialState: T | (() => T)) {
  const [value, setValue] = useState<T>(initialState);
  const { set, setter, get } = useObject(value, setValue);
  return { value, setValue, set, setter, get };
}

export function useObject<T>(value: T, setValue: React.Dispatch<React.SetStateAction<T>>) {
  const { set, setter } = useSetter(setValue);
  const get: Getter<T> = <K extends keyof T>(key: K): T[K] => value[key];
  return { set, setter, get }
}

export function useSetter<T>(setValue: React.Dispatch<React.SetStateAction<T>>) {
  const set: Setter<T> = <K extends keyof T>(key: K, val: T[K]) => setValue((prev) => ({ ...prev, [key]: val }));
  const setter = <K extends keyof T>(key: K) => (val: T[K]) => setValue((prev) => ({ ...prev, [key]: val }));
  return { set, setter };
}