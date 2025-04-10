export function GenerateRandomId(prefix?: string): string {
  const randomPart = Math.floor(Math.random() * 1000000);
  return `${prefix || 'ID'}-${randomPart}-${Date.now()}`;
}

export function generateApiKey(length: number = 32): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);

    for (let i = 0; i < length; i++) {
      result += characters.charAt(values[i] % characters.length);
    }
    return result;
  }

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
