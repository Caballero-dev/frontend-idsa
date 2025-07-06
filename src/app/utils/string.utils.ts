export function hasText(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
