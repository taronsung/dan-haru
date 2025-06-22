// src/app/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// toast는 클라이언트에서만 호출 가능하므로 서버 액션에서는 제거합니다.

// 로그아웃 액션
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    // Redirect with error message
    return redirect("/login?error=signout_failed");
  }
  return redirect("/login");
}

// 글 제출 액션
export async function submitPost(formData: FormData) {
  const supabase = createClient();
  const content = formData.get("content") as string;

  if (!content) {
    // Redirect with error message
    return redirect("/?error=empty_content");
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return redirect("/login?error=not_authenticated");
  }

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  
  const { data: existingPost, error: existingPostError } = await supabase
    .from("posts")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", `${todayStr}T00:00:00.000Z`)
    .lte("created_at", `${todayStr}T23:59:59.999Z`)
    .single();

  if (existingPostError && existingPostError.code !== 'PGRST116') { // PGRST116: No rows found
    return redirect("/?error=fetch_existing_post_failed");
  }

  if (existingPost) {
    return redirect("/?error=already_posted_today");
  }

  const { error: insertError } = await supabase.from("posts").insert({ user_id: user.id, content });
  if (insertError) {
    return redirect("/?error=post_insert_failed");
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("streak, last_posted_at").eq("id", user.id).single();
  if (profileError || !profile) {
    return redirect("/?error=profile_not_found");
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastPostedDate = profile.last_posted_at ? new Date(profile.last_posted_at) : null;
  let newStreak = profile.streak;

  if (!lastPostedDate || lastPostedDate.toDateString() === yesterday.toDateString()) {
      newStreak++;
  } else if (lastPostedDate.toDateString() !== today.toDateString()) {
      newStreak = 1;
  }
  
  const { error: updateError } = await supabase
      .from("profiles")
      .update({ streak: newStreak, last_posted_at: today.toISOString() })
      .eq("id", user.id);
  if (updateError) {
    return redirect("/?error=profile_update_failed");
  }

  revalidatePath("/");
  revalidatePath("/my-posts");
  return redirect("/");
}