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
  listPosts: publicProcedure.query(async ({ ctx }) => {
    // TODO: Wrap cookies authentication to trpc context
    const cookieString = ctx.cookies.pb_auth!;
    console.log({ ctx, cookieString });
    pb.authStore.loadFromCookie(`pb_auth=${cookieString}`);

    try {
      // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
      console.log({ authStore: pb.authStore, isValid: pb.authStore.isValid });
      pb.authStore.isValid && (await pb.collection("users").authRefresh());
    } catch (_) {
      // clear the auth store on failed refresh
      pb.authStore.clear();
    }

    const results = await pb.collection("posts").getList(1, 50, {
      // filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
    });

    return {
      posts: results,
    };
  }),
  login: publicProcedure
    .input(z.object({ usernameOrEmail: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input: { usernameOrEmail, password } }) => {
      const authData = await pb
        .collection("users")
        .authWithPassword(usernameOrEmail, password);

      console.log("cookie", pb.authStore.exportToCookie());
      ctx.setCookie(pb.authStore.exportToCookie());
      return authData;
    }),
  // TODO: logout procedure
});
