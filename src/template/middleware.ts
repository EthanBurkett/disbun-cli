import { IMiddlewareOptions, Middleware } from "disbun";

export default async ({ client, interaction, message }: IMiddlewareOptions) => {
  if (interaction.isCommand()) return Middleware.SUCCESS;
};
