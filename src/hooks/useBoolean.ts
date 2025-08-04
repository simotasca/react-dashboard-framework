import { useState } from "react";

export function useBoolean(defaultValue = false) {
  const [val, setVal] = useState(defaultValue);
  const toggle = () => setVal((v) => !v);
  return [val, setVal, toggle] as [boolean, typeof setVal, () => void];
}
