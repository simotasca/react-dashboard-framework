import { useState } from "react";

export function useArray<T>(initial?: T[]): [T[], React.StateSetter<T[]>, (item: T) => void];
export function useArray<T>(initial?: T[]) {
  const [array, setArray] = useState<T[]>(initial || []);
  const pushItem = (item: T) => setArray((curr) => [...curr, item]);
  return [array, setArray, pushItem];
}
