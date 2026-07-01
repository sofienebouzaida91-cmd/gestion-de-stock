import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ total: 0, expiringCount: 0, lowCount: 0, alertTotal: 0 });
  const [expiring, setExpiring] = useState([]);
  const [low, setLow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getInventory();
      setItems(data.items);
      setSummary(data.summary);
      setExpiring(data.expiring);
      setLow(data.low);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const consume = useCallback(
    async (id) => {
      setItems((prev) => prev.filter((it) => it.id !== id));
      setExpiring((prev) => prev.filter((it) => it.id !== id));
      await api.consumeItem(id);
      refresh();
    },
    [refresh]
  );

  const addToList = useCallback(
    async (id) => {
      setLow((prev) => prev.map((it) => (it.id === id ? { ...it, addedToList: true } : it)));
      await api.addToList(id);
      refresh();
    },
    [refresh]
  );

  const value = useMemo(
    () => ({ items, summary, expiring, low, loading, error, refresh, consume, addToList }),
    [items, summary, expiring, low, loading, error, refresh, consume, addToList]
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}
