import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import PocketBase from "pocketbase";

const pb = new PocketBase("https://9tool-pb.narze.live");

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  listPosts: publicProcedure.query(async () => {
    const results = await pb.collection("posts").getList(1, 50, {
      // filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
    });

    return {
      posts: results,
    };
  }),
});
