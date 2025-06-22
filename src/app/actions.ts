// src/app/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// toast는 클라이언트에서만 호출 가능하므로 서버 액션에서는 제거합니다.

// 로그아웃 액션
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/login");
}

// 글 제출 액션
export async function submitPost(formData: FormData) {
  const supabase = createClient();
  const content = formData.get("content") as string;

  if (!content) {
    // 클라이언트에서 처리하도록 에러 메시지만 반환할 수 있습니다.
    // 여기서는 간단하게 리디렉션합니다.
    return redirect("/");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  
  const { data: existingPost } = await supabase
    .from("posts")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", `${todayStr}T00:00:00.000Z`)
    .lte("created_at", `${todayStr}T23:59:59.999Z`)
    .single();

  if (existingPost) {
     console.log("오늘 이미 글을 작성했습니다.");
     return redirect("/");
  }

  const { error: insertError } = await supabase.from("posts").insert({ user_id: user.id, content });
  if (insertError) {
    console.error("Insert Error:", insertError);
    return redirect("/?error=post_insert_failed");
  }

  const { data: profile } = await supabase.from("profiles").select("streak, last_posted_at").eq("id", user.id).single();
  if (!profile) throw new Error("프로필을 찾을 수 없습니다.");

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastPostedDate = profile.last_posted_at ? new Date(profile.last_posted_at) : null;
  let newStreak = profile.streak;

  if (!lastPostedDate || lastPostedDate.toDateString() === yesterday.toDateString()) {
      newStreak++;
  } else if (lastPostedDate.toDateString() !== today.toDateString()) {
      newStreak = 1;
  }
  
  await supabase
      .from("profiles")
      .update({ streak: newStreak, last_posted_at: today.toISOString() })
      .eq("id", user.id);

  revalidatePath("/");
  revalidatePath("/my-posts");
  return redirect("/");
}