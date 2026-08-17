import { useEffect, useRef } from "react";

// Runs `callback` every `delay` ms without restarting the interval when the
// callback identity changes across renders (avoids resetting the timer on
// every keystroke/state change). Pass delay=null to pause polling.
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
