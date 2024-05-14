"use server"

import { revalidateTag } from "next/cache";

export async function createPost(title: string, text: string) {
  await fetch("http://localhost:5000/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, text })
  });
  revalidateTag("posts");
}

export async function updatePost(id: number, title: string, text: string) {
  await fetch("http://localhost:5000/posts", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id, title, text })
  });
  revalidateTag("posts");
}

export async function deletePost(id: number) {
  await fetch("http://localhost:5000/posts", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  });
  revalidateTag("posts");
}
