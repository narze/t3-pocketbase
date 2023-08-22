import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  userProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  listPosts: userProcedure.query(async ({ ctx }) => {
    const results = await ctx.pb.collection("posts").getList(1, 50, {
      // filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
    });

    return {
      posts: results,
    };
  }),
  getPost: userProcedure
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
  logout: userProcedure.mutation(({ ctx }) => {
    ctx.logout();

    return true;
  }),
  me: userProcedure.query(({ ctx }) => {
    const user = ctx.user;

    return user;
  }),
});
