import { useEffect } from "react";

/**
 * Convenience hook that enables async effects
 * 
 * Use it like useEffect
 */
export default function useAsyncEffect(effect: () => Promise<void> | void, deps: React.DependencyList | undefined) {
  useEffect(() => { effect(); }, deps);
}
