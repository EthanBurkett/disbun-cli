import { Client } from "disbun";

export default (client: Client) => {
  client.on("{event_name}", async () => {
    // Your code here
  });
};
