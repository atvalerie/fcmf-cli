export function isValidTimestamp(timestamp: string): boolean {
  const num = Number(timestamp);
  return !isNaN(num) && !isNaN(new Date(num).getTime());
}