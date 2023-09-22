import { Client } from "disbun";

new Client({
  commandsDir: "src/commands",
  intents: ["Guilds", "GuildMessages"],
}).login(process.env.BOT_TOKEN);
