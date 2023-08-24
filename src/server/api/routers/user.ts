import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  userProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        usernameOrEmail: z.string(),
        password: z.string(),
        isAdmin: z.boolean().default(false),
      })
    )
    .mutation(
      async ({ ctx, input: { usernameOrEmail, password, isAdmin } }) => {
        const authData = await ctx.authWithPassword(
          usernameOrEmail,
          password,
          isAdmin
        );

        return authData;
      }
    ),
  logout: userProcedure.mutation(({ ctx }) => {
    ctx.logout();

    return true;
  }),
  me: userProcedure.query(({ ctx }) => {
    const user = ctx.user;

    return user;
  }),
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        passwordConfirm: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.pb.collection("users").create({
        // username: "test",
        email: input.email,
        password: input.password,
        passwordConfirm: input.passwordConfirm,
      });

      return await ctx.authWithPassword(input.email, input.password);
    }),
});
