import type { Axios, ResponseType } from "axios";
import axios from "axios";
import { AuthManager } from "./AuthManager";

export class APIConnector {
  static #instance: APIConnector;

  _connector: Axios;

  private constructor() {
    this._connector = axios.create({
      baseURL: process.env.API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this._connector.interceptors.request.use(async (config) => {
      const token = await AuthManager.instance.getToken();

      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  static get instance() {
    if (!APIConnector.#instance) APIConnector.#instance = new APIConnector();

    return APIConnector.#instance;
  }

  async get<ResponseType>(endpoint: string): Promise<
    | ResponseType
    | {
        error: string;
        message: string;
      }
  > {
    const { data } = await this._connector
      .get<ResponseType>(endpoint)
      .catch((e) => e.response.data);

    return data;
  }
}
