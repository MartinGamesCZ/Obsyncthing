import { APIConnector } from "../common/APIConnector";

export class CheckAuthCommand {
  async run() {
    const res = await APIConnector.instance.get<{
      authorized: boolean;
    }>("/api/v1/users/check-auth");

    if ("authorized" in res && res.authorized) console.log("Session VALID");
    else console.log("Session INVALID");
  }
}
