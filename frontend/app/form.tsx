"use client"

import { FormEvent, useState } from "react";

export function PostForm({ action, ...props }: {
  action: (title: string, text: string) => void,
  title?: string,
  text?: string
}) {
  const [title, setTitle] = useState(props.title || "");
  const [text, setText] = useState(props.text || "");

  function handleSubmit(e: FormEvent) {
    // e.preventDefault();
    setTitle("");
    setText("");
  }

  return (
    <form
      className="flex flex-col gap-2"
      action={() => action(title, text)}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name=""
        id=""
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full"
      />
      <textarea
        name=""
        id=""
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Text"
        className="w-full"
      />
      <button type="submit" className="py-2 bg-black text-white">
        POST
      </button>
    </form>
  );
}