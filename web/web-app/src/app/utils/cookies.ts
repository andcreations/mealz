export function deleteCookie(name: string): void {
  const a = getCookie(name);
  console.log('a', a);
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost`;
  const b = getCookie(name);
  console.log('b', b);
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null; // Not found
}