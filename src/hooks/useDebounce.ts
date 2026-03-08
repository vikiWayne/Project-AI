import { useState, useEffect, useCallback } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId) clearTimeout(timeoutId);
      const id = setTimeout(() => fn(...args), delay);
      setTimeoutId(id);
    },
    [fn, delay, timeoutId]
  );

  useEffect(() => () => { if (timeoutId) clearTimeout(timeoutId); }, [timeoutId]);

  return debouncedFn;
}
