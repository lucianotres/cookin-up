export interface EnvConfig {
  APP_CONFIG_VERSION: number;
  APP_BASE_URL?: string;
  APP_API_BASE_URL?: string;
  APP_OIDC_AUTHORITY?: string;
  APP_OIDC_CLIENT_ID?: string;
  APP_OIDC_SCOPES?: string;
  APP_OIDC_BASE_URL?: string;
}

export function useEnvConfig(): EnvConfig {
  const config = (window as any).__APP_CONFIG__ || {};
  return config as EnvConfig;
}

export function useEnvApiBaseUrl(): string {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const env = useEnvConfig();

  return apiBaseUrl || env.APP_API_BASE_URL || 'api/';
}
