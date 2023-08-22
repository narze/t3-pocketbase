import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

export default function Home() {
  const me = api.example.me.useQuery();
  const posts = api.example.listPosts.useQuery();
  const logout = api.example.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  return (
    <>
      <Head>
        <title>T3 + PocketBase</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="space-x-3 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">T3</span>
            <span>+</span>
            <span className="text-[hsl(280,100%,70%)]">PocketBase</span>
          </h1>

          <div className="text-white">
            {me.isLoading ? (
              "Loading..."
            ) : me.data ? (
              <div className="flex flex-col items-center gap-4">
                <div>Logged in as {me.data.email}</div>
                <div>
                  <button
                    onClick={() => logout.mutate()}
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href={"/login"}>Login</Link>
            )}

            {posts.error ? `An error occurred ${posts.error.message}` : null}
          </div>

          {posts.data ? (
            <div className="space-y-4 text-white">
              <h1 className="text-center text-4xl">Posts</h1>

              {me.data ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                  {posts.data.posts.items.map((post) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                    >
                      <h3 className="text-2xl font-bold">{post.title}</h3>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm">Login to see posts</p>
              )}
            </div>
          ) : (
            <div className="text-2xl text-white">Loading posts...</div>
          )}
        </div>
      </main>
    </>
  );
}
