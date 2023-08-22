import Pocketbase from "pocketbase";
import { env } from "../env.mjs";

declare global {
  // eslint-disable-next-line no-var
  var pb: Pocketbase | undefined;
}

export const pb = global.pb ?? new Pocketbase("https://9tool-pb.narze.live");

if (env.NODE_ENV !== "production") {
  pb.autoCancellation(true);
  global.pb = pb;
}
