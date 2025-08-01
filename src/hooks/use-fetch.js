import { useState } from "react";

export default function useFetch(fn, param) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const run = async () => {
    try {
      setLoading(true);
      const res = await fn(param);
      setData(res);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, fn: run };
}
