interface RuntimeConfig {
    apiBaseUrl: string
}

const defaultApiBaseUrl = import.meta.env.DEV
    ? 'http://127.0.0.1:5000'
    : 'https://dev.how-to-navigate.ru';
const envHost = import.meta.env.VITE_HOST as string | undefined;

function resolveApiBaseUrl(host: string | undefined): string {
    if (!host) {
        return defaultApiBaseUrl;
    }
    const trimmed = host.replace(/\/+$/, '');
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    return `https://${trimmed}`;
}

export const runtimeConfig: RuntimeConfig = {
    apiBaseUrl: resolveApiBaseUrl(envHost)
};
