export async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}