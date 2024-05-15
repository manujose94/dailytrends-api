export function normalizeProviderName(providerName: string): string {
  if (!providerName) {
    return "";
  }
  return providerName.replace(/\s+/g, "").toUpperCase();
}
