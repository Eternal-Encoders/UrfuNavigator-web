interface RuntimeConfig {
    apiBaseUrl: string
}

const defaultApiBaseUrl = 'https://dev.how-to-navigate.ru/api';
const envHost = import.meta.env.VITE_HOST as string | undefined;

const runtimeConfig: RuntimeConfig = {
    apiBaseUrl: (envHost ? `https://${envHost}` : defaultApiBaseUrl)
};

export default runtimeConfig;
