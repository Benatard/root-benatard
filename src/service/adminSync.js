export async function syncList(api, prevItems, items) {
  const previous = Array.isArray(prevItems) ? prevItems : [];
  const currentItems = Array.isArray(items) ? items : [];
  const prevIds = new Set(previous.map((item) => item.id));
  const currentIds = new Set(currentItems.map((item) => item.id));

  for (const id of prevIds) {
    if (!currentIds.has(id)) await api.remove(id);
  }

  const savedItems = [];
  for (const item of currentItems) {
    const savedItem = prevIds.has(item.id)
      ? await api.update(item.id, item)
      : await api.create(item);
    savedItems.push(savedItem ? { ...item, ...savedItem } : item);
  }
  return savedItems;
}