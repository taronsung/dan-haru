// src/app/feed/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FeedUI from "./feed-ui";

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const today = new Date().toISOString().slice(0, 10);
  const { data: posts } = await supabase
    .from("posts")
    .select("id, content")
    .neq("user_id", user.id) // 내 글은 제외
    .gte("created_at", `${today}T00:00:00.000Z`)
    .lte("created_at", `${today}T23:59:59.999Z`);

  // 서버에서 포스트를 섞어줍니다 (간단한 방식)
  const shuffledPosts = posts?.sort(() => Math.random() - 0.5) || [];

  return <FeedUI posts={shuffledPosts} />;
}