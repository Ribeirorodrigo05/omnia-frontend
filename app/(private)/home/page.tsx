"use client";
import { userAtom } from "@/atoms/user";
import { useAtom } from "jotai";

export default function HomePage() {
  const [user] = useAtom(userAtom);
  return <div>{JSON.stringify(user)}</div>;
}
