import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const PromosContext = createContext(null);

export function PromosProvider({ children }) {
  const [all, setAll] = useState([]);
  const [home, setHome] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await api.getPromos();
    setAll(data.all);
    setHome(data.home);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => ({ all, home, loading, refresh }), [all, home, loading, refresh]);

  return <PromosContext.Provider value={value}>{children}</PromosContext.Provider>;
}

export function usePromos() {
  const ctx = useContext(PromosContext);
  if (!ctx) throw new Error('usePromos must be used within PromosProvider');
  return ctx;
}
