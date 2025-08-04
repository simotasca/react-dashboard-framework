import { useEffect } from "react";

export function useLogger(message: any, deps?: React.DependencyList) {
  useEffect(() => console.log(message), deps);
}
