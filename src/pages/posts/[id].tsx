import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Post() {
  const router = useRouter();
  const post = api.post.getPost.useQuery({ id: router.query.id as string });

  if (post.isLoading) {
    return <>Loading...</>;
  }

  if (post.error) {
    return <>An error occurred {post.error.message}</>;
  }

  return (
    <main className="container mx-auto space-y-4">
      <Link href="/">Back</Link>
      <h1 className="text-3xl">{post.data.title}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: post.data.description as string }}
      ></div>
    </main>
  );
}
