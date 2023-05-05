import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut } from "next-auth/react";

import { api, type RouterOutputs } from "~/utils/api";

const ChatCard: React.FC<{
  chat: RouterOutputs["chat"]["all"][number];
}> = ({ chat }) => {
  return (
    <div className="flex flex-row rounded-lg bg-gray-300/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow">
        <p className="my-2 text-sm font-bold">{chat.title}</p>
        <p className="text-sm font-bold text-indigo-600">{chat.content}</p>
      </div>
    </div>
  );
};

const SubmitPrompt: React.FC = () => {
  const utils = api.useContext();

  const [title, setTitle] = useState("");

  const { mutate, error } = api.chat.create.useMutation({
    async onSuccess() {
      setTitle("");
      await utils.chat.all.invalidate();
    },
  });

  return (
    <div className="absolute bottom-4 w-3/4 max-w-3xl sm:w-full">
      <div className="flex content-center items-center justify-center p-4">
        <input
          className="mr-4 min-w-full rounded bg-gray-500/10 p-2 text-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type in a prompt..."
        />
        <button
          className="rounded bg-indigo-600 p-2 font-bold text-white"
          onClick={() => {
            mutate({
              title,
            });
          }}
        >
          Send
        </button>
      </div>
      {error?.data?.zodError?.fieldErrors.title && (
        <span className="mb-2 text-red-400">
          {error.data.zodError.fieldErrors.title}
        </span>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  const chatQuery = api.chat.all.useQuery();

  const deleteChatMutation = api.chat.delete.useMutation({
    onSettled: () => chatQuery.refetch(),
  });

  return (
    <>
      <Head>
        <title>ChatGPT Starter Kit</title>
        <meta
          name="description"
          content="A starter template kit for using ChatGPT. Built on T3"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center text-gray-700">
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-[3rem]">
            A Starter Kit for a Full-Stack{" "}
            <span className="text-indigo-600">ChatGPT</span> Web App
          </h1>
          <AuthShowcase />

          {chatQuery.data ? (
            <div className="w-full max-w-3xl">
              {chatQuery.data?.length === 0 ? (
                <span>
                  There are no chats! Type something in below to get started
                </span>
              ) : (
                <div className="flex h-[50vh] justify-center overflow-y-scroll px-4 text-2xl">
                  <div className="flex w-full flex-col gap-4">
                    {chatQuery.data?.map((p: any) => {
                      return <ChatCard key={p.id} chat={p} />;
                    })}
                    <div>
                      <span
                        className="cursor-pointer text-sm font-bold uppercase text-indigo-400"
                        onClick={() => deleteChatMutation.mutate("")}
                      >
                        🗑 Clear chat
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}

          <SubmitPrompt />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: session } = api.auth.getSession.useQuery();

  const { data: _secretMessage } = api.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: !!session?.user },
  );

  return (
    <div className="my-4 flex flex-col items-center justify-center gap-4">
      {session?.user && (
        <p className="text-center text-2xl text-gray-700">
          {session && <span>Logged in as {session?.user?.name}</span>}
        </p>
      )}
      <button
        className="rounded-full bg-gray-700/10 px-10 py-3 font-semibold text-gray-900 no-underline transition hover:bg-gray-700/20"
        onClick={session ? () => void signOut() : () => void signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
