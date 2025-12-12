import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const oidcConfig = {
  authority: "https://login.microsoftonline.com/080a273d-0c4d-43be-9830-5550572495f4/v2.0",
  client_id: "8844a24a-024e-4693-bce6-4ebe77f7ebc2",
  redirect_uri: "http://localhost:5173/login/callback",
  post_logout_redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "openid profile email api://b7a5162e-7a12-4eaa-b6d7-80f838db8e26/padrao",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcConfig);
