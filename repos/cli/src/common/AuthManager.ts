import {
  discovery,
  initiateDeviceAuthorization,
  pollDeviceAuthorizationGrant,
  refreshTokenGrant,
} from "openid-client";
import { ConfigurationManager } from "./ConfigurationManager";
import { importJWK, jwksCache, jwtDecrypt, jwtVerify, type JWK } from "jose";
import axios from "axios";

export class AuthManager {
  static #instance: AuthManager;

  #issuerUrl: string = process.env.OIDC_ISSUER ?? "";
  #clientId: string = process.env.OIDC_CLIENT_ID ?? "";
  #jwksUrl: string = process.env.OIDC_JWKS ?? "";

  #config = {
    scope: "openid offline_access profile email api:access api:admin",
    resource: process.env.API_URL ?? "",
  };

  private constructor() {
    if (!this.#issuerUrl || !this.#clientId || !this.#jwksUrl) {
      throw new Error(
        "Missing OIDC_ISSUER, OIDC_CLIENT_ID or OIDC_JWKS environment variable",
      );
    }
  }

  static get instance() {
    if (!AuthManager.#instance) AuthManager.#instance = new AuthManager();

    return AuthManager.#instance;
  }

  async authorizeOIDC() {
    const config = await discovery(new URL(this.#issuerUrl), this.#clientId);
    const response = await initiateDeviceAuthorization(config, this.#config);

    console.log(
      `Please enter code '${response.user_code}' at '${response.verification_uri}'.`,
    );

    const tokens = await pollDeviceAuthorizationGrant(
      config,
      response,
      this.#config,
    );

    await this.#saveTokens(tokens);

    const { payload } = await jwtVerify(
      tokens.id_token!,
      await importJWK((await this.#obtainJwks()) as JWK),
    );

    return {
      id: payload.sub,
      name: payload.name,
      username: payload.username,
      email: payload.email,
    };
  }

  async #saveTokens(tokens: {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }) {
    ConfigurationManager.instance.set("auth.access_token", tokens.access_token);
    ConfigurationManager.instance.set(
      "auth.refresh_token",
      tokens.refresh_token!,
    );
    ConfigurationManager.instance.set(
      "auth.expires_at",
      new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000).toISOString(),
    );
  }

  async #obtainJwks() {
    const { data } = await axios.get(this.#jwksUrl);

    return data.keys[0];
  }

  async getToken() {
    const accessToken = ConfigurationManager.instance.get("auth.access_token");
    const expiresAt = new Date(
      ConfigurationManager.instance.get("auth.expires_at"),
    );
    if (!accessToken)
      throw new Error("No valid session found, please login (obsync login).");

    if (Date.now() < expiresAt.getTime()) return accessToken;

    const refreshToken =
      ConfigurationManager.instance.get("auth.refresh_token");
    if (!refreshToken)
      throw new Error("No valid session found, please login (obsync login).");

    const tokens = await this.#refreshToken(refreshToken);

    await this.#saveTokens(tokens);

    return tokens.access_token;
  }

  async #refreshToken(refreshToken: string) {
    const config = await discovery(new URL(this.#issuerUrl), this.#clientId);
    const tokens = await refreshTokenGrant(config, refreshToken, this.#config);

    return tokens;
  }
}
