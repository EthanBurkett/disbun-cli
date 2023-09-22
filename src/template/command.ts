import { Command, CommandType } from "disbun";

export default {
  name: "{cmd_name}",
  type: CommandType.SLASH,
  description: "Ping!",
  async run({}) {
    return "Pong!";
  },
} as Command;
