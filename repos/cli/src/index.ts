import { configDotenv } from "dotenv";
import pkg from "../package.json";
import { LoginCommand } from "./commands/login";
import { CheckAuthCommand } from "./commands/check-auth";

configDotenv({
  quiet: true,
});

const commands = {
  login: LoginCommand,
  "check-auth": CheckAuthCommand,
};

const subcommand = process.argv[2] ?? "";

console.log(`$ obsync@${pkg.version} ${subcommand}`);

const cmd = commands[subcommand as keyof typeof commands];

if (!cmd) {
  console.error(`Command "${subcommand}" not found`);
  process.exit(1);
}

await new cmd().run();
