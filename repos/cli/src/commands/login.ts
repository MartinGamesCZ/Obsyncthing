import { AuthManager } from "../common/AuthManager";

export class LoginCommand {
  constructor() {}

  async run() {
    const user = await AuthManager.instance.authorizeOIDC();

    console.log(`Logged in as ${user.email} [${user.name}]!`);
  }
}
