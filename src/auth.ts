import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { useEnvConfig } from "./utils/env-config";

const env = useEnvConfig();
const baseURI = env.APP_OIDC_BASE_URL || 'http://localhost:5173/';

const oidcConfig = {
  authority: env.APP_OIDC_AUTHORITY || 'https://login.microsoftonline.com/080a273d-0c4d-43be-9830-5550572495f4/v2.0',
  client_id: env.APP_OIDC_CLIENT_ID || '8844a24a-024e-4693-bce6-4ebe77f7ebc2',
  redirect_uri: `${baseURI}login/callback`,
  post_logout_redirect_uri: baseURI,
  response_type: "code",
  scope: env.APP_OIDC_SCOPES || 'openid profile email api://b7a5162e-7a12-4eaa-b6d7-80f838db8e26/padrao',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcConfig);

export interface LoginState {
  returnUrl: string;
}
