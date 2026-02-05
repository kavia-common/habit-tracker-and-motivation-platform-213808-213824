import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Small helper hook for async operations.
 * Keeps React components clean and consistent.
 */

// PUBLIC_INTERFACE
export function useAsync(asyncFn, deps = [], { immediate = true } = {}) {
  /**
   * @param {Function} asyncFn - async function to execute
   * @param {Array<any>} deps - dependency list for asyncFn
   * @param {{immediate?: boolean}} options
   */
  const mountedRef = useRef(true);

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args) => {
    setStatus("loading");
    setError(null);

    try {
      const result = await asyncFn(...args);
      if (!mountedRef.current) return null;
      setValue(result);
      setStatus("success");
      return result;
    } catch (e) {
      if (!mountedRef.current) return null;
      setError(e);
      setStatus("error");
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return useMemo(
    () => ({
      execute,
      status,
      value,
      error,
      isIdle: status === "idle",
      isLoading: status === "loading",
      isSuccess: status === "success",
      isError: status === "error"
    }),
    [execute, status, value, error]
  );
}
