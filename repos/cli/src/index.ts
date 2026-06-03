import pkg from "../package.json";
import { LoginCommand } from "./commands/login";

const commands = {
  login: LoginCommand,
};

const subcommand = process.argv[2] ?? "";

console.log(`$ obsync@${pkg.version} ${subcommand}`);

const cmd = commands[subcommand as keyof typeof commands];

if (!cmd) {
  console.error(`Command "${subcommand}" not found`);
  process.exit(1);
}

await new cmd().run();
