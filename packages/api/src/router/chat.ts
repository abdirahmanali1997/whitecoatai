import { OpenAIChat } from "langchain/llms";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.chat.findMany({ orderBy: { id: "asc" } });
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.chat.findFirst({ where: { id: input } });
  }),
  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const previousChats = await ctx.prisma.chat.findMany({
        orderBy: { id: "asc" },
      });

      let prefixMessages: any = [
        { role: "system", content: "You are a helpful assistant" },
      ];

      // ** You can add in "context" for your chats by alternating user and assistant messages **
      previousChats.forEach((chat: any) => {
        prefixMessages.push({
          role: "user",
          content: chat.title,
        });
        prefixMessages.push({
          role: "assistant",
          content: chat.content,
        });
      });

      const model = new OpenAIChat({
        modelName: "gpt-3.5-turbo",
        prefixMessages: prefixMessages,
      });

      const res = await model.call(input.title);

      return ctx.prisma.chat.create({
        data: {
          title: input.title,
          content: res,
        },
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.chat.deleteMany({});
  }),
});
