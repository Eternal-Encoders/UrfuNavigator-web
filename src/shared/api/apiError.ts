export function apiErrorText(error: unknown): string | undefined {
    if (!error || typeof error !== 'object') {
        return undefined;
    }
    const value = error as { data?: unknown, error?: unknown };
    if (typeof value.data === 'string' && value.data.trim()) {
        return value.data;
    }
    if (typeof value.error === 'string' && value.error.trim()) {
        return value.error;
    }
    return undefined;
}
