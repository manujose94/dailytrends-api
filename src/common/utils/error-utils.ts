export function isDuplicateKeyError(
  error: unknown
): error is { code: number; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  );
}
