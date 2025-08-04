import { useCallback, useState } from "react";

export function useArray<T>(initial?: T[]) {
  const [array, setArray] = useState<T[]>(initial || []);
  const pushItem = useCallback((item: T) => setArray((curr) => [...curr, item]), [setArray]);
  return [array, setArray, pushItem] as const;
}
