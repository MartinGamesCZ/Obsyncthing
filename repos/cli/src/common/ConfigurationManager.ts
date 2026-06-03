import Conf from "conf";
import { IS_DEV } from "../config";

export class ConfigurationManager {
  static #instance: ConfigurationManager;

  #config = new Conf({ projectName: `obsyncthing${IS_DEV ? ".dev" : ""}` });

  private constructor() {}

  static get instance() {
    if (!ConfigurationManager.#instance)
      ConfigurationManager.#instance = new ConfigurationManager();

    return ConfigurationManager.#instance;
  }

  set(key: string, value: string) {
    this.#config.set(key, value);
  }

  get(key: string): string {
    return this.#config.get(key) as string;
  }
}
