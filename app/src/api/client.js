// The dev server can't be reached at "localhost" from a physical device or the
// Android emulator — set EXPO_PUBLIC_API_URL (see app/.env.example) to your
// machine's LAN IP (e.g. http://192.168.1.23:4000) when testing on a device.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${options.method || 'GET'} ${path} failed (${res.status}): ${body}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getInventory: () => request('/api/inventory'),
  consumeItem: (id) => request(`/api/inventory/${id}`, { method: 'DELETE' }),
  addToList: (id) => request(`/api/inventory/${id}/add-to-list`, { method: 'POST' }),

  getPromos: () => request('/api/promos'),

  scanReceipt: (photo) => {
    const form = new FormData();
    if (photo) {
      form.append('photo', { uri: photo.uri, name: 'receipt.jpg', type: 'image/jpeg' });
    }
    return fetch(`${BASE_URL}/api/receipts/scan`, { method: 'POST', body: form }).then((res) => {
      if (!res.ok) throw new Error(`scan failed (${res.status})`);
      return res.json();
    });
  },
  updateReceiptItem: (receiptId, itemId, patch) =>
    request(`/api/receipts/${receiptId}/items/${itemId}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  addReceiptItem: (receiptId, item) =>
    request(`/api/receipts/${receiptId}/items`, { method: 'POST', body: JSON.stringify(item) }),
  confirmReceipt: (receiptId) => request(`/api/receipts/${receiptId}/confirm`, { method: 'POST' }),
};
