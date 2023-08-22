import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  listPosts: publicProcedure.query(async ({ ctx }) => {
    const results = await ctx.pb.collection("posts").getList(1, 50, {
      // filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
    });

    return {
      posts: results,
    };
  }),
  getPost: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.pb.collection("posts").getOne(input.id);

      return result;
    }),
  login: publicProcedure
    .input(z.object({ usernameOrEmail: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input: { usernameOrEmail, password } }) => {
      const authData = await ctx.authWithPassword(usernameOrEmail, password);

      return authData;
    }),
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.logout();

    return true;
  }),
  me: publicProcedure.query(({ ctx }) => {
    const user = ctx.pb.authStore.model;

    return user;
  }),
});
