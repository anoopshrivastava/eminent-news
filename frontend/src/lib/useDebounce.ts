import { useState, useEffect } from "react";

const useDebounce = (value:string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler);  // clean up previous timer on re-type
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
