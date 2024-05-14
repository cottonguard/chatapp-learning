"use client"

import React, { useState } from "react";
import { deletePost, updatePost } from "./actions";
import { PostForm } from "./form";

interface Post {
  id: number;
  title: string,
  text: string,
  created_at: string
}

export function Post({ post }: { post: Post }) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="group relative py-2 px-2 hover:bg-gray-50">
      {
        isEdit
          ? <PostEditForm post={post} onClose={() => setIsEdit(false)} />
          : <PostContent post={post} onOpenEdit={() => setIsEdit(true)} />
      }
    </div>
  );
}

function PostContent({ post, onOpenEdit }: { post: Post, onOpenEdit: () => void }) {
  return (<div>
    <div>
      <span className="font-bold">
        {
          post.title
            ? post.title
            : <span className="opacity-50 italic">no title</span>
        }
      </span>
      <span className="text-sm opacity-50"> - {post.created_at}</span>
    </div>
    <div className="whitespace-pre-wrap">
      {post.text}
    </div>
    <div className="collapse group-hover:visible">
      <div className="absolute right-0 inset-y-0 z-10 p-2 flex flex-row items-center gap-2">
        <EditButton onClick={() => onOpenEdit()} />
        <DeleteButton id={post.id} />
      </div>
    </div>
  </div>);
}

export function Posts({ posts }: { posts: [Post] }) {
  const items = posts ? posts.map(post => <Post post={post} key={post.id} />) : "loading";

  return (
    <div className="py-8 divide-y">{items}</div>
  );
}

function CircleButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="rounded-full bg-black text-white shadow-md p-2" {...props} />
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <CircleButton onClick={onClick}>
      <EditIcon />
    </CircleButton>
  );
}

function DeleteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function DeleteButton({ id }: { id: number }) {
  return (
    <CircleButton onClick={() => deletePost(id)}>
      <DeleteIcon />
    </CircleButton>
  );
}

function PostEditForm({ post, onClose }: { post: Post, onClose: () => void }) {
  return (
    <div>
      <button onClick={() => onClose()}>
        <CloseIcon />
      </button>
      <PostForm
        title={post.title}
        text={post.text}
        action={(title, text) => {
          updatePost(post.id, title, text);
          onClose();
        }}
      />
    </div>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}