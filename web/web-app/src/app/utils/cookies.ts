export function deleteCookie(name: string): void {
  // TODO
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null; // not found
}