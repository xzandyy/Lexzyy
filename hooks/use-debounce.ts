import { useMemo, useEffect } from "react";
import debounce from "lodash/debounce";

export function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number) {
  const debouncedCallback = useMemo(() => debounce(callback, delay), [callback, delay]);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}
