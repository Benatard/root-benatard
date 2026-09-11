export async function syncList(api, prevItems, items) {
  const prevIds = new Set((prevItems || []).map((item) => item.id));
  const current = new Map(items.map((item) => [item.id, item]));

  for (const id of prevIds) {
    if (!current.has(id)) await api.remove(id);
  }
  for (const item of items) {
    if (prevIds.has(item.id)) await api.update(item.id, item);
    else await api.create(item);
  }
}