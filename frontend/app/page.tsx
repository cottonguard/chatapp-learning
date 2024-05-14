import { createPost } from "./actions";
import { PostForm } from "./form";
import { Posts } from "./posts";

export default async function Home() {
  const res = await fetch("http://localhost:5000/posts", {
    next: { tags: ["posts"] }
  });
  const posts = await res.json();

  return (
    <main className="container mx-auto">
      <div className="flex flex-row">
        <div className="md:shrink-0 w-80">

        </div>

        <div className="relative grow">
          <div className="sticky top-0 z-20 pt-6 bg-white">
            <PostForm action={createPost} />
          </div>
          <Posts posts={posts} />
        </div>

        <div className="md:shrink-0 w-80">

        </div>
      </div>
    </main>
  );
}
