import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const authorityUrl = import.meta.env.VITE_OIDC_AUTHORITY || 'https://login.microsoftonline.com/080a273d-0c4d-43be-9830-5550572495f4/v2.0';
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID || '8844a24a-024e-4693-bce6-4ebe77f7ebc2';
const scopes = import.meta.env.VITE_OIDC_SCOPES || 'openid profile email api://b7a5162e-7a12-4eaa-b6d7-80f838db8e26/padrao';
const baseAppUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173/';

const oidcConfig = {
  authority: authorityUrl,
  client_id: clientId,
  redirect_uri: `${baseAppUrl}login/callback`,
  post_logout_redirect_uri: baseAppUrl,
  response_type: "code",
  scope: scopes,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcConfig);
