interface RuntimeConfig {
    apiBaseUrl: string
}

const defaultApiBaseUrl = import.meta.env.DEV
    ? 'http://127.0.0.1:5000'
    : 'https://test.how-to-navigate.ru';

function readHost(runtimeValue: string | undefined, builtValue: string | undefined): string | undefined {
    const runtime = runtimeValue?.trim();
    if (runtime) {
        return runtime;
    }
    const built = builtValue?.trim();
    return built || undefined;
}

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

const envHost = readHost(window.__APP_CONFIG__?.VITE_HOST, import.meta.env.VITE_HOST);

export const runtimeConfig: RuntimeConfig = {
    apiBaseUrl: resolveApiBaseUrl(envHost)
};
